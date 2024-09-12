"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks";
import { useRouter } from "next/navigation";

export function ProfileComplete() {
    const router = useRouter();

    const { user, isPending } = useUser();

    return (
        !isPending &&
        user &&
        !user.isProfileCompleted && (
            <div className="flex w-full items-center justify-center gap-5 border-b border-black/10 bg-green-400 p-3 md:gap-2 md:p-1">
                <p className="text-start text-sm font-semibold text-background md:text-center">
                    Your profile is not completed. You will not be able to apply
                    for jobs!
                </p>

                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-muted hover:bg-muted/80"
                        onClick={() => router.push("/profile")}
                    >
                        Complete now
                    </Button>
                </div>
            </div>
        )
    );
}
