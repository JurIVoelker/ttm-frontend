import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import AppSidebar from "./sidebar/app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import Navbar from "./navbar";
import Refresher from "./refresher";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Refresher />
      <AppSidebar />
      <div className={cn(poppins.className, "w-full min-h-screen")}>
        <Navbar />
        <div className="px-6 pb-6 pt-16 w-full h-[calc(100vh-88px)]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
