"use client";

import { Button } from "@/components/ui/button";
import { useResendEmail, useUser } from "@/hooks";
import { useState } from "react";

export function ProfileVerify() {
    const [isClicked, setIsClicked] = useState(false);

    const { user, isPending } = useUser();

    const { resendEmail, isPending: isEmailResending } = useResendEmail();

    return (
        !isPending &&
        user &&
        !user.isVerified && (
            <div className="flex w-full items-center justify-center gap-5 border-b border-black/10 bg-accent p-3 md:gap-2 md:p-1">
                <p className="text-start text-sm font-semibold text-background md:text-center">
                    Your account is not verified. Click the button to resend the
                    verification email!
                </p>

                <div>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                            resendEmail();
                            setIsClicked(true);
                        }}
                        isLoading={isEmailResending}
                        isDisabled={isClicked}
                    >
                        Resend Email
                    </Button>
                </div>
            </div>
        )
    );
}
