"use client";

import { SignInForm } from "@/components/globals/forms";
import { Link } from "@/components/ui/link";
import { PAGES } from "@/config/const";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";

interface PageProps extends GenericProps {
    searchParams: {
        type?: "admin" | "poster";
    };
}

export function SigninSection({
    className,
    searchParams,
    ...props
}: PageProps) {
    return (
        <section
            className={cn(
                "size-full border-black/10 p-4 py-5 dark:border-white/10 md:flex md:w-2/3 md:items-center md:justify-center md:border-r md:px-4 md:py-0",
                className
            )}
            {...props}
        >
            <div className="m-auto w-full min-w-min max-w-sm space-y-5 px-2 md:w-7/12 md:px-0">
                <div className="space-y-1">
                    <p className="text-2xl font-bold">
                        {searchParams.type === "admin"
                            ? "Sign In as Admin"
                            : searchParams.type === "poster"
                              ? "Sign In as Job Poster"
                              : "Sign In"}
                    </p>

                    <p>
                        {searchParams.type === "admin" ? (
                            <span className="text-sm opacity-80">
                                Sign in to access the admin dashboard
                            </span>
                        ) : searchParams.type === "poster" ? (
                            <span className="text-sm opacity-80">
                                Sign in to manage your job postings and
                                applications
                            </span>
                        ) : (
                            <>
                                <span className="text-sm opacity-80">
                                    New to {siteConfig.name}?{" "}
                                </span>

                                <Link
                                    type="link"
                                    href={PAGES.FRONTEND.SIGNUP}
                                    className="text-sm text-accent"
                                >
                                    Create an account.
                                </Link>
                            </>
                        )}
                    </p>
                </div>

                <SignInForm searchParams={searchParams} />
            </div>
        </section>
    );
}
