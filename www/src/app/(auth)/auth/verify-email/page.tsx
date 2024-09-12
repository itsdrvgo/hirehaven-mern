import { VerifyEmailPage } from "@/components/auth/verify-email";
import { LogoSection } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email",
    description: "Verify your email address and complete your registration",
};

interface PageProps {
    searchParams: {
        token?: string;
    };
}

function Page({ searchParams }: PageProps) {
    return (
        <>
            <LogoSection />
            <VerifyEmailPage token={searchParams.token} />
        </>
    );
}

export default Page;
