import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-auth-store";
import { authStore } from "@/store/auth-store";
import { GoogleIcon } from "hugeicons-react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { authStore, loading } = useAuthStore();

  return (
    <Layout>
      {!loading && (
        <>
          {authStore.jwt && <LoggedIn />}
          {!authStore.jwt && <LoggedOut />}
        </>
      )}
      {loading && <LoadingState />}
    </Layout>
  );
};

const LoadingState = () => <div>Loading...</div>;

const LoggedIn = () => {
  const onLogout = () => {
    authStore.getState().setJwt(null);
  };

  return (
    <div>
      <h1>test</h1>
      Du bist bereits eingeloggt.
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};

const LoggedOut = ({}) => {
  const { push } = useRouter();

  const onGoogleLogin = () => {
    push(`/api/auth/login/google`);
  };

  return (
    <>
      <Button onClick={onGoogleLogin}>
        <GoogleIcon strokeWidth={2} /> Login
      </Button>
    </>
  );
};

export default LoginPage;
