"use client";

import { Icons } from "@/components/icons";
import { HireHaven } from "@/components/svgs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import { PAGES } from "@/config/const";
import { siteConfig } from "@/config/site";
import { useSignout, useUser } from "@/hooks";
import { useSidebarStore, useUserDropdownStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SafeUserData } from "@/lib/validation";
import { GenericProps } from "@/types";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

interface SideMenu {
    category: string;
    items: {
        name: string;
        href: string;
        icon: keyof typeof Icons;
    }[];
}

interface PageProps extends GenericProps {
    type: "admin" | "poster";
}

export function Sidebar({ className, type, ...props }: PageProps) {
    const pathname = usePathname();
    const currentPath = pathname.split("/").filter((p) => p !== "")[1];

    const isSidebarOpen = useSidebarStore((state) => state.isOpen);
    const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);
    const isUserDropdownOpen = useUserDropdownStore((state) => state.isOpen);

    const { user, isPending } = useUser(type);

    useEffect(() => {
        if (isPending) return;

        if (!user)
            redirect(
                PAGES.FRONTEND.SIGNIN[type === "admin" ? "ADMIN" : "POSTER"]
            );

        if (!["admin", "poster"].includes(user.role))
            redirect(
                type === "admin"
                    ? PAGES.FRONTEND.SIGNIN.ADMIN
                    : PAGES.FRONTEND.SIGNIN.POSTER
            );

        if (user.role !== type) redirect("/" + user.role + "/dashboard");
    }, [isPending, type, user]);

    return (
        <div
            className={cn(
                "fixed left-0",
                "flex h-screen w-14 flex-col md:w-[4.5rem]",
                "z-10"
            )}
        >
            <aside
                data-state={isSidebarOpen ? "expanded" : "collapsed"}
                className={cn(
                    "border-r border-border/10 bg-background",
                    "h-full w-14 data-[state=expanded]:w-64 md:w-[4.5rem]",
                    "transition-width flex flex-col duration-200 ease-in-out",
                    className
                )}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() =>
                    !isUserDropdownOpen && setIsSidebarOpen(false)
                }
                {...props}
            >
                <div className="flex items-center p-4 md:px-6">
                    <Link
                        type="link"
                        href={
                            user?.role === "admin"
                                ? PAGES.FRONTEND.ADMIN.DASHBOARD
                                : PAGES.FRONTEND.POSTER.DASHBOARD
                        }
                        className="flex items-center gap-2 text-xl font-semibold"
                    >
                        <HireHaven width={25} height={25} />
                        <div
                            className={cn(
                                "whitespace-nowrap font-bold text-white transition-opacity ease-in-out",
                                !isSidebarOpen &&
                                    "pointer-events-none opacity-0"
                            )}
                        >
                            <span>{siteConfig.name}</span>
                        </div>
                    </Link>
                </div>

                <div className="flex flex-1 flex-col divide-y divide-border/10">
                    {generateSideMenu(type).map((list) => (
                        <ul
                            key={list.category}
                            className="flex flex-col gap-1 p-1 md:p-2"
                        >
                            {list.items.map((item) => {
                                const Icon = Icons[item.icon];

                                return (
                                    <li key={item.name}>
                                        <Link
                                            type="link"
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md p-3 py-4 font-semibold md:p-4",
                                                "transition-all ease-in-out",
                                                "text-sm text-muted-foreground hover:text-white",
                                                "hover:bg-card",
                                                {
                                                    "bg-muted text-white":
                                                        currentPath ===
                                                        item.name.toLowerCase(),
                                                }
                                            )}
                                        >
                                            <div>
                                                <Icon className="size-5" />
                                            </div>
                                            <span
                                                className={cn(
                                                    "whitespace-nowrap transition-opacity ease-in-out",
                                                    !isSidebarOpen &&
                                                        "pointer-events-none opacity-0"
                                                )}
                                            >
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ))}
                </div>

                {isPending ? (
                    <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />
                ) : user ? (
                    <SidebarUser
                        user={user}
                        isSidebarOpen={isSidebarOpen}
                        type={type}
                    />
                ) : (
                    <SidebarUserSkeleton isSidebarOpen={isSidebarOpen} />
                )}
            </aside>
        </div>
    );
}

