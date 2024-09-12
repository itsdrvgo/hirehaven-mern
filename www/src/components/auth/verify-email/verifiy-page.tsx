"use client";

import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Link } from "@/components/ui/link";
import { DEFAULT_ERROR_MESSAGE, PAGES } from "@/config/const";
import { useResendEmail, useUser, useVerifyAccount } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { AxiosError } from "axios";
import { useEffect } from "react";

interface PageProps extends GenericProps {
    token?: string;
}

export function VerifyEmailPage({ className, token, ...props }: PageProps) {
    const { user, isPending: isUserFetching } = useUser("seeker");

    const {
        verifyAccount,
        error: verifyError,
        status: verifyStatus,
    } = useVerifyAccount();

    const { resendEmail, isPending: isEmailResending } = useResendEmail();

    useEffect(() => {
        if (token && token !== "" && user) verifyAccount(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!token || token === "") return <NoTokenCard />;
    if (!isUserFetching && !user) return <LoginCard />;

    return (
        <Shell className={className} {...props}>
            <EmptyPlaceholder
                title={
                    ["idle", "pending"].includes(verifyStatus)
                        ? "Email Verification"
                        : verifyStatus === "success"
                          ? "Email Verified"
                          : "Email Verification Failed"
                }
                description={
                    ["idle", "pending"].includes(verifyStatus)
                        ? "Please wait while we verify your email address. This won't take long."
                        : verifyStatus === "success"
                          ? "Your email address has been successfully verified. You can now login to your account."
                          : getErrorMessage(verifyError)
                }
                icon="mail"
                endContent={
                    <>
                        {["idle", "pending", "success"].includes(
                            verifyStatus
                        ) ? (
                            <Button
                                size="sm"
                                isLoading={["idle", "pending"].includes(
                                    verifyStatus
                                )}
                            >
                                {["idle", "pending"].includes(verifyStatus)
                                    ? "Verifying Email"
                                    : "Email Verified"}
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                isDisabled={isEmailResending}
                                isLoading={isEmailResending}
                                onClick={() => resendEmail()}
                            >
                                Resend Verification Email
                            </Button>
                        )}
                    </>
                }
            />
        </Shell>
    );
}

function NoTokenCard() {
    return (
        <Shell>
            <EmptyPlaceholder
                title="Token Missing"
                description="The token required to verify your email address is missing. Please check your email for the verification link."
                icon="warning"
                endContent={
                    <Link type="button" size="sm" href="/">
                        Go to Home
                    </Link>
                }
            />
        </Shell>
    );
}

function LoginCard() {
    return (
        <Shell>
            <EmptyPlaceholder
                title="Login Required"
                description="You need to login to verify your email address. Please login to your account and click on the verification link again."
                icon="warning"
                endContent={
                    <Link
                        type="button"
                        size="sm"
                        href={PAGES.FRONTEND.SIGNIN.SEEKER}
                    >
                        Login
                    </Link>
                }
            />
        </Shell>
    );
}

function getErrorMessage(error: unknown) {
    if (error instanceof AxiosError)
        return error.response?.data.longMessage ?? error.message;
    else if (error instanceof Error) return error.message;
    else return DEFAULT_ERROR_MESSAGE;
}

function Shell({ className, children, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "size-full border-black/10 p-4 py-5 dark:border-white/10 md:flex md:w-2/3 md:items-center md:justify-center md:border-r md:px-4 md:py-0",
                className
            )}
            {...props}
        >
            <div className="m-auto w-full min-w-min max-w-sm space-y-5 px-2 md:w-7/12 md:px-0">
                {children}
            </div>
        </section>
    );
}
