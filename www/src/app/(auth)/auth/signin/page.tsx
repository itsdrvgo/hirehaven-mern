import { SigninSection } from "@/components/auth";
import { LogoSection } from "@/components/globals/layouts";
import { Metadata } from "next";

interface PageProps {
    searchParams: {
        type?: "admin" | "poster";
    };
}

export const metadata: Metadata = {
    title: "Sign In",
    description: "Log in to your account to continue applying for jobs",
};

function Page({ searchParams }: PageProps) {
    return (
        <>
            <LogoSection />
            <SigninSection searchParams={searchParams} />
        </>
    );
}

export default Page;
