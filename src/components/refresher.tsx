import { mainStore } from "@/store/main-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const pathName = usePathname();

  useEffect(() => {
    if (!pathName) return;
    const splitPath = pathName.split("/");
    if (splitPath.length <= 1) return;
    mainStore.getState().setTeamSlug(splitPath[1]);
  }, [pathName]);
  return <></>;
};

export default Refresher;
