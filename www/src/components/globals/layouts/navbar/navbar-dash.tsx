"use client";

import { Icons } from "@/components/icons";
import { convertValueToLabel } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavbarDash() {
    const pathname = usePathname();

    return (
        <header className="border-b bg-background">
            <nav className="flex h-14 items-center">
                <div className="p-2 px-6">
                    <div className="text-sm text-muted-foreground">
                        {generatePathTitle(pathname)}
                    </div>
                </div>
            </nav>
        </header>
    );
}

function generatePathTitle(path: string) {
    const paths = path.split("/").filter((p) => p !== "");
    return (
        <div className="flex items-center gap-2">
            {paths.map((p, i) => (
                <span
                    key={i}
                    className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                    <span>{convertValueToLabel(p)}</span>
                    {i !== paths.length - 1 && (
                        <Icons.chevronRight className="size-4" />
                    )}
                </span>
            ))}
        </div>
    );
}
