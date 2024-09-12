"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PasswordInput } from "@/components/ui/password-input";
import { PAGES } from "@/config/const";
import { useSignup } from "@/hooks";
import { SignUpData, signUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function SignUpForm() {
    const [isChecked, setIsChecked] = useState(false);

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { signUp, isSigningUp } = useSignup(isChecked);

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={(...args) =>
                    form.handleSubmit((data) => signUp(data))(...args)
                }
            >
                <div className="flex justify-between gap-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ryomen"
                                        disabled={isSigningUp}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Sukuna"
                                        disabled={isSigningUp}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    inputMode="email"
                                    placeholder="ryomensukuna@jjk.jp"
                                    disabled={isSigningUp}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="********"
                                    disabled={isSigningUp}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="********"
                                    disabled={isSigningUp}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <p>
                        <span className="text-sm opacity-80">
                            By signing up, you agree to the processing of your
                            personal data as described in our{" "}
                        </span>
                        <Link
                            type="link"
                            href={PAGES.FRONTEND.LEGAL.PRIVACY_POLICY}
                            className="text-sm font-semibold text-accent"
                            underlined
                        >
                            Privacy Policy.
                        </Link>
                    </p>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={isChecked}
                            onCheckedChange={(c) =>
                                setIsChecked(c === "indeterminate" ? false : c)
                            }
                        />

                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I&apos;ve read and agree to the{" "}
                            <Link
                                type="link"
                                href={PAGES.FRONTEND.LEGAL.TERMS_OF_SERVICE}
                                className="font-semibold text-accent"
                                underlined
                            >
                                Terms of Service
                            </Link>
                            .
                        </label>
                    </div>
                </div>

                <Button
                    className="w-full font-semibold"
                    type="submit"
                    isDisabled={isSigningUp}
                    isLoading={isSigningUp}
                >
                    {isSigningUp ? "Signing Up" : "Sign Up"}
                </Button>
            </form>
        </Form>
    );
}
