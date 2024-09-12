import { Link, LinkProps } from "@/components/ui/link";
import { PAGES } from "@/config/const";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type LoginButtonProps = Partial<LinkProps> & {
    content?: ReactNode;
};

export function LoginButton({
    content,
    type,
    href,
    className,
    ...props
}: LoginButtonProps) {
    return (
        <Link
            type={type ?? "button"}
            href={href ?? PAGES.FRONTEND.SIGNIN.SEEKER}
            className={cn("rounded-full px-6 font-semibold", className)}
            {...props}
        >
            {content ? content : <span>Login</span>}
        </Link>
    );
}
