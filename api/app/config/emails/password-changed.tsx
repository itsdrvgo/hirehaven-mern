import { Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout.js";

interface Props {
    site: {
        name: string;
        emails: {
            support: string;
        };
    };
    username: string;
}

export default function PasswordChanged({ site, username }: Props) {
    return (
        <EmailLayout
            preview={`Password Updated for ${site.name}`}
            heading="Password Updated"
        >
            <p>Hey {username},</p>

            <p>
                Your password has been successfully updated. If you did not make
                this change, please contact us at{" "}
                <Link href={"mailto:" + site.emails.support}>support</Link>.
            </p>
        </EmailLayout>
    );
}
