import { isAdmin, isLeader, isPlayerOfTeam } from "@/lib/permission";
import { Button } from "../ui/button";
import { renewJwt } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { Logout02Icon } from "hugeicons-react";
import useAuthStore from "@/hooks/use-auth-store";
import { useState } from "react";
import ConfirmDialog from "../confirm-dialog";

const LeaveTeamButton = () => {
  const { authStore } = useAuthStore();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  if (!isPlayerOfTeam()) return null;

  const onLeaveTeam = async () => {
    if (isAdmin() || isLeader()) {
      await renewJwt({ excludePlayer: true });
      showMessage("Mannschaft erfolgreich verlassen.");
    } else {
      authStore.setJwt(null);
    }
  };

  return (
    <ConfirmDialog
      description="Möchtest du die Mannschaft wirklich verlassen?"
      onConfirm={onLeaveTeam}
      open={confirmDialogOpen}
      setOpen={setConfirmDialogOpen}
      title="Mannschaft verlassen"
    >
      <Button
        className="w-full"
        variant="secondary"
        onClick={() => setConfirmDialogOpen(true)}
      >
        <Logout02Icon strokeWidth={2} />
        Mannschaft verlassen
      </Button>
    </ConfirmDialog>
  );
};

export default LeaveTeamButton;
