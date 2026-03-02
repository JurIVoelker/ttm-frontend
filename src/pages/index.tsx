import Layout from "@/components/layout";
import useAuthStore from "@/hooks/use-auth-store";
import { mainStore } from "@/store/main-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { teams } = mainStore();
  const { authStore, loading } = useAuthStore();
  const { push } = useRouter();

  useEffect(() => {
    if (!loading && !authStore.jwt) {
      push("/info/login");
      return;
    }
    if (teams.length === 0) return;
    if (!authStore.jwt || !authStore.jwtDecoded) return;
    const { player, leader, admin } = authStore.jwtDecoded;
    if (player?.teams.length) {
      push(`/${player.teams[0]}`);
      return;
    } else if (leader?.teams.length) {
      push(`/${leader.teams[0]}`);
      return;
    } else if (admin) {
      push(`/${teams[0].slug}`);
      return;
    }
    push("/info/login/abgelaufen");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, authStore, loading]);

  return (
    <Layout hideSidebar>
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    </Layout>
  );
}
