import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructiveLight:
          "bg-destructive/10 text-destructive hover:bg-destructive/5 focus-visible:ring-destructive dark:focus-visible:ring-destructive/40 dark:bg-destructive/30",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 font-medium",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium ",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        positive:
          "bg-positive-light border border-positive-border text-positive-dark hover:bg-positive-light/70 font-medium",
        negative:
          "bg-negative-light border border-negative-border text-negative-dark hover:bg-negative-light/70 font-medium",
        neutral:
          "bg-neutral-light border border-neutral-border text-neutral-dark hover:bg-neutral-light/70 font-medium",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const [isClicked, setIsClicked] = React.useState(false);
  const [buttonWidth, setWidth] = React.useState<number>(100);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth || 100);
    }
  }, []);

  const onClickAnimated = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    if (onClick) {
      onClick(event);
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 105);
  };

  const clickClass = isClicked ? "animate-click" : "";
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }), clickClass)}
      onClick={onClickAnimated}
      style={
        {
          "--animate-scale-x": (buttonWidth - 8) / buttonWidth,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Button, buttonVariants };
