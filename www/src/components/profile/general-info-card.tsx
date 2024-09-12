import { useUserGeneral } from "@/hooks";
import { cn } from "@/lib/utils";
import {
    SafeUserData,
    UpdateUserGeneralData,
    updateUserGeneralSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface GeneralInfoCardProps {
    user: SafeUserData;
}

export function GeneralInfoCard({ user }: GeneralInfoCardProps) {
    const form = useForm<UpdateUserGeneralData>({
        resolver: zodResolver(updateUserGeneralSchema),
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            coverLetter: user?.coverLetter,
        },
    });

    const { updateUser, isUpdating } = useUserGeneral();

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                    Update your general information here
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form
                    onSubmit={(...args) =>
                        form.handleSubmit((data) => updateUser(data))(...args)
                    }
                >
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-4 md:flex-row">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl className="col-span-4">
                                            <Input
                                                placeholder="Ryomen"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl className="col-span-4">
                                            <Input
                                                placeholder="Sukuna"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="coverLetter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover Letter</FormLabel>
                                    <FormControl className="col-span-4">
                                        <Textarea
                                            placeholder="Write a cover letter"
                                            minRows={8}
                                            className="resize-none"
                                            isDisabled={isUpdating}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter
                        className={cn(
                            "justify-end gap-2",
                            !form.formState.isDirty && "p-0 opacity-0"
                        )}
                    >
                        <Button
                            type="reset"
                            variant="ghost"
                            className={cn(
                                "font-semibold",
                                !form.formState.isDirty &&
                                    "pointer-events-none h-0"
                            )}
                            isDisabled={isUpdating}
                            onClick={() => form.reset()}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className={cn(
                                "font-semibold",
                                !form.formState.isDirty &&
                                    "pointer-events-none h-0"
                            )}
                            isDisabled={isUpdating || !form.formState.isValid}
                            isLoading={isUpdating}
                        >
                            Update
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
