// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/"), 3000);
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {status === "verifying" && (
        <>
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p>Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <h2 className="text-2xl font-bold mb-2">Email confirmed!</h2>
          <p>You can now sign in. Redirecting...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Verification failed</h2>
          <p>The link may be invalid or expired. Try signing up again.</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback;
