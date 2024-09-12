import { GeneralShell } from "@/components/globals/layouts";
import { MembershipPage } from "@/components/membership";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Membership",
    description: "Explore our membership options",
};

function Page() {
    return (
        <GeneralShell>
            <MembershipPage />
        </GeneralShell>
    );
}

export default Page;
