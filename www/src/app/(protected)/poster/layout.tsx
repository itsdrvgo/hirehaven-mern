import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s | Poster Panel",
    },
    description: "Dashboard for job posters.",
};

function Layout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}

export default Layout;
