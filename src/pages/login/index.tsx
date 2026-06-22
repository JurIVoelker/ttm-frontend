import Layout from "@/components/layout";
import LoginCard from "@/components/login/login-card";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-auth-store";
import { showMessage } from "@/lib/message";
import { authStore } from "@/store/auth-store";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { authStore } = useAuthStore();
  const { query } = useRouter();

  const isLoggedIn =
    authStore.jwtDecoded?.roles.includes("admin") ||
    authStore.jwtDecoded?.roles.includes("leader");

  const justRegistered = query.registered === "true";

  return (
    <Layout hideSidebar>
      {isLoggedIn && <LoggedIn />}
      {!isLoggedIn && (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
          {justRegistered && (
            <div className="w-[90%] max-w-md rounded-md border border-positive-border bg-positive-light px-4 py-3 text-sm text-positive-dark">
              Du wurdest erfolgreich registriert. Bitte logge dich jetzt ein.
            </div>
          )}
          <LoginCard />
        </div>
      )}
    </Layout>
  );
};

const LoggedIn = () => {
  const onLogout = () => {
    authStore.getState().setJwt(null);
    showMessage("Du wurdest erfolgreich ausgeloggt");
  };

  return (
    <>
      <Title>Login</Title>
      <div className="mt-6">
        Du bist bereits eingeloggt. Möchtest du dich ausloggen?
      </div>
      <Button onClick={onLogout} className="mt-3">
        Logout
      </Button>
    </>
  );
};

export default LoginPage;
