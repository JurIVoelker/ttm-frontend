import { Button } from "./ui/button";
import { Menu01Icon } from "hugeicons-react";
import { useSidebar } from "./ui/sidebar";

interface NavbarProps {
  menuHidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ menuHidden = false }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="p-6 flex justify-between items-center fixed top-0 left-0 right-0 md:hidden z-50 bg-glassy-b">
      <Button onClick={toggleSidebar} variant="ghost" size="icon-lg">
        {!menuHidden && <Menu01Icon size={24} />}
      </Button>
    </nav>
  );
};

export default Navbar;
