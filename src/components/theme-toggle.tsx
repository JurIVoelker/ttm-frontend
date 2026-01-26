"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "next-themes";
import { SidebarMenuButton } from "./ui/sidebar";

export type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme() as {
    setTheme: (theme: Theme) => void;
    theme: Theme;
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      // umami()?.track("theme-toggle", { theme: "light" });
    } else if (theme === "light") {
      setTheme("system");
      // umami()?.track("theme-toggle", { theme: "system" });
    } else {
      setTheme("dark");
      // umami()?.track("theme-toggle", { theme: "dark" });
    }
  };

  const labels: Record<Theme, string> = {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  };

  return (
    <div>
      <SidebarMenuButton onClick={toggleTheme}>
        <span className="left-10 absolute">
          Design: {theme && labels[theme]}
        </span>
        <MoonIcon
          size={16}
          className={`absolute left-4 animate-pop-in ${
            theme === "dark" ? "" : "hidden"
          }`}
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className={`absolute left-4 animate-pop-in ${
            theme === "light" ? "" : "hidden"
          }`}
          aria-hidden="true"
        />
        <MonitorIcon
          size={16}
          className={`absolute left-4 animate-pop-in ${
            theme === "system" ? "" : "hidden"
          }`}
          aria-hidden="true"
        />
      </SidebarMenuButton>
    </div>
  );
}
