"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import { CategoriesTable, CategoryTableSkeleton } from "./categories-table";

export function CategoiesPage({ className, ...props }: GenericProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("admin");

    if (isUserFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Categories Table</h1>
                    <p className="text-sm text-muted-foreground">
                        View & Manage all Job Categories
                    </p>
                </div>

                <CategoryTableSkeleton filters={1} />
            </div>
        );

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.ADMIN);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Categories Table</h1>
                <p className="text-sm text-muted-foreground">
                    View & Manage all Job Categories
                </p>
            </div>

            <CategoriesTable />
        </div>
    );
}
