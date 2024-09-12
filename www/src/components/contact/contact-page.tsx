"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import { ContactForm } from "../globals/forms";
import { Button } from "../ui/button";
import Skeleton from "../ui/skeleton";

interface PageProps extends GenericProps {
    searchParams: {
        q?: string;
    };
}

export function ContactPage({ className, searchParams, ...props }: PageProps) {
    const { user, isPending } = useUser();

    if (isPending) return <ContactSkeleton />;
    if (!user) redirect(PAGES.FRONTEND.SIGNIN.SEEKER);

    return (
        <div className={cn("space-y-4", className)} {...props}>
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold md:text-4xl">
                    Contact Us
                </h2>
                <p className="text-sm text-muted-foreground">
                    Have a question? Need help? Just want to say hi? We&apos;re
                    here for you.
                </p>
            </div>

            <ContactForm searchParams={searchParams} user={user} />
        </div>
    );
}

function ContactSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 md:flex-row">
                {["First Name", "Last Name"].map((label) => (
                    <div key={label} className="w-full space-y-2">
                        <p className="text-sm">{label}</p>
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ))}
            </div>

            {["Email", "Query"].map((label) => (
                <div key={label} className="w-full space-y-2">
                    <p className="text-sm">{label}</p>
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            ))}

            <div className="w-full space-y-2">
                <p className="text-sm">Message</p>
                <Skeleton className="h-44 w-full rounded-md" />
            </div>

            <Button className="w-full font-semibold" isDisabled>
                Submit
            </Button>
        </div>
    );
}
