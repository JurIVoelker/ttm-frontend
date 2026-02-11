import Layout from "@/components/layout";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import {
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  ShieldUserIcon,
  UserGroupIcon,
} from "hugeicons-react";
import { CrownIcon } from "lucide-react";

const SettingsPage = () => {
  const paths = [
    {
      name: "Mannschaften & Meldungen",
      path: "/einstellungen/mannschaften/meldungen",
      Icon: <UserGroupIcon strokeWidth={2} />,
    },
    {
      name: "Mannschaftsführer",
      path: "/einstellungen/mannschaften/mannschaftsfuehrer",
      Icon: <CrownIcon />,
    },
    {
      name: "Admins",
      path: "/einstellungen/admins",
      Icon: <ShieldUserIcon strokeWidth={2} />,
    },
    {
      name: "Spielsynchronisation",
      path: "/einstellungen/synchronisation",
      Icon: <ArrowReloadHorizontalIcon strokeWidth={2} />,
    },
  ];

  return (
    <Layout>
      <Title>Konfiguration</Title>
      <p className="text-muted-foreground mt-4">
        In den Konfigurationen kannst du die Mannschaftsmeldungen verwalten,
        die{" "}
      </p>
      <div className="space-y-2 mt-6">
        {paths.map(({ name, path, Icon }) => (
          <Button
            key={name}
            className="w-full justify-between"
            onClick={() => (window.location.href = path)}
            variant="outline"
          >
            <div className="flex items-center gap-2">
              {Icon}
              {name}
            </div>
            <ArrowRight01Icon strokeWidth={2} />
          </Button>
        ))}
        {/* <Button className="w-full">Test</Button> */}
      </div>
    </Layout>
  );
};

export default SettingsPage;

{
  /* <SidebarMenuButton onClick={() => navigate("/mannschaften")}>
<AddTeamIcon strokeWidth={2} />
Mannschaften
</SidebarMenuButton>
<SidebarMenuButton onClick={() => navigate("/admins")}>
<ShieldUserIcon strokeWidth={2} />
Admins verwalten
</SidebarMenuButton>
<SidebarMenuButton>
<ArrowReloadHorizontalIcon
  strokeWidth={2}
  onClick={() => navigate("/synchronisation")}
/>
Synchronisation
</SidebarMenuButton> */
}
