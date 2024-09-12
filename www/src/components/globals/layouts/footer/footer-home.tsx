"use client";

import { Icons } from "@/components/icons";
import { HireHaven, Vercel } from "@/components/svgs";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";

const footerLinks = [
    {
        title: "For Seekers",
        links: [
            {
                title: "Overview",
                href: "/about",
            },
            {
                title: "Featured Jobs",
                href: "/jobs",
            },
            {
                title: "All Jobs",
                href: "/jobs",
            },
        ],
    },
    {
        title: "For Recruiters",
        links: [
            {
                title: "Overview",
                href: "/about",
            },
            {
                title: "Become a Recruiter",
                href: "/contact?q=become-a-poster",
            },
            {
                title: "Membership",
                href: "/membership",
            },
        ],
    },
    {
        title: "Company",
        links: [
            {
                title: "About",
                href: "/about",
            },
            {
                title: "Help",
                href: "/contact",
            },
            {
                title: "Terms of Service",
                href: "/terms",
            },
            {
                title: "Privacy Policy",
                href: "/privacy",
            },
        ],
    },
];

export function FooterHome({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    const pathname = usePathname();
    if (pathname !== "/") return null;

    return (
        <footer
            className={cn("flex justify-center bg-primary/5", className)}
            {...props}
        >
            <section className="container w-full p-4 md:py-14">
                <div className="space-y-10">
                    <div className="flex flex-col items-start justify-between gap-5 md:flex-row">
                        <div className="flex items-center gap-1">
                            <HireHaven width={25} height={25} />
                            <h5 className="text-2xl font-semibold">
                                HireHaven
                            </h5>
                        </div>

                        <div className="flex flex-col gap-8 md:flex-row">
                            {footerLinks.map((section, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <h6 className="text-lg font-semibold">
                                        {section.title}
                                    </h6>

                                    <ul className="flex flex-col gap-1">
                                        {section.links.map((link, i) => (
                                            <li key={i}>
                                                <Link
                                                    href={link.href}
                                                    type="link"
                                                    className="text-sm text-muted-foreground"
                                                >
                                                    {link.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
                        {siteConfig.links && (
                            <div className="flex items-center gap-2">
                                {Object.entries(siteConfig.links).map(
                                    ([key, value], i) => {
                                        const Icon =
                                            Icons[key as keyof typeof Icons];

                                        return (
                                            <Link
                                                key={i}
                                                href={value}
                                                type="link"
                                                isExternal
                                                className="rounded-full bg-primary p-[10px] hover:bg-primary/80"
                                            >
                                                <Icon className="size-5" />
                                            </Link>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <Link
                                type="link"
                                href="https://itsdrvgo.me"
                                className="underline"
                                isExternal
                            >
                                DRVGO
                            </Link>
                            . All rights reserved.
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                            <p>Powered by</p>
                            <Link
                                type="link"
                                href="https://vercel.com"
                                isExternal
                            >
                                <Vercel width={70.75} height={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
}
