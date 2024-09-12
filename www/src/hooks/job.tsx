import { DEFAULT_USER_PENDING_MESSAGE, PAGES } from "@/config/const";
import {
    applyToJob,
    createJob,
    deleteJob,
    getInfiniteJobs,
    getJob,
    getJobs,
    updateJob,
} from "@/lib/react-query";
import { handleClientError } from "@/lib/utils";
import { ApplyJobData, CreateJobData, UpdateJobData } from "@/lib/validation";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useCookies } from "./auth";
import { useUser } from "./user";

export function useJobs(params: {
    category?: string; // category id
    name?: string; // search keyword
    type?: string; // "full_time" | "freelance" | "part_time" | "contract" | "internship"
    location?: string; // "onsite" | "remote" | "hybrid"
    country?: string; // country code
    minSalary?: string;
    maxSalary?: string;
    isFeatured?: string; // only true
    status?: "draft" | "published";
    poster?: string; // job poster id
    enabled?: boolean;
}) {
    const { enabled, ...rest } = params;

    const { data: jobs, isPending } = useQuery({
        queryKey: ["jobs", rest],
        queryFn: () => getJobs(params),
        enabled,
    });

    return { jobs, isPending };
}

export function useInfiniteJobs(params: {
    category?: string; // category id
    name?: string; // search keyword
    type?: string; // "full_time" | "freelance" | "part_time" | "contract" | "internship"
    location?: string; // "onsite" | "remote" | "hybrid"
    country?: string; // country code
    minSalary?: string;
    maxSalary?: string;
    isFeatured?: string; // only true
    status?: "draft" | "published";
    poster?: string; // job poster id
    enabled?: boolean;
}) {
    const { enabled, ...rest } = params;

    const {
        data: paginatedJobs,
        isPending,
        refetch,
        isFetchingNextPage,
        error,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["jobs", "infinite", rest],
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            return await getInfiniteJobs({
                params: rest,
                pageParam,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage) return null;
            if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
            else return null;
        },
        refetchOnMount: false,
        enabled,
    });

    return {
        paginatedJobs,
        isPending,
        refetch,
        isFetchingNextPage,
        error,
        hasNextPage,
        fetchNextPage,
    };
}

export function useJob(jobId: string) {
    const { data: job, isPending } = useQuery({
        queryKey: ["job", jobId],
        queryFn: () => getJob(jobId),
    });

    return { job, isPending };
}

export function useApply() {
    const { cookies } = useCookies();
    const { user } = useUser("seeker");
    const router = useRouter();

    const { mutate: apply, isPending: isApplying } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Submitting your application...");
            return { toastId };
        },
        mutationFn: async ({
            data,
            jobId,
        }: {
            data: ApplyJobData;
            jobId: string;
        }) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await applyToJob(data, jobId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Application submitted", {
                id: toastId,
            });

            router.back();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { apply, isApplying };
}

export function useJobCreate() {
    const router = useRouter();

    const { cookies } = useCookies();
    const { user } = useUser("poster");

    const { mutate: create, isPending: isCreating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Creating job...");
            return { toastId };
        },
        mutationFn: async (
            data: CreateJobData & {
                logo?: File;
            }
        ) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await createJob(data, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Job created", {
                id: toastId,
            });

            router.push(PAGES.FRONTEND.POSTER.JOBS.BASE);
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { create, isCreating };
}

export function useJobUpdate(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const router = useRouter();

    const { cookies } = useCookies();
    const { user } = useUser("poster");

    const { mutate: update, isPending: isUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating job...");
            return { toastId };
        },
        mutationFn: async ({
            data,
            jobId,
        }: {
            data: UpdateJobData;
            jobId: string;
        }) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateJob(data, jobId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Job updated", {
                id: toastId,
            });

            if (!setIsOpen) {
                router.push(PAGES.FRONTEND.POSTER.JOBS.BASE);
                return;
            }

            setIsOpen(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { update, isUpdating };
}

export function useJobDelete(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser("poster");

    const { mutate: del, isPending: isDeleting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting job...");
            return { toastId };
        },
        mutationFn: async (jobId: string) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await deleteJob(jobId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Job deleted", {
                id: toastId,
            });

            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { del, isDeleting };
}
