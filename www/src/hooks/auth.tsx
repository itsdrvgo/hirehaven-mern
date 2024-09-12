import { DEFAULT_USER_PENDING_MESSAGE, PAGES, UserRoles } from "@/config/const";
import {
    getCookies,
    resendVerificationEmail,
    signInUser,
    signOutUser,
    signUpUser,
    verifyUserEmail,
} from "@/lib/react-query";
import { handleClientError } from "@/lib/utils";
import { SignInData, SignUpData } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCookies() {
    const { data: cookies, isPending } = useQuery({
        queryKey: ["cookies"],
        queryFn: () => getCookies(),
    });

    return { cookies, isPending };
}

export function useSignin(type?: "admin" | "poster") {
    const router = useRouter();

    const { mutate: signIn, isPending: isSigningIn } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Signing up, please wait...");
            return { toastId };
        },
        mutationFn: (data: SignInData) => signInUser(data, type),
        onSuccess: (_, __, { toastId }) => {
            toast.success("Welcome back!", { id: toastId });
            if (type === "admin") router.push(PAGES.FRONTEND.ADMIN.DASHBOARD);
            else if (type === "poster")
                router.push(PAGES.FRONTEND.POSTER.DASHBOARD);
            else router.push("/");
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { signIn, isSigningIn };
}

export function useSignup(isChecked: boolean) {
    const router = useRouter();

    const { mutate: signUp, isPending: isSigningUp } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Signing up, please wait...");
            return { toastId };
        },
        mutationFn: (data: SignUpData) => {
            if (!isChecked)
                throw new Error("You must agree to the terms of service");
            return signUpUser(data);
        },
        onSuccess: (data, __, { toastId }) => {
            toast.success(data.longMessage, {
                id: toastId,
            });
            router.push(PAGES.FRONTEND.SIGNIN.SEEKER);
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { signUp, isSigningUp };
}

export function useSignout() {
    const router = useRouter();

    const { cookies } = useCookies();

    const { mutate: signOut, isPending: isSigningOut } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Logging out...");
            return { toastId };
        },
        mutationFn: async (data: UserRoles) => {
            if (!cookies) throw new Error(DEFAULT_USER_PENDING_MESSAGE);
            await signOutUser(data, cookies);
        },
        onSuccess: (_, data, ctx) => {
            toast.success("Good bye!", {
                id: ctx.toastId,
            });
            if (data === "admin") router.push(PAGES.FRONTEND.SIGNIN.ADMIN);
            else if (data === "poster")
                router.push(PAGES.FRONTEND.SIGNIN.POSTER);
            else router.push(PAGES.FRONTEND.SIGNIN.SEEKER);
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { signOut, isSigningOut };
}

export function useVerifyAccount() {
    const router = useRouter();

    const {
        mutate: verifyAccount,
        error,
        status,
    } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Verifying your account...");
            return { toastId };
        },
        mutationFn: verifyUserEmail,
        onSuccess: (_, __, { toastId }) => {
            toast.success("Account verified, welcome!", {
                id: toastId,
            });

            router.push("/");
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { verifyAccount, error, status };
}

export function useResendEmail() {
    const { cookies } = useCookies();

    const { mutate: resendEmail, isPending } = useMutation({
        onMutate: () => {
            const toastId = toast.loading(
                "Sending new verification link to your email..."
            );
            return { toastId };
        },
        mutationFn: () => resendVerificationEmail(cookies!),
        onSuccess: (_, __, { toastId }) => {
            toast.success(
                "A new verification link has been sent to your email",
                {
                    id: toastId,
                }
            );
        },
        onError: (err, _, ctx) => {
            return handleClientError(err, ctx?.toastId);
        },
    });

    return { resendEmail, isPending };
}
