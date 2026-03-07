import Layout from "@/components/layout";
import LoginCard from "@/components/login/login-card";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-auth-store";
import { showMessage } from "@/lib/message";
import { authStore } from "@/store/auth-store";

const LoginPage = () => {
  const { authStore } = useAuthStore();

  const isLoggedIn =
    authStore.jwtDecoded?.roles.includes("admin") ||
    authStore.jwtDecoded?.roles.includes("leader");

  return (
    <Layout hideSidebar>
      {isLoggedIn && <LoggedIn />}
      {!isLoggedIn && (
        <div className="w-full h-full flex justify-center items-center">
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
