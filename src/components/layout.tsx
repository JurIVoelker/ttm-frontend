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
      <div className={cn("w-full min-h-screen")}>
        <Navbar menuHidden={hideSidebar} />
        <div className="px-6 pb-6 pt-16 w-full h-[calc(100vh-88px)] max-w-[100vw] overflow-x-auto overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
