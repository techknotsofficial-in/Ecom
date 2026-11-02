-- Migration: Add hardened get_admin_dashboard_stats RPC
-- Purpose: Aggregates dashboard metrics inside PostgreSQL with zero client-side row transfer.
-- Security: SECURITY DEFINER with empty search_path, explicit schema qualification, and two-tier privilege enforcement.

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS pg_catalog.jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_admin boolean;
  v_total_products bigint;
  v_total_orders bigint;
  v_total_users bigint;
  v_pending_orders bigint;
  v_total_revenue numeric;
  v_recent_orders pg_catalog.jsonb;
BEGIN
  -- 1. Admin Authorization Gate
  -- Tier A: Allow internal service_role (e.g. backend service tasks)
  IF (SELECT auth.role()) = 'service_role' THEN
    v_is_admin := true;
  -- Tier B: For authenticated users, verify caller's UUID has 'admin' role in public.user_roles
  ELSIF (SELECT auth.uid()) IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 
      FROM public.user_roles 
      WHERE user_id = (SELECT auth.uid()) 
        AND role::text = 'admin'
    ) INTO v_is_admin;
  ELSE
    v_is_admin := false;
  END IF;

  -- Raise standard SQLSTATE 42501 (insufficient_privilege) if caller is not an admin
  IF NOT COALESCE(v_is_admin, false) THEN
    RAISE EXCEPTION 'Access denied: Administrator privileges required'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Aggregate Store Counts
  SELECT pg_catalog.count(*) INTO v_total_products FROM public.products;
  SELECT pg_catalog.count(*) INTO v_total_orders FROM public.orders;
  SELECT pg_catalog.count(*) INTO v_total_users FROM public.profiles;
  SELECT pg_catalog.count(*) INTO v_pending_orders FROM public.orders WHERE status = 'pending';
  
  -- 3. Qualifying Order Sales Value ("totalRevenue")
  -- Note on terminology: The property is named 'totalRevenue' for compatibility with Dashboard.tsx,
  -- but represents the gross qualifying sales value (GMV) of confirmed and in-flight orders.
  -- For online orders, payment is captured at checkout. For Cash on Delivery (COD), status advances
  -- to 'processing'/'shipped' prior to physical cash collection upon delivery.
  -- Excludes unfinalized checkout drafts ('pending'), stock-failed checkouts ('failed_stock'), and cancelled orders ('cancelled').
  SELECT COALESCE(pg_catalog.sum(total), 0)
  INTO v_total_revenue
  FROM public.orders
  WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered');

  -- 4. Five Most Recent Orders
  SELECT COALESCE(pg_catalog.jsonb_agg(r), '[]'::pg_catalog.jsonb)
  INTO v_recent_orders
  FROM (
    SELECT id, order_number, total, status, created_at
    FROM public.orders
    ORDER BY created_at DESC
    LIMIT 5
  ) r;

  -- 5. Return Aggregated Payload (matches Dashboard.tsx keys exactly)
  RETURN pg_catalog.jsonb_build_object(
    'totalProducts', v_total_products,
    'totalOrders', v_total_orders,
    'totalUsers', v_total_users,
    'pendingOrders', v_pending_orders,
    'totalRevenue', v_total_revenue,
    'recentOrders', v_recent_orders
  );
END;
$$;

-- 6. Explicit Privilege Management
-- Revoke default public execution privileges
REVOKE ALL ON FUNCTION public.get_admin_dashboard_stats() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_admin_dashboard_stats() FROM anon;

-- Grant execution strictly to authenticated callers (who are evaluated by the internal gate) and service_role
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated, service_role;
