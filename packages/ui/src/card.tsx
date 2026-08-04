import { type HTMLAttributes, forwardRef } from "react";

// =====================================================
// Card Component
// =====================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "soft" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      variant = "default",
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-sm",
      soft: "bg-[var(--muted)]/50 text-[var(--foreground)] border border-[var(--border)]/50",
      bordered: "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)]",
    };

    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// =====================================================
// Card Subcomponents
// =====================================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-xl font-bold tracking-tight text-[var(--foreground)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-[var(--muted-foreground)] ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";
