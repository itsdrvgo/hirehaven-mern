import { Button, Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout.js";

interface Props {
    site: {
        name: string;
        owner: string;
        emails: {
            support: string;
        };
    };
    username: string;
    redirectUrl: string;
}

export default function EmailVerified({ site, redirectUrl, username }: Props) {
    return (
        <EmailLayout
            preview={`Account verified for ${site.name}`}
            heading="Account Verified"
        >
            <p>
                Hey {username}, Welcome to {site.name}!
            </p>

            <p>
                Your account has been successfully verified. You can now access
                your dashboard and start using our services. Best of luck
                getting your next job!
            </p>

            <p>
                If you need any kind of assistance, feel free to contact us at{" "}
                <Link href={"mailto:" + site.emails.support}>support</Link>.
            </p>

            <div className="mb-5">
                <p className="my-0">{site.owner}</p>
                <p className="my-0">{site.name} Team</p>
            </div>

            <div
                style={{
                    width: "100%",
                }}
            >
                <Button
                    href={redirectUrl}
                    className="rounded-full bg-blue-700 px-10 py-3 text-white"
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                        width: "fit-content",
                    }}
                >
                    Go to Dashboard
                </Button>
            </div>
        </EmailLayout>
    );
}
