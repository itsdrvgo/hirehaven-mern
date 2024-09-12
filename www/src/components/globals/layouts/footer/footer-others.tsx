"use client";

import { Vercel } from "@/components/svgs";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function FooterOthers({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    const pathname = usePathname();
    if (pathname === "/") return null;

    return (
        <footer
            className={cn(
                "flex justify-center border-t border-border/10",
                className
            )}
            {...props}
        >
            <section className="container w-full p-4 py-5">
                <div className="space-y-10">
                    <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-5">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <Link
                                type="link"
                                href="https://itsdrvgo.me"
                                className="underline"
                                isExternal
                            >
                                DRVGO
                            </Link>
                            . All rights reserved.
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                            <p>Powered by</p>
                            <Link
                                type="link"
                                href="https://vercel.com"
                                isExternal
                            >
                                <Vercel width={70.75} height={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
}
