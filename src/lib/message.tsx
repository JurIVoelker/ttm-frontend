import { Tick01Icon } from "hugeicons-react";
import { XIcon } from "lucide-react";
import { ExternalToast, toast } from "sonner";

export const showMessage = (
  text: string,
  options?: {
    variant: "success" | "error";
  } & ExternalToast,
) => {
  const { variant = "success" } = options || {};

  const iconMap = {
    success: Tick01Icon,
    error: XIcon,
  };

  const iconColorMap = {
    success: "text-primary",
    error: "text-destructive",
  };

  const Icon = iconMap[variant];
  const iconColor = iconColorMap[variant];

  toast(text, {
    position: "top-center",
    icon: <Icon className={`size-5 ${iconColor}`} strokeWidth={2} />,
    duration: 5000,
    className: "justify-center",
    dismissible: true,
    ...options,
  });
};
