import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useUserPassword } from "@/hooks";
import { cn } from "@/lib/utils";
import {
    UpdateUserPasswordData,
    updateUserPasswordSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

interface ChangePasswordModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ChangePasswordModal({
    isOpen,
    setIsOpen,
}: ChangePasswordModalProps) {
    const form = useForm<UpdateUserPasswordData>({
        resolver: zodResolver(updateUserPasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { updatePassword, isUpdating } = useUserPassword(setIsOpen);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Change your password by providing your current password
                        and a new password
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={(...args) =>
                            form.handleSubmit((data) => updatePassword(data))(
                                ...args
                            )
                        }
                        className="space-y-5"
                    >
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-1 md:grid-cols-5 md:items-center">
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl className="col-span-4">
                                            <PasswordInput
                                                placeholder="********"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-1 md:grid-cols-5 md:items-center">
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl className="col-span-4">
                                            <PasswordInput
                                                placeholder="********"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-1 md:grid-cols-5 md:items-center">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl className="col-span-4">
                                            <PasswordInput
                                                placeholder="********"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter
                            className={cn(
                                "",
                                !form.formState.isDirty && "p-0 opacity-0"
                            )}
                        >
                            <Button
                                size="sm"
                                type="reset"
                                variant="ghost"
                                className={cn(
                                    "font-semibold",
                                    !form.formState.isDirty &&
                                        "pointer-events-none h-0"
                                )}
                                isDisabled={isUpdating}
                                onClick={() => {
                                    form.reset();
                                    setIsOpen(false);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                type="submit"
                                className={cn(
                                    "font-semibold",
                                    !form.formState.isDirty &&
                                        "pointer-events-none h-0"
                                )}
                                isDisabled={
                                    isUpdating || !form.formState.isValid
                                }
                                isLoading={isUpdating}
                            >
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
