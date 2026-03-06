import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const panelStyles = cva("surface-panel", {
  variants: {
    tone: {
      default: "",
      dark: "surface-panel--dark",
      quiet: "surface-panel--quiet",
      inline: "surface-panel--inline",
    },
    compact: {
      true: "surface-panel--compact",
      false: "",
    },
  },
  defaultVariants: {
    tone: "default",
    compact: false,
  },
});

const pillStyles = cva("ui-pill", {
  variants: {
    tone: {
      default: "",
      dark: "ui-pill--dark",
      accent: "ui-pill--accent",
      ember: "ui-pill--ember",
      muted: "ui-pill--muted",
      translucent: "ui-pill--translucent",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

const buttonStyles = cva("ui-button", {
  variants: {
    tone: {
      primary: "ui-button--primary",
      secondary: "ui-button--secondary",
      ghost: "ui-button--ghost",
    },
    size: {
      sm: "ui-button--sm",
      md: "",
      lg: "ui-button--lg",
    },
    block: {
      true: "ui-button--block",
      false: "",
    },
  },
  defaultVariants: {
    tone: "primary",
    size: "md",
    block: false,
  },
});

const filterChipStyles = cva("filter-chip", {
  variants: {
    active: {
      true: "filter-chip--active",
      false: "",
    },
  },
  defaultVariants: {
    active: false,
  },
});

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
};

type PanelProps<T extends ElementType> = PolymorphicProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicProps<T>> &
  VariantProps<typeof panelStyles>;

export function Panel<T extends ElementType = "div">({
  as,
  className,
  tone,
  compact,
  children,
  ...props
}: PanelProps<T>) {
  const Comp = as ?? "div";

  return (
    <Comp className={cn(panelStyles({ tone, compact }), className)} {...props}>
      {children}
    </Comp>
  );
}

interface PillProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof pillStyles> {}

export function Pill({ className, tone, children, ...props }: PillProps) {
  return (
    <span className={cn(pillStyles({ tone }), className)} {...props}>
      {children}
    </span>
  );
}

interface ButtonProps extends ComponentPropsWithoutRef<"button">, VariantProps<typeof buttonStyles> {}

export function Button({ className, tone, size, block, type = "button", children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles({ tone, size, block }), className)} type={type} {...props}>
      {children}
    </button>
  );
}

interface FilterChipProps extends ComponentPropsWithoutRef<"button">, VariantProps<typeof filterChipStyles> {}

export function FilterChip({ className, active, type = "button", children, ...props }: FilterChipProps) {
  return (
    <button className={cn(filterChipStyles({ active }), className)} type={type} {...props}>
      {children}
    </button>
  );
}

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="page-intro">
      <Pill tone="dark">{eyebrow}</Pill>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="ui-spinner" aria-label={label} role="status" />
  );
}
