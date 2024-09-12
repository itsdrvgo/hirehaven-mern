import { siteConfig } from "@/config/site";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Authentication",
        template: "%s | " + siteConfig.name,
    },
    description: "Authenticate yourself to continue applying for jobs",
};

function Layout({ children }: LayoutProps) {
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center md:flex-row-reverse">
            {children}
        </main>
    );
}

export default Layout;
