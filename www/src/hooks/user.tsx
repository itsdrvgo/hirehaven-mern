import { DEFAULT_USER_PENDING_MESSAGE, ROLES, UserRoles } from "@/config/const";
import {
    deleteUser,
    getCurrentUser,
    getUsers,
    updateUserAvatar,
    updateUserContactInfo,
    updateUserGeneralInfo,
    updateUserPassword,
    updateUserRestriction,
    updateUserResume,
    updateUserRole,
} from "@/lib/react-query";
import { convertValueToLabel, handleClientError } from "@/lib/utils";
import {
    UpdateUserContactData,
    UpdateUserGeneralData,
    UpdateUserPasswordData,
} from "@/lib/validation";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useCookies } from "./auth";

export function useUsers(type?: UserRoles, enabled?: boolean) {
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
        queryKey: ["users", type],
        queryFn: async ({ pageParam }) => {
            return await getUsers({
                role: user!.role,
                cookies: cookies!,
                pageParam,
                type,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage) return null;
            if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
            else return null;
        },
        refetchOnMount: false,
        enabled: enabled ?? (!!user && !!cookies),
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

export function useUser(role?: UserRoles) {
    const { cookies } = useCookies();

    const {
        data: user,
        isPending,
        error,
        status,
        refetch,
    } = useQuery({
        queryKey: [
            "currentUser",
            role ??
                (cookies?.seeker && ROLES.SEEKER) ??
                (cookies?.poster && ROLES.POSTER) ??
                (cookies?.admin && ROLES.ADMIN),
        ],
        queryFn: () => getCurrentUser(cookies!, role),
        enabled: !!cookies,
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });

    const isSignedIn = !isPending && !!user;

    return { user, isPending, isSignedIn, error, status, refetch };
}

export function useUserAvatar(image?: File) {
    const { cookies } = useCookies();
    const { user, refetch } = useUser();

    const {
        mutate: updateAvatar,
        isPending: isAvatarUpdating,
        isSuccess,
    } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating your avatar...");
            return { toastId };
        },
        mutationFn: async () => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserAvatar(user.id, user.role, cookies, image);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Avatar updated", {
                id: toastId,
            });

            refetch();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updateAvatar, isAvatarUpdating, isSuccess };
}

export function useUserResume(resume?: File) {
    const { cookies } = useCookies();
    const { user, refetch } = useUser();

    const {
        mutate: updateResume,
        isPending: isResumeUpdating,
        isSuccess,
    } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating your resume...");
            return { toastId };
        },
        mutationFn: async () => {
            if (!cookies || !user)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserResume(user.id, user.role, cookies, resume);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Resume updated", {
                id: toastId,
            });

            refetch();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updateResume, isResumeUpdating, isSuccess };
}

export function useUserGeneral() {
    const { cookies } = useCookies();
    const { user, refetch } = useUser();

    const {
        mutate: updateUser,
        isPending: isUpdating,
        isSuccess,
    } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating profile...");
            return { toastId };
        },
        mutationFn: async (data: UpdateUserGeneralData) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserGeneralInfo(data, user.id, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Profile updated", {
                id: toastId,
            });

            refetch();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updateUser, isUpdating, isSuccess };
}

export function useUserContact() {
    const { cookies } = useCookies();
    const { user, refetch } = useUser();

    const { mutate: updateUser, isPending: isUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating profile...");
            return { toastId };
        },
        mutationFn: async (data: UpdateUserContactData) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserContactInfo(data, user.id, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Profile updated", {
                id: toastId,
            });

            refetch();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updateUser, isUpdating };
}

export function useUserPassword(setIsOpen: Dispatch<SetStateAction<boolean>>) {
    const { cookies } = useCookies();
    const { user, refetch } = useUser();

    const { mutate: updatePassword, isPending: isUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating password...");
            return { toastId };
        },
        mutationFn: async (data: UpdateUserPasswordData) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserPassword(data, user.id, user.role, cookies);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Password updated", {
                id: toastId,
            });

            setIsOpen(false);
            refetch();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updatePassword, isUpdating };
}

export function useUserRole(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const {
        mutate: updateRole,
        isPending: isUpdating,
        isSuccess,
    } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating user role...");
            return { toastId };
        },
        mutationFn: async ({
            userId,
            role,
        }: {
            userId: string;
            role: UserRoles;
        }) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserRole(role, userId, user.role, cookies);
        },
        onSuccess: (_, { role }, { toastId }) => {
            toast.success(`User role updated to ${convertValueToLabel(role)}`, {
                id: toastId,
            });
            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { updateRole, isUpdating, isSuccess };
}

export function useUserRestrict(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: restrictUser, isPending: isRestricting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating user restriction...");
            return { toastId };
        },
        mutationFn: async ({
            userId,
            isRestricted,
        }: {
            userId: string;
            isRestricted: boolean;
        }) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await updateUserRestriction(
                isRestricted,
                userId,
                user.role,
                cookies
            );
        },
        onSuccess: (_, { isRestricted }, { toastId }) => {
            toast.success(
                `User ${isRestricted ? "restricted" : "unrestricted"}`,
                {
                    id: toastId,
                }
            );
            setIsOpen?.(false);
            refetch?.();
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { restrictUser, isRestricting };
}

export function useUserDelete(
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    refetch?: () => void
) {
    const router = useRouter();

    const { cookies } = useCookies();
    const { user } = useUser();

    const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting account...");
            return { toastId };
        },
        mutationFn: async ({ userId }: { userId?: string }) => {
            if (!user || !cookies)
                throw new Error(DEFAULT_USER_PENDING_MESSAGE);

            if (userId) await deleteUser(userId, user.role, cookies);
            else await deleteUser(user.id, user.role, cookies);
        },
        onSuccess: (_, userId, { toastId }) => {
            toast.success(userId ? `Account deleted` : "Sorry to see you go", {
                id: toastId,
            });
            setIsOpen?.(false);
            refetch?.();
            if (!userId) router.push("/");
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { deleteAccount, isDeleting };
}
