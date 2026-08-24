-- =============================================
-- Phase 1: Security Rebuild Migration
-- =============================================

-- 1. Revoke frontend insert permissions for transactional tables
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
-- (Note: payments table already had no insert policy for regular users)

-- 2. Create an atomic inventory decrement function
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_product_id uuid,
  p_quantity int
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges
AS $$
DECLARE
  v_current_stock int;
BEGIN
  -- Lock the row for update to prevent concurrent race conditions
  SELECT stock INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  IF v_current_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current_stock, p_quantity;
  END IF;

  UPDATE public.products
  SET stock = stock - p_quantity
  WHERE id = p_product_id;

  RETURN true;
END;
$$;
