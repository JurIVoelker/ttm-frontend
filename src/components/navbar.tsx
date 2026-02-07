import { Button } from "./ui/button";
import { Menu01Icon } from "hugeicons-react";
import { useSidebar } from "./ui/sidebar";

interface NavbarProps {
  menuHidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ menuHidden = false }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="p-6 flex justify-between items-center sticky top-0 md:hidden z-10 bg-glassy-b">
      <Button onClick={toggleSidebar} variant="ghost" size="icon-lg">
        {!menuHidden && <Menu01Icon size={24} />}
      </Button>
    </nav>
  );
};

export default Navbar;
