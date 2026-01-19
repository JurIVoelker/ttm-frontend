import Layout from "@/components/layout";
import { authStore } from "@/store/auth-store";
import { jwtPayload } from "@/types/auth";
import { decode } from "jsonwebtoken";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LoginCallbackPage = () => {
  const [error, setError] = useState<Error | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("jwt");

    try {
      const payload = decode(jwt || "") as jwtPayload;
      if (!payload) throw new Error("Invalid JWT token");
      authStore.getState().setJwt(jwt);
      push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("Unknown error"));
      }
    }
  }, [push]);

  return (
    <Layout>
      <Loader2 className="animate-spin" strokeWidth={2} />
      {error && <div className="text-destructive">{error.message}</div>}
    </Layout>
  );
};

export default LoginCallbackPage;
