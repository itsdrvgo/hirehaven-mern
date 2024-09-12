import { ContactPage } from "@/components/contact";
import { GeneralShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact us for any questions or concerns.",
};

interface PageProps {
    searchParams: {
        q?: string;
    };
}

function Page({ searchParams }: PageProps) {
    return (
        <GeneralShell>
            <ContactPage searchParams={searchParams} />
        </GeneralShell>
    );
}

export default Page;
