import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Link } from "@/components/ui/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page not found",
    description: "The page you are looking for does not exist.",
};

function Page() {
    return (
        <section className="flex h-full min-h-screen items-center justify-center">
            <EmptyPlaceholder
                title="Page not found"
                description="The page you are looking for does not exist. Please check the URL or go back to the home page."
                icon="construction"
                endContent={
                    <Link href="/" passHref type="button" size="sm">
                        Go to Home
                    </Link>
                }
            />
        </section>
    );
}

export default Page;
