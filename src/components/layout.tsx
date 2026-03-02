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
      <div
        className={cn("w-full mx-auto min-h-screen")}
        style={{
          maxWidth: "min(100vw, 1200px)",
        }}
      >
        <Navbar menuHidden={hideSidebar} />
        <div className={cn("px-6 pb-6 pt-16 h-[calc(100vh-5.5rem)]")}>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
