import { Link } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./layout.js";

interface Props {
    company: {
        name: string;
        position: string;
        email: string;
    };
    username: string;
}

export default function JobApplied({ company, username }: Props) {
    return (
        <EmailLayout
            preview={`Application Submitted for ${company.name} - ${company.position}`}
            heading="Application Submitted"
        >
            <p>Hey {username},</p>

            <p>
                We are just writing to let you know that your application for
                the position of <strong>{company.position}</strong> at{" "}
                <strong>{company.name}</strong> has successfully been submitted.
            </p>

            <p>
                You will be contacted by the company if your application is
                successful. If you need further assistance, please contact the
                company directly via{" "}
                <Link href={"mailto:" + company.email}>mail</Link>.
            </p>
        </EmailLayout>
    );
}
