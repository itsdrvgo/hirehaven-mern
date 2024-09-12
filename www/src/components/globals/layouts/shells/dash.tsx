import { LayoutProps } from "@/types";
import { Sidebar } from "../../sidebar";
import { NavbarDash } from "../navbar";

interface PageProps extends LayoutProps {
    type: "admin" | "poster";
}

export function DashShell({ children, type }: PageProps) {
    return (
        <>
            <Sidebar type={type} />

            <div className="ml-14 flex flex-1 flex-col md:ml-[4.5rem]">
                <NavbarDash />

                <section className="flex w-full justify-center p-5 md:py-10">
                    <div className="w-full max-w-6xl space-y-4">{children}</div>
                </section>
            </div>
        </>
    );
}
