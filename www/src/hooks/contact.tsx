import { DEFAULT_USER_PENDING_MESSAGE } from "@/config/const";
import { createContact, deleteContact, getContacts } from "@/lib/react-query";
import { handleClientError } from "@/lib/utils";
import { ContactData } from "@/lib/validation";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useCookies } from "./auth";
import { useUser } from "./user";

export function useContacts({
    enabled,
}: {
    enabled?: boolean;
} = {}) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const {
        data,
        isPending,
        refetch,
        isFetchingNextPage,
        error,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["contacts"],
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            return await getContacts({
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

export function useContactCreate(form: UseFormReturn<ContactData>) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: sendRequest, isPending: isSendingRequest } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Sending your message...");
            return { toastId };
        },
        mutationFn: async (data: ContactData) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await createContact(
                {
                    userId: data.id,
                    query: data.query,
                    message: data.message,
                },
                cookies,
                user.role
            );
        },
        onSuccess: (_, __, { toastId }) => {
            form.reset();

            toast.success("Your request has been sent", {
                id: toastId,
            });
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { sendRequest, isSendingRequest };
}

export function useContactDelete(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: deleteTkt, isPending: isDeleting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting ticket...");
            return { toastId };
        },
        mutationFn: async (contactId: string) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await deleteContact(contactId, cookies, user.role);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Ticket deleted", {
                id: toastId,
            });

            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { deleteTkt, isDeleting };
}
