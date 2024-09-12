import { DEFAULT_USER_PENDING_MESSAGE } from "@/config/const";
import {
    getApplication,
    getApplications,
    updateApplication,
} from "@/lib/react-query";
import { handleClientError } from "@/lib/utils";
import { UpdateApplicationData } from "@/lib/validation";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useCookies } from "./auth";
import { useUser } from "./user";

export function useApplications(
    params: {
        applicantId?: string;
        jobId?: string;
        enabled?: boolean;
    } = {}
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { enabled, ...rest } = params;

    const {
        data,
        isPending,
        refetch,
        isFetchingNextPage,
        error,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["applications", rest],
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            return await getApplications({
                params: rest,
                pageParam,
                cookies: cookies!,
                role: user?.role,
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
        data,
        isPending,
        refetch,
        isFetchingNextPage,
        error,
        hasNextPage,
        fetchNextPage,
    };
}

export function useApplication(applicationId: string) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { data: application, isPending } = useQuery({
        queryKey: ["application", applicationId],
        queryFn: () => getApplication(applicationId, cookies!, user?.role),
    });

    return { application, isPending };
}

export function useApplicationUpdate(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: update, isPending: isUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating application...");
            return { toastId };
        },
        mutationFn: async ({
            data,
            applicationId,
        }: {
            data: UpdateApplicationData;
            applicationId: string;
        }) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateApplication(data, applicationId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Application updated", {
                id: toastId,
            });

            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { update, isUpdating };
}
