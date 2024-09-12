"use client";

import { SignUpForm } from "@/components/globals/forms";
import { Link } from "@/components/ui/link";
import { PAGES } from "@/config/const";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";

export function SignupSection({ className, ...props }: GenericProps) {
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
                    <p className="text-2xl font-bold">Create an account</p>
                    <p>
                        <span className="text-sm opacity-80">
                            Already have an account?{" "}
                        </span>
                        <Link
                            type="link"
                            href={PAGES.FRONTEND.SIGNIN.SEEKER}
                            className="text-sm text-accent"
                        >
                            Sign in.
                        </Link>
                    </p>
                </div>

                <SignUpForm />
            </div>
        </section>
    );
}
