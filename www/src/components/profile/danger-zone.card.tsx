"use client";

import { SafeUserData } from "@/lib/validation";
import { useState } from "react";
import { ChangePasswordModal, DeleteAccountModal } from "../globals/modals";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

interface DangerZoneCardProps {
    user: SafeUserData;
}

export function DangerZoneCard({ user }: DangerZoneCardProps) {
    const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
        useState(false);
    const [isDeleteAccountModalOpen, setDeleteAccountModalOpen] =
        useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Delete your account and all associated data or change
                        your password
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                        <div>
                            <h3 className="font-semibold">Change Password</h3>
                            <p className="max-w-md text-sm text-muted-foreground">
                                If you think your password has been compromised,
                                change it immediately.
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setPasswordChangeModalOpen(true)}
                        >
                            Change Password
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-5">
                        <div>
                            <h3 className="font-semibold">Delete Account</h3>
                            <p className="max-w-md text-sm text-muted-foreground">
                                This will permanently delete your account and
                                all the data associated with it, along with the
                                bookings you&apos;ve made.
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteAccountModalOpen(true)}
                            disabled={user.role !== "seeker"}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ChangePasswordModal
                isOpen={isPasswordChangeModalOpen}
                setIsOpen={setPasswordChangeModalOpen}
            />

            <DeleteAccountModal
                isOpen={isDeleteAccountModalOpen}
                setIsOpen={setDeleteAccountModalOpen}
            />
        </>
    );
}
