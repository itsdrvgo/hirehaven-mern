"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useApply, useUser } from "@/hooks";
import {
    ApplyJobData,
    applyJobSchema,
    ResponseJobData,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

interface PageProps {
    job: ResponseJobData;
}

export function JobApply({ job }: PageProps) {
    const { isSignedIn, user } = useUser();

    const form = useForm<ApplyJobData>({
        resolver: zodResolver(applyJobSchema),
        defaultValues: {
            coverLetter: user?.coverLetter ?? "",
        },
    });

    const isJobApplied = useMemo(() => {
        if (!user) return false;
        const applicant = job.applicants.find((x) => x.applicantId === user.id);
        return !!applicant;
    }, [job, user]);

    const { apply, isApplying } = useApply();

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={(...args) =>
                    form.handleSubmit((data) => apply({ data, jobId: job.id }))(
                        ...args
                    )
                }
            >
                <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Why do you want to work at {job.companyName}?
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="I want to work at..."
                                    minRows={8}
                                    maxRows={16}
                                    className="resize-none"
                                    disabled={
                                        !isSignedIn ||
                                        isApplying ||
                                        isJobApplied ||
                                        user?.role !== "seeker"
                                    }
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!isSignedIn && (
                    <p className="text-xs text-red-500">
                        * You need to sign in to apply for this job
                    </p>
                )}

                {user?.coverLetter &&
                    user.coverLetter !== form.getValues("coverLetter") && (
                        <p className="text-xs text-red-500">
                            * The new cover letter will not be saved to your
                            profile, but it will be used for this application.
                        </p>
                    )}

                {user?.role !== "seeker" && (
                    <p className="text-xs text-red-500">
                        * Only seekers can apply for jobs
                    </p>
                )}

                <Button
                    className="w-full font-semibold"
                    type="submit"
                    variant={isJobApplied ? "secondary" : "default"}
                    isDisabled={
                        !isSignedIn ||
                        isApplying ||
                        isJobApplied ||
                        user?.role !== "seeker"
                    }
                    isLoading={isApplying}
                >
                    {isJobApplied ? "Applied" : "Apply"}
                </Button>
            </form>
        </Form>
    );
}