function SidebarUser({
    user,
    isSidebarOpen,
    type,
}: {
    user: SafeUserData;
    isSidebarOpen: boolean;
    type: "admin" | "poster";
}) {
    return <UserItem user={user} isSidebarOpen={isSidebarOpen} type={type} />;
}

function UserItem({
    user,
    isSidebarOpen,
    type,
}: {
    user: SafeUserData;
    isSidebarOpen: boolean;
    type: "admin" | "poster";
}) {
    const isUserDropdownOpen = useUserDropdownStore((state) => state.isOpen);
    const setIsUserDropdownOpen = useUserDropdownStore(
        (state) => state.setIsOpen
    );

    const { signOut, isSigningOut } = useSignout();

    return (
        <div className="p-1 py-2 md:p-2">
            <DropdownMenu
                open={isUserDropdownOpen}
                onOpenChange={setIsUserDropdownOpen}
            >
                <DropdownMenuTrigger className="w-full">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-md p-2 py-3 md:p-3",
                            "transition-all ease-in-out",
                            "text-sm text-white",
                            "hover:bg-card"
                        )}
                    >
                        <Avatar>
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user.firstName + " " + user.lastName}
                            />
                            <AvatarFallback>
                                {user.firstName[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div
                            className={cn(
                                "text-start transition-all ease-in-out",
                                !isSidebarOpen &&
                                    "pointer-events-none opacity-0"
                            )}
                        >
                            <p className="whitespace-nowrap">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs capitalize text-muted-foreground">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    {generateSideMenu(type)[1].items.map((item) => {
                        const Icon = Icons[item.icon];

                        return (
                            <DropdownMenuItem
                                key={item.name}
                                className="p-0 focus:bg-card"
                            >
                                <Link
                                    type="link"
                                    href={item.href}
                                    className={cn(
                                        "flex w-full items-center gap-2 p-2 py-1 text-sm text-muted-foreground hover:text-white",
                                        "transition-all ease-in-out"
                                    )}
                                >
                                    <div>
                                        <Icon className="size-4" />
                                    </div>

                                    <span>{item.name}</span>
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0 focus:bg-destructive focus:text-destructive-foreground">
                        <button
                            className="w-full p-2 py-1 text-start text-sm"
                            onClick={() => signOut(user.role)}
                            disabled={isSigningOut}
                        >
                            Logout
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function SidebarUserSkeleton({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    return (
        <div className="p-1 py-2 md:p-2">
            <div className="flex items-center gap-2 rounded-md p-2 py-3 md:p-3">
                <div>
                    <Skeleton className="size-8 rounded-full" />
                </div>

                <div
                    className={cn(
                        "space-y-1 transition-all ease-in-out",
                        !isSidebarOpen && "pointer-events-none opacity-0"
                    )}
                >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

export function generateSideMenu(type: "admin" | "poster"): SideMenu[] {
    return [
        {
            category: "Management",
            items: [
                {
                    name: "Dashboard",
                    href: "/" + type + "/dashboard",
                    icon: "dashboard",
                },
                ...(type === "admin"
                    ? [
                          {
                              name: "Seekers",
                              href: "/admin/seekers",
                              icon: "users" as keyof typeof Icons,
                          },
                          {
                              name: "Posters",
                              href: "/admin/posters",
                              icon: "personStanding" as keyof typeof Icons,
                          },
                          {
                              name: "Categories",
                              href: "/admin/categories",
                              icon: "tag" as keyof typeof Icons,
                          },
                          {
                              name: "Tickets",
                              href: "/admin/tickets",
                              icon: "lifeBuoy" as keyof typeof Icons,
                          },
                      ]
                    : []),
                ...(type === "poster"
                    ? [
                          {
                              name: "Jobs",
                              href: "/poster/jobs",
                              icon: "briefcaseBusiness" as keyof typeof Icons,
                          },
                          {
                              name: "Applications",
                              href: "/poster/applications",
                              icon: "document" as keyof typeof Icons,
                          },
                      ]
                    : []),
            ],
        },
        {
            category: "Website",
            items: [
                {
                    name: "Profile",
                    href: "/profile",
                    icon: "user",
                },
                {
                    name: "Home",
                    href: "/",
                    icon: "home",
                },
            ],
        },
    ];
}
