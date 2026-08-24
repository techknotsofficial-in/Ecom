import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {

  const navigate = useNavigate();

  useEffect(() => {

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    };

    getSession();

  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verifying your email...</h2>
    </div>
  );
}