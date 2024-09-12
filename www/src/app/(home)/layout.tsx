import {
    FooterHome,
    FooterOthers,
    Navbar,
    NavbarMob,
} from "@/components/globals/layouts";
import { siteConfig } from "@/config/site";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Home - Find jobs and hire talents in tech",
        template: "%s | " + siteConfig.name,
    },
};

function Layout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <FooterHome />
            <FooterOthers />
            <NavbarMob />
        </div>
    );
}

export default Layout;
