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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUSES } from "@/config/const";
import { useApplications, useApplicationUpdate } from "@/hooks";
import { convertValueToLabel } from "@/lib/utils";
import {
    UpdateApplicationData,
    updateApplicationSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TableApplication } from "./applications-table";

interface PageProps {
    application: TableApplication;
}

export function ApplicationAction({ application }: PageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { refetch } = useApplications({
        jobId: searchParams.get("jId") ?? undefined,
        enabled: !!searchParams.get("jId"),
    });

    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] =
        useState(false);

    const { update, isUpdating } = useApplicationUpdate(
        setIsUpdateStatusModalOpen,
        refetch
    );

    const form = useForm<UpdateApplicationData>({
        resolver: zodResolver(updateApplicationSchema),
        defaultValues: {
            status: application.status,
        },
    });

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
                            navigator.clipboard.writeText(application.id);
                            toast.success("Application ID copied to clipboard");
                        }}
                    >
                        Copy Application ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(application.jobId);
                            toast.success("Job ID copied to clipboard");
                        }}
                    >
                        Copy Job ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(
                                application.applicant.id
                            );
                            toast.success("Applicant ID copied to clipboard");
                        }}
                    >
                        Copy Applicant ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(
                                application.applicant.email
                            );
                            toast.success(
                                "Applicant Email copied to clipboard"
                            );
                        }}
                    >
                        Copy Applicant Email
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            const phone = application.applicant.phone;
                            if (!phone)
                                return toast.error("Phone number not found");

                            navigator.clipboard.writeText(phone);
                            toast.success(
                                "Applicant Phone copied to clipboard"
                            );
                        }}
                    >
                        Copy Applicant Phone
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() =>
                            router.push(
                                `/poster/applications/${application.id}`
                            )
                        }
                    >
                        View Application
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setIsUpdateStatusModalOpen(true)}
                    >
                        Update Status
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={isUpdateStatusModalOpen}
                onOpenChange={setIsUpdateStatusModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Application Status
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Select the new status for this application
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={(...args) =>
                                form.handleSubmit((data) =>
                                    update({
                                        data,
                                        applicationId: application.id,
                                    })
                                )(...args)
                            }
                        >
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Application Status
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    disabled={
                                                        isUpdating ||
                                                        [
                                                            APPLICATION_STATUSES.HIRED,
                                                            APPLICATION_STATUSES.REJECTED,
                                                        ].includes(
                                                            application.status as any
                                                        )
                                                    }
                                                >
                                                    <SelectValue placeholder="Select a status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(
                                                    APPLICATION_STATUSES
                                                ).map((x) => (
                                                    <SelectItem
                                                        key={x}
                                                        value={x}
                                                        disabled={
                                                            application.status ===
                                                                x ||
                                                            (application.status ===
                                                                APPLICATION_STATUSES.REVIEWED &&
                                                                x ===
                                                                    APPLICATION_STATUSES.PENDING) ||
                                                            [
                                                                APPLICATION_STATUSES.HIRED,
                                                                APPLICATION_STATUSES.REJECTED,
                                                            ].includes(
                                                                application.status as any
                                                            )
                                                        }
                                                    >
                                                        {convertValueToLabel(x)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AlertDialogFooter>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    isDisabled={isUpdating}
                                    onClick={() =>
                                        setIsUpdateStatusModalOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    size="sm"
                                    className="font-semibold capitalize"
                                    isDisabled={
                                        isUpdating ||
                                        !form.formState.isDirty ||
                                        [
                                            APPLICATION_STATUSES.HIRED,
                                            APPLICATION_STATUSES.REJECTED,
                                        ].includes(application.status as any)
                                    }
                                    isLoading={isUpdating}
                                >
                                    Update Status
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
