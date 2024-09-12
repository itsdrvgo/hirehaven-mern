import { ApplicationPage } from "@/components/applications/application";
import { GeneralShell } from "@/components/globals/layouts";
import { TOKENS, UserRoles } from "@/config/const";
import { siteConfig } from "@/config/site";
import { getApplication } from "@/lib/react-query";
import { Metadata } from "next";
import { cookies } from "next/headers";

interface PageProps {
    params: {
        aId: string;
    };
}

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
            admin: cookieStore.get(TOKENS.ADMIN_TOKEN)?.value,
            poster: cookieStore.get(TOKENS.POSTER_TOKEN)?.value,
            seeker: cookieStore.get(TOKENS.SEEKER_TOKEN)?.value,
        };

        let role: UserRoles | undefined;

        if (siteCookies?.admin) role = "admin";
        if (siteCookies?.poster) role = "poster";
        if (siteCookies?.seeker) role = "seeker";

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
                application.job.companyName,
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

function Page({ params }: PageProps) {
    return (
        <GeneralShell>
            <ApplicationPage params={params} />
        </GeneralShell>
    );
}

export default Page;
