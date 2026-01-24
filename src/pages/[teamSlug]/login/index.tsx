import Layout from "@/components/layout";
import PlayerLogin from "@/components/player-login-form";
import Title from "@/components/title";

const LoginPage = () => {
  return (
    <Layout hideSidebar>
      <Title>Login</Title>
      <PlayerLogin />
    </Layout>
  );
};

export default LoginPage;
