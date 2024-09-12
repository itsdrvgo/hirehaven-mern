"use client";

import { Icons } from "@/components/icons";
import { HireHaven } from "@/components/svgs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { User } from "@/components/ui/user";
import { menu } from "@/config/menu";
import { siteConfig } from "@/config/site";
import { useSignout, useUser } from "@/hooks";
import { useNavbarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginButton } from "../../buttons";

export function Navbar() {
    const router = useRouter();

    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const { user, isPending } = useUser();

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    const { signOut, isSigningOut } = useSignout();

    return (
        <motion.header
            variants={{
                visible: {
                    y: 0,
                },
                hidden: {
                    y: "-100%",
                },
            }}
            animate={isMenuHidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
            className="sticky inset-x-0 top-0 z-50 flex h-auto w-full items-center justify-center border-b bg-transparent p-4 backdrop-blur-md backdrop-saturate-100"
            data-menu-open={isMenuOpen}
        >
            <nav className="container flex items-center justify-between gap-5 px-0 md:px-4">
                <Link
                    type="link"
                    href="/"
                    className="space-x-2 text-2xl font-bold"
                >
                    <HireHaven width={25} height={25} />
                    <p className="text-xl font-bold md:text-2xl">
                        {siteConfig.name}
                    </p>
                </Link>

                <div className="flex items-center gap-6">
                    <ul className="hidden items-center gap-2 sm:flex md:gap-4">
                        {!!menu.length &&
                            menu.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        type="link"
                                        className={cn(
                                            "font-semibold",
                                            "hover:text-foreground/80"
                                        )}
                                        href={item.href}
                                        isExternal={item.isExternal}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                    </ul>

                    <div className="flex items-center">
                        <button
                            aria-label="Mobile Menu Toggle Button"
                            aria-pressed={isMenuOpen}
                            className="sm:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Icons.menu className="size-6" />
                        </button>

                        {!isPending && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="hidden sm:inline-flex">
                                    <Avatar className="outline outline-2 outline-primary">
                                        <AvatarImage
                                            src={user.avatarUrl}
                                            alt={user.firstName}
                                        />
                                        <AvatarFallback>
                                            {user.firstName[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="min-w-44">
                                    <DropdownMenuLabel>
                                        <User
                                            name={
                                                user.firstName +
                                                " " +
                                                user.lastName
                                            }
                                            avatar={{
                                                src: user.avatarUrl,
                                                alt: user.firstName,
                                            }}
                                        />
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="gap-2"
                                        onSelect={() => router.push("/profile")}
                                    >
                                        <Icons.user className="size-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>

                                    {user.role !== "seeker" ? (
                                        <DropdownMenuItem
                                            className="gap-2"
                                            onSelect={() =>
                                                router.push(
                                                    user.role === "admin"
                                                        ? "/admin/dashboard"
                                                        : "/poster/dashboard"
                                                )
                                            }
                                        >
                                            <Icons.dashboard className="size-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            className="gap-2"
                                            onSelect={() =>
                                                router.push("/applications")
                                            }
                                        >
                                            <Icons.dashboard className="size-4" />
                                            <span>My Applications</span>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="gap-2 focus:bg-destructive focus:text-destructive-foreground"
                                        onSelect={() => signOut(user.role)}
                                        disabled={isSigningOut}
                                    >
                                        <Icons.logout className="size-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <LoginButton className="hidden md:inline-block" />
                        )}
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}
