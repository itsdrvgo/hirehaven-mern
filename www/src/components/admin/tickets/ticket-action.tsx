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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES } from "@/config/const";
import { useContactDelete, useUserRole, useUsers } from "@/hooks";
import { sanitizeContent } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableTicket } from "./tickets-table";

interface PageProps {
    ticket: TableTicket;
}

export function TicketAction({ ticket }: PageProps) {
    const { refetch } = useUsers("seeker");

    const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { updateRole, isUpdating, isSuccess } = useUserRole(
        setIsUpdateRoleModalOpen,
        refetch
    );

    const { deleteTkt, isDeleting } = useContactDelete(
        setIsDeleteModalOpen,
        refetch
    );

    useEffect(() => {
        if (!isSuccess) return;
        deleteTkt(ticket.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

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
                            navigator.clipboard.writeText(ticket.id);
                            toast.success("ID copied to clipboard");
                        }}
                    >
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(ticket.email);
                            toast.success("Email copied to clipboard");
                        }}
                    >
                        Copy Email
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsMessageModalOpen(true)}
                    >
                        View Message
                    </DropdownMenuItem>

                    {ticket.query === "become-a-poster" && (
                        <DropdownMenuItem
                            onClick={() => setIsUpdateRoleModalOpen(true)}
                        >
                            Make Job Poster
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="focus:bg-destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete Ticket
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
                            Promote {ticket.name}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to promote {ticket.name} to{" "}
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
                                    userId: ticket.userId,
                                    role: "poster",
                                })
                            }
                        >
                            Promote User
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={isMessageModalOpen}
                onOpenChange={setIsMessageModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ticket.name}&apos;s Message</DialogTitle>
                    </DialogHeader>

                    <p
                        className="text-xs text-muted-foreground md:text-sm"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeContent(ticket.message),
                        }}
                    />

                    <DialogFooter className="sm:justify-center">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsMessageModalOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Ticket</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete this ticket? This
                            action is irreversible.
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
                            onClick={() => deleteTkt(ticket.id)}
                        >
                            Delete Ticket
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
