import { type HTMLAttributes, type SelectHTMLAttributes, type OptionHTMLAttributes, forwardRef, createContext, useContext, useState, useRef, useEffect,  } from "react";

// =====================================================
// Select Context
// =====================================================

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue>({
  value: "",
  onValueChange: () => {},
  open: false,
  onOpenChange: () => {},
});

// =====================================================
// Select
// =====================================================

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Select({ value: controlledValue, onValueChange, defaultValue = "", disabled, children }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const value = controlledValue ?? uncontrolledValue;
  const handleValueChange = onValueChange ?? setUncontrolledValue;

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, onOpenChange: setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// =====================================================
// SelectTrigger
// =====================================================

export interface SelectTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children, ...props }, ref) => {
    const { open, onOpenChange } = useContext(SelectContext);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.parentElement?.contains(e.target as Node)) {
          onOpenChange(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onOpenChange]);

    return (
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        className={`flex h-11 w-full items-center justify-between rounded-xl border border-[var(--border,rgba(0,0,0,0.1))] dark:border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--card,#ffffff)] dark:bg-[var(--card,#121216)] px-4 py-2.5 text-sm text-[var(--foreground,#171717)] dark:text-[var(--foreground,#ffffff)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary,#5865F2)]/25 focus:border-[var(--primary,#5865F2)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[var(--primary,#5865F2)]" : "opacity-50"}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

// =====================================================
// SelectValue
// =====================================================

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = "", placeholder, ...props }, ref) => {
    const { value } = useContext(SelectContext);

    return (
      <span ref={ref} className={className} {...props}>
        {value || placeholder}
      </span>
    );
  }
);

SelectValue.displayName = "SelectValue";

// =====================================================
// SelectContent
// =====================================================

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", children, ...props }, ref) => {
    const { open } = useContext(SelectContext);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={`absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-2xl border border-[var(--border,rgba(0,0,0,0.1))] dark:border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--card,#ffffff)]/95 dark:bg-[var(--card,#121216)]/95 backdrop-blur-xl p-1.5 text-[var(--foreground,#171717)] dark:text-[var(--foreground,#ffffff)] shadow-2xl transition-all duration-200 ease-out animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 ${className}`}
        role="listbox"
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectContent.displayName = "SelectContent";

// =====================================================
// SelectItem
// =====================================================

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = "", value: itemValue, children, ...props }, ref) => {
    const { value, onValueChange, onOpenChange } = useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold outline-none transition-all duration-150 active:scale-[0.98] hover:bg-[var(--primary,#5865F2)]/10 hover:text-[var(--primary,#5865F2)] focus:bg-[var(--primary,#5865F2)]/10 focus:text-[var(--primary,#5865F2)] ${
          isSelected ? "bg-[var(--primary,#5865F2)]/10 text-[var(--primary,#5865F2)] font-bold" : ""
        } ${className}`}
        role="option"
        aria-selected={isSelected}
        onClick={() => {
          onValueChange(itemValue);
          onOpenChange(false);
        }}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center text-[var(--primary,#5865F2)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        )}
        {children}
      </div>
    );
  }
);

SelectItem.displayName = "SelectItem";
