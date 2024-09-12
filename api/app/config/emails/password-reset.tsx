import { Heading, Link } from "@react-email/components";
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
    otp: number;
}

export default function PasswordReset({ site, username, otp }: Props) {
    return (
        <EmailLayout
            preview={`Password reset OTP for ${site.name}`}
            heading="Password Reset"
        >
            <p>Hey {username},</p>

            <p>
                Seems like you requested for a password reset for your account
                in {site.name}. If that was you, use the OTP below to reset your
                password.
            </p>

            <Heading as="h2" className="text-center">
                {otp}
            </Heading>

            <p>
                If you did not request for a password reset, you can safely
                ignore this email or contact our{" "}
                <Link href={"mailto:" + site.emails.support}>support</Link>{" "}
                email.
            </p>
        </EmailLayout>
    );
}
