import AddAdminModal from "@/components/add-admin-modal";
import ConfirmDialog from "@/components/confirm-dialog";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFetchAdmins } from "@/hooks/use-fetch/use-fetch-admins";
import { sendRequest } from "@/lib/fetch-utils";
import { Admin } from "@/types/admin";
import { ArrowLeft01Icon, PlusSignIcon } from "hugeicons-react";
import { User2, X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

const AdminsPage = () => {
  const { data: admins, setData: setAdmins } = useFetchAdmins();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<null | string>(
    null,
  );

  const { push } = useRouter();

  const onAdd = (admin: Admin) => {
    setAdmins([...(admins || []), admin]);
  };

  const onRemoveAdmin = async (adminId: string) => {
    const prevState = admins;
    setAdmins(admins?.filter((a) => a.id !== adminId) || []);

    const response = await sendRequest({
      method: "DELETE",
      path: `/api/admins/${adminId}`,
    });

    if (!response.ok) {
      setAdmins(prevState || []);
      return;
    }
  };

  return (
    <Layout>
      <Title>Admins</Title>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => push("/einstellungen")}
      >
        <ArrowLeft01Icon /> Zurück
      </Button>
      <div className="space-y-4 mt-8">
        {admins?.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between border p-2 px-3 rounded-md"
          >
            <div className="flex gap-2 items-center">
              <div className="bg-secondary flex items-center justify-center rounded-full size-10">
                <User2 className="text-primary size-5.5" />
              </div>
              <div>
                <div className="translate-y-0.5">{a.fullName}</div>
                <div className="text-sm text-muted-foreground -translate-y-px">
                  {a.email}
                </div>
              </div>
            </div>
            <ConfirmDialog
              title="Löschen"
              description="Möchstest du den Admin wirklich löschen?"
              onConfirm={() => onRemoveAdmin(a.id)}
              open={openConfirmDialog === a.id}
              setOpen={(open) => setOpenConfirmDialog(open ? a.id : null)}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon-sm">
                  <X />
                </Button>
              </AlertDialogTrigger>
            </ConfirmDialog>
          </div>
        ))}

        <AddAdminModal onAdd={onAdd}>
          <Button variant="outline" className="w-full">
            <PlusSignIcon strokeWidth={2} />
            Hinzufügen
          </Button>
        </AddAdminModal>
      </div>
    </Layout>
  );
};

export default AdminsPage;
