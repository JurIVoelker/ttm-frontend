import AddAdminModal from "@/components/add-admin-modal";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { useFetchAdmins } from "@/hooks/use-fetch/use-fetch-admins";
import { Admin } from "@/types/admin";
import { ArrowLeft01Icon, PlusSignIcon } from "hugeicons-react";
import { User2, XIcon } from "lucide-react";
import { useRouter } from "next/router";

const AdminsPage = () => {
  const { data: admins, setData: setAdmins } = useFetchAdmins();

  const { push } = useRouter();

  const onAdd = (admin: Admin) => {
    setAdmins([...(admins || []), admin]);
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
            <Button size="icon-sm">
              <XIcon />
            </Button>
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
