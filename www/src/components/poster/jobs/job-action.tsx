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
import { useInfiniteJobs, useJobDelete, useJobUpdate, useUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TableJob } from "./jobs-table";

interface PageProps {
    job: TableJob;
}

export function JobAction({ job }: PageProps) {
    const router = useRouter();
    const { user } = useUser("poster");

    const { refetch } = useInfiniteJobs({
        poster: user?.id!,
    });

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { update, isUpdating } = useJobUpdate(setIsPublishModalOpen, refetch);
    const { del, isDeleting } = useJobDelete(setIsDeleteModalOpen, refetch);

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
                            navigator.clipboard.writeText(job.id);
                            toast.success("ID copied to clipboard");
                        }}
                    >
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/poster/jobs/${job.id}/edit`)
                        }
                    >
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsPublishModalOpen(true)}
                    >
                        {job.isPublished ? "Unpublish" : "Publish"}
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
                open={isPublishModalOpen}
                onOpenChange={setIsPublishModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {job.isPublished ? "Unpublish" : "Publish"} Job
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {job.isPublished
                                ? "Are you sure you want to unpublish this job? This will remove the job from the public view."
                                : "Are you sure you want to publish this job? This will make the job visible to the public."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isUpdating}
                            onClick={() => setIsPublishModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            isDisabled={isUpdating}
                            isLoading={isUpdating}
                            onClick={() =>
                                update({
                                    jobId: job.id,
                                    data: {
                                        isPublished: !job.isPublished,
                                    },
                                })
                            }
                        >
                            {job.isPublished ? "Unpublish" : "Publish"}
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
                        <AlertDialogTitle>Delete</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete this job? This
                            action is irreversible. This will also delete all
                            the applications associated with this job.
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
                            onClick={() => del(job.id)}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
