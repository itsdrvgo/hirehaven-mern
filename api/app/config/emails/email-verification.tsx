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

export default function EmailVerification({
    site,
    redirectUrl,
    username,
}: Props) {
    return (
        <EmailLayout
            preview="Verify your email"
            heading="Verify This Email Address"
        >
            <p>
                Hey {username}, Welcome to {site.name}!
            </p>

            <p>
                Click the button below to verify your email and start using{" "}
                {site.name}. This link will expire in 15 minutes.
            </p>

            <p>
                If you did not sign up for an account, you can safely ignore
                this email or you can contact us at our{" "}
                <Link href={"mailto:" + site.emails.support}>support</Link>{" "}
                email.
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
                    Verify email
                </Button>
            </div>
        </EmailLayout>
    );
}
