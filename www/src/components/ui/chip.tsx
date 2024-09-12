import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ClassValue } from "class-variance-authority/types";
import { forwardRef, HTMLAttributes } from "react";
import { Icons } from "../icons";

const chipVariants = cva(
    "rounded-full px-3 py-1 inline-flex items-center gap-2 w-fit",
    {
        variants: {
            variant: {
                solid: "",
                outline: "border",
                dot: "border !bg-transparent !text-foreground",
            },
            size: {
                default: "text-xs",
                sm: "text-xs",
                md: "text-sm",
                lg: "text-lg px-3 py-2",
            },
            scheme: {
                primary: "bg-primary border-primary text-black",
                success: "bg-green-500 border-green-500 text-black",
                warning: "bg-yellow-500 border-yellow-500",
                destructive: "bg-destructive border-destructive",
                secondary: "bg-secondary border-secondary",
            },
        },
        defaultVariants: {
            variant: "solid",
            size: "default",
            scheme: "primary",
        },
    }
);

export interface ChipProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof chipVariants> {
    classNames?: {
        container?: ClassValue;
        dot?: ClassValue;
    };
    onClose?: () => void;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
    (
        {
            className,
            variant,
            scheme,
            size,
            onClose,
            children,
            classNames,
            ...props
        },
        ref
    ) => {
        return (
            <div
                className={cn(
                    chipVariants({ variant, scheme, size, className }),
                    classNames?.container
                )}
                ref={ref}
                {...props}
            >
                {variant === "dot" && (
                    <div
                        className={cn(
                            "size-2 !w-2 rounded-full !p-0",
                            chipVariants({ scheme }),
                            classNames?.dot
                        )}
                    />
                )}
                {children}
                {onClose && (
                    <button
                        type="button"
                        className="rounded-full bg-background-strict text-foreground-strict shadow-md transition-all ease-in-out hover:bg-background-strict/80"
                        onClick={onClose}
                    >
                        <Icons.cross className="size-3" />
                    </button>
                )}
            </div>
        );
    }
);
Chip.displayName = "Chip";

export { Chip };
