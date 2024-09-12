import { DashShell } from "@/components/globals/layouts";
import { ApplicationPage } from "@/components/poster/applications/application";
import { TOKENS, UserRoles } from "@/config/const";
import { siteConfig } from "@/config/site";
import { getApplication } from "@/lib/react-query";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        const cookieStore = cookies();
        if (!cookieStore)
            return {
                title: "Not Found",
                description: "No application was found.",
            };

        const siteCookies = {
            poster: cookieStore.get(TOKENS.POSTER_TOKEN)?.value,
        };

        let role: UserRoles | undefined;

        if (siteCookies?.poster) role = "poster";

        const application = await getApplication(params.aId, siteCookies, role);
        if (!application)
            return {
                title: "Not Found",
                description: "No application was found.",
            };

        return {
            title:
                "Application for '" +
                application.job.position +
                "'" +
                " at " +
                application.job.companyName +
                " by " +
                application.applicant.firstName +
                " " +
                application.applicant.lastName,
            description: application.job.description,
            keywords: [
                application.job.position,
                application.job.companyName,
                Object.values(application.job.location).join(","),
                application.job.type,
                application.job.locationType,
                application.job.salary.amount +
                    " " +
                    application.job.salary.mode,
                siteConfig.keywords?.join(",") ?? "",
            ],
        };
    } catch (err) {
        return {
            title: "Not Found",
            description: "No application was found.",
        };
    }
}

interface PageProps {
    params: {
        aId: string;
    };
}

function Page({ params }: PageProps) {
    return (
        <DashShell type="poster">
            <ApplicationPage params={params} />
        </DashShell>
    );
}

export default Page;
