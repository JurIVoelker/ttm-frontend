import { cn } from "@/lib/utils";
import AppSidebar from "./sidebar/app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import Navbar from "./navbar";
import Refresher from "./refresher";

const Layout = ({
  children,
  hideSidebar,
}: {
  children?: React.ReactNode;
  hideSidebar?: boolean;
}) => {
  return (
    <SidebarProvider>
      <Refresher />
      {!hideSidebar && <AppSidebar />}
      <div className={cn("w-full min-h-screen max-w-screen")}>
        <Navbar menuHidden={hideSidebar} />
        <div className="px-6 pb-6 pt-16">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
