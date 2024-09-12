"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import Skeleton from "../ui/skeleton";
import { ContactInfoCard } from "./contact-info-card";
import { DangerZoneCard } from "./danger-zone.card";
import { GeneralInfoCard } from "./general-info-card";
import { UpdateAvatarCard } from "./update-avatar-card";
import { UpdateResumeCard } from "./update-resume-card";

export function ProfilePage({ className, ...props }: GenericProps) {
    const { user, isPending } = useUser();

    if (isPending) return <ProfileSkeleton />;
    if (!user) redirect(PAGES.FRONTEND.SIGNIN.SEEKER);

    return (
        <div className={cn("space-y-4", className)} {...props}>
            <UpdateAvatarCard user={user} />
            <GeneralInfoCard user={user} />
            <UpdateResumeCard user={user} />
            <ContactInfoCard user={user} />
            <DangerZoneCard user={user} />
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
        </div>
    );
}
