import { GeneralShell } from "@/components/globals/layouts";
import { ProfilePage } from "@/components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Manage and view your profile.",
};

function Page() {
    return (
        <GeneralShell>
            <ProfilePage />
        </GeneralShell>
    );
}

export default Page;
