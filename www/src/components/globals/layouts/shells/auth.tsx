"use client";

import { HireHaven } from "@/components/svgs";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect, usePathname, useRouter } from "next/navigation";

export function LogoSection({ className, ...props }: GenericProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { isSignedIn } = useUser();
    if (isSignedIn && !pathname.includes("verify-email")) redirect("/");

    return (
        <section
            className={cn(
                "relative flex w-full items-center px-4 md:h-full md:w-1/3 md:px-0",
                className
            )}
            {...props}
        >
            <div className="relative w-full min-w-min max-w-sm md:left-[-26px]">
                <button
                    className="flex cursor-pointer items-center gap-1 bg-background py-4 text-4xl font-semibold"
                    onClick={() => router.push("/")}
                >
                    <HireHaven height={50} width={50} />
                    <p>HireHaven</p>
                </button>
            </div>
        </section>
    );
}
