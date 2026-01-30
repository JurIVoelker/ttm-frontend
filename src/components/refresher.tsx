import { mainStore } from "@/store/main-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const pathName = usePathname();

  useEffect(() => {
    if (!pathName) return;
    const splitPath = pathName.split("/");
    if (splitPath.length <= 1) return;
    const newSlug = splitPath[1];
    const forbiddenSlugs = [
      "admins",
      "synchronisation",
      "mannschaften",
      "login",
      "benachrichtigungen",
    ];
    if (forbiddenSlugs.includes(newSlug)) return;
    mainStore.getState().setTeamSlug(newSlug);
  }, [pathName]);
  return <></>;
};

export default Refresher;
