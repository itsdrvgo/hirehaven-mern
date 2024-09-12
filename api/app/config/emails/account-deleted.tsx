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

export default function AccountDeleted({ site, username }: Props) {
    return (
        <EmailLayout
            preview={`Account Deleted for ${site.name}`}
            heading="Account Deleted"
        >
            <p>Hey {username},</p>

            <p>
                Your account has been successfully deleted. Sorry to see you go!
                If you have any feedback or suggestions, please feel free to
                reach out to us at{" "}
                <Link href={"mailto:" + site.emails.support}>support</Link>.
            </p>
        </EmailLayout>
    );
}
