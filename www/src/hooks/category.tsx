import { DEFAULT_USER_PENDING_MESSAGE } from "@/config/const";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "@/lib/react-query";
import { handleClientError } from "@/lib/utils";
import { CreateCategoryData } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useCookies } from "./auth";
import { useUser } from "./user";

export function useCategories() {
    const {
        data: categories,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    return { categories, isPending, refetch };
}

export function useCategory(id: string) {
    const { data: category, isPending } = useQuery({
        queryKey: ["category", id],
        queryFn: () => getCategory(id),
    });

    return { category, isPending };
}

export function useCategoryCreate(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: create, isPending: isCreating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Creating category...");
            return { toastId };
        },
        mutationFn: async (data: CreateCategoryData) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await createCategory(data, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Category created", {
                id: toastId,
            });

            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { create, isCreating };
}

export function useCategoryUpdate(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: update, isPending: isUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating category...");
            return { toastId };
        },
        mutationFn: async ({
            data,
            categoryId,
        }: {
            data: CreateCategoryData;
            categoryId: string;
        }) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateCategory(data, categoryId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Category updated", {
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

export function useCategoryDelete(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: deleteCat, isPending: isDeleting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting category...");
            return { toastId };
        },
        mutationFn: async (categoryId: string) => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await deleteCategory(categoryId, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Category deleted", {
                id: toastId,
            });

            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { deleteCat, isDeleting };
}
