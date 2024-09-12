import { Icons } from "@/components/icons";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/config/const";
import { useUserDelete, useUserRestrict, useUserRole, useUsers } from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { TableSeeker } from "./seekers-table";

interface PageProps {
    user: TableSeeker;
}

export function SeekerAction({ user }: PageProps) {
    const { refetch } = useUsers("seeker");

    const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
    const [isRestrictRoleModalOpen, setIsRestrictRoleModalOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { updateRole, isUpdating } = useUserRole(
        setIsUpdateRoleModalOpen,
        refetch
    );

    const { restrictUser, isRestricting } = useUserRestrict(
        setIsRestrictRoleModalOpen,
        refetch
    );

    const { deleteAccount, isDeleting } = useUserDelete(
        setIsDeleteModalOpen,
        refetch
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Icons.moreHor className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(user.id);
                            toast.success("ID copied to clipboard");
                        }}
                    >
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(user.email);
                            toast.success("Email copied to clipboard");
                        }}
                    >
                        Copy Email
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={!user.phone}
                        onClick={() => {
                            const phone = user.phone;
                            if (!phone)
                                return toast.error("Phone number not found");

                            navigator.clipboard.writeText(phone);
                            toast.success("Phone copied to clipboard");
                        }}
                    >
                        Copy Phone
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsUpdateRoleModalOpen(true)}
                    >
                        Make Job Poster
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="focus:bg-destructive"
                        onClick={() => setIsRestrictRoleModalOpen(true)}
                    >
                        {user.isRestricted ? "Unrestrict" : "Restrict"}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="focus:bg-destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={isUpdateRoleModalOpen}
                onOpenChange={setIsUpdateRoleModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Promote {user.fullName}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to promote {user.fullName} to{" "}
                            {ROLES.POSTER.toUpperCase()}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isUpdating}
                            onClick={() => setIsUpdateRoleModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            className="font-semibold capitalize"
                            isDisabled={isUpdating}
                            isLoading={isUpdating}
                            onClick={() =>
                                updateRole({
                                    userId: user.id,
                                    role: "poster",
                                })
                            }
                        >
                            Promote User
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isRestrictRoleModalOpen}
                onOpenChange={setIsRestrictRoleModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {user.isRestricted ? "Unrestrict" : "Restrict"}{" "}
                            {user.fullName}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {user.isRestricted ? "unrestrict" : "restrict"}{" "}
                            {user.fullName}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isRestricting}
                            onClick={() => setIsRestrictRoleModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            className="capitalize"
                            isDisabled={isRestricting}
                            isLoading={isRestricting}
                            onClick={() =>
                                restrictUser({
                                    userId: user.id,
                                    isRestricted: !user.isRestricted,
                                })
                            }
                        >
                            {user.isRestricted ? "Unrestrict" : "Restrict"} User
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete {user.fullName}?
                            This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isDeleting}
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            isDisabled={isDeleting}
                            isLoading={isDeleting}
                            onClick={() =>
                                deleteAccount({
                                    userId: user.id,
                                })
                            }
                        >
                            Delete User
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
