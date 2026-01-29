import AddAdminModal from "@/components/add-admin-modal";
import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/fetch-data";
import { Admin } from "@/types/admin";
import { PlusSignIcon } from "hugeicons-react";
import { XIcon } from "lucide-react";

const AdminsPage = () => {
  const { data: admins, setData: setAdmins } = useFetchData<Admin[]>({
    method: "GET",
    path: `/api/admins`,
  });

  const onAdd = (admin: Admin) => {
    setAdmins([...(admins || []), admin]);
  };

  return (
    <Layout>
      <Title>Admins</Title>
      <div className="space-y-4 mt-6">
        {admins?.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between border p-2 px-3 rounded-md"
          >
            <div>
              <div className="translate-y-0.5">{a.fullName}</div>
              <div className="text-sm text-muted-foreground -translate-y-px">
                {a.email}
              </div>
            </div>
            <Button size="icon">
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
