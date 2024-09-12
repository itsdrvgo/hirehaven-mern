import { SignupSection } from "@/components/auth";
import { LogoSection } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create an account",
    description: "Create an account to start applying for jobs",
};

function Page() {
    return (
        <>
            <LogoSection />
            <SignupSection />
        </>
    );
}

export default Page;
