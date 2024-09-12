"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { User } from "@/components/ui/user";
import { PAGES } from "@/config/const";
import { menu } from "@/config/menu";
import { useSignout, useUser } from "@/hooks";
import { useNavbarStore } from "@/lib/store/navbar";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { ElementRef, useEffect, useRef } from "react";

export function NavbarMob({ className, ...props }: GenericProps) {
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const navContainerRef = useRef<ElementRef<"div">>(null!);
    const navListRef = useRef<ElementRef<"ul">>(null!);

    const { user, isPending } = useUser();

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isMenuOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                navContainerRef.current.contains(event.target as Node) &&
                !navListRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsMenuOpen]);

    const { signOut, isSigningOut } = useSignout();

    return (
        <div
            aria-label="Mobile Menu"
            data-menu-open={isMenuOpen}
            className={cn(
                "fixed inset-x-0 z-40 backdrop-blur-sm",
                "overflow-hidden p-4",
                "transition-all duration-500 ease-in-out",
                "h-0 data-[menu-open=true]:h-screen",
                "-top-1/2 bottom-0 data-[menu-open=true]:top-0",
                "md:hidden",
                className
            )}
            ref={navContainerRef}
            {...props}
        >
            <ul
                className="mt-16 space-y-4 rounded-xl border bg-background px-4 py-3 drop-shadow-md"
                ref={navListRef}
            >
                <div>
                    {menu.map((item, index) => {
                        const Icon = Icons[item.icon ?? "add"];

                        return (
                            <li
                                key={index}
                                className="border-b border-foreground/20"
                                aria-label="Mobile Menu Item"
                            >
                                <Link
                                    type="link"
                                    href={item.href}
                                    className="flex items-center justify-between gap-2 px-2 py-5 text-white"
                                    isExternal={item.isExternal}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{item.name}</span>
                                    <Icon className="size-5" />
                                </Link>
                            </li>
                        );
                    })}
                </div>

                {!isPending && user ? (
                    <div className="space-y-5 rounded-xl border p-5">
                        <div className="flex items-center justify-between gap-5">
                            <User
                                name={user.firstName}
                                description={"@" + user.firstName.toLowerCase()}
                                avatar={{
                                    src: user.avatarUrl,
                                    alt: user.firstName,
                                }}
                            />

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    signOut(user.role);
                                    setIsMenuOpen(false);
                                }}
                                isDisabled={isSigningOut}
                                isLoading={isSigningOut}
                            >
                                <Icons.logout className="size-4" />
                            </Button>
                        </div>

                        <div className="flex justify-between gap-2">
                            <Link
                                type="button"
                                href="/profile"
                                className="w-full font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </Link>

                            {user.role === "seeker" ? (
                                <Link
                                    type="button"
                                    variant="secondary"
                                    href={"/applications"}
                                    className="w-full font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Applications
                                </Link>
                            ) : (
                                <Link
                                    type="button"
                                    variant="secondary"
                                    href={
                                        user.role === "admin"
                                            ? "/admin/dashboard"
                                            : "/poster/dashboard"
                                    }
                                    className="w-full font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link
                        type="button"
                        href={PAGES.FRONTEND.SIGNIN.SEEKER}
                        className="w-full font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                )}
            </ul>
        </div>
    );
}
