import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HelpCircleIcon, Tick01Icon } from "hugeicons-react";
import { XIcon } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        positive: "border-positive-border bg-positive-light text-positive-dark",
        negative: "border-negative-border bg-negative-light text-negative-dark",
        neutral: "border-neutral-border bg-neutral-light text-neutral-dark",
        transparent: "bg-transparent border-background/40 text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  transparent?: boolean;
}

function Badge({
  className,
  variant,
  children,
  transparent,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant: transparent ? "transparent" : variant }),
        className,
      )}
      {...props}
    >
      {variant === "positive" && (
        <Tick01Icon className="size-4 -translate-x-0.75" strokeWidth={2} />
      )}
      {variant === "negative" && (
        <XIcon className="size-4 mr-0.75 -translate-x-0.75" strokeWidth={2} />
      )}
      {variant === "neutral" && (
        <HelpCircleIcon
          className="size-4 mr-0.75 -translate-x-0.75"
          strokeWidth={2}
        />
      )}

      {children}
    </div>
  );
}

export { Badge, badgeVariants };
