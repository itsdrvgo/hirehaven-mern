import { LayoutProps } from "@/types";

export function GeneralShell({ children }: LayoutProps) {
    return (
        <section className="flex w-full justify-center p-5 md:py-10">
            <div className="w-full max-w-6xl space-y-4">{children}</div>
        </section>
    );
}
