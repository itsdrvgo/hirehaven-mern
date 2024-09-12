import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";
import * as React from "react";
import { Icons } from "../icons";
import { Button } from "./button";
import { inputVariants } from "./input";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    classNames?: {
        container?: ClassValue;
        input?: ClassValue;
    };
    isDisabled?: boolean;
    onValueChange?: (value: string) => void;
    defaultVisible?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            classNames,
            sizes,
            variant,
            isDisabled = false,
            onValueChange,
            defaultVisible = false,
            ...props
        },
        forwardedRef
    ) => {
        const [isPasswordVisible, setIsPasswordVisible] =
            React.useState(defaultVisible);

        const inputRef = React.useRef<React.ElementRef<"input">>(null!);
        React.useImperativeHandle(forwardedRef, () => inputRef.current!);

        return (
            <div
                className={cn(
                    "flex items-center gap-2",
                    inputVariants({
                        variant,
                        sizes,
                        className: cn(className, classNames?.container),
                    }),
                    isDisabled && "cursor-not-allowed opacity-50 hover:bg-input"
                )}
                aria-disabled={isDisabled}
                onClick={() => inputRef.current.focus()}
            >
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    className={cn(
                        "w-full min-w-0 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        classNames?.input
                    )}
                    ref={inputRef}
                    disabled={isDisabled}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    {...props}
                />

                <div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="size-7 rounded-sm"
                        size="icon"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                        {isPasswordVisible ? (
                            <Icons.hide className="size-4" />
                        ) : (
                            <Icons.view className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
