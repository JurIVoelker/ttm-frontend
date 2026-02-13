import { mainStore } from "@/store/main-store";
import { useFetchData } from "./use-fetch";
import { isAdmin, isLeaderOfTeam } from "@/lib/permission";

const useFetchInviteToken = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const leaderOfTeam = isLeaderOfTeam();
  const admin = isAdmin();

  const data = useFetchData<{ inviteToken: string }>({
    method: "GET",
    path: `/api/team/${teamSlug}/inviteToken`,
    ready: (leaderOfTeam || admin) && Boolean(teamSlug),
    queryKey: `invite-token-${teamSlug}`,
  });

  return data;
};

export default useFetchInviteToken;
