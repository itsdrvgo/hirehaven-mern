import { renderAsync } from "@react-email/components";
import {
    AccountDeleted,
    EmailVerification,
    EmailVerified,
    JobApplied,
    PasswordChanged,
} from "../../config/emails/index.js";
import { siteConfig } from "../../config/site.js";
import type { Transporter } from "../../interfaces/mail.js";
import { signJWT } from "../jwt/index.js";
import { transporter } from "./transporter.js";

class Mailer {
    transporter: Transporter;
    from: {
        name: string;
        address: string;
    };

    constructor(transporter: Transporter) {
        this.transporter = transporter;

        this.from = {
            name: process.env.EMAIL_FROM_NAME,
            address: process.env.EMAIL_FROM_ADDRESS,
        };
    }

    sendVerificationEmail = async ({
        user,
    }: {
        user: {
            id: string;
            username: string;
            email: string;
        };
    }) => {
        const token = signJWT(
            {
                id: user.id,
            },
            process.env.EMAIL_SECRET,
            "15m"
        );

        const html = await renderAsync(
            EmailVerification({
                site: {
                    name: siteConfig.name,
                    owner: siteConfig.owner,
                    emails: {
                        support: siteConfig.emails.support,
                    },
                },
                username: user.username,
                redirectUrl:
                    process.env.FRONTEND_URL +
                    "/auth/verify-email?token=" +
                    token,
            })
        );

        await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            subject: "Verify your email",
            html,
        });
    };

    sendEmailVerified = async ({
        user,
    }: {
        user: {
            username: string;
            email: string;
        };
    }) => {
        const html = await renderAsync(
            EmailVerified({
                site: {
                    name: siteConfig.name,
                    owner: siteConfig.owner,
                    emails: {
                        support: siteConfig.emails.support,
                    },
                },
                username: user.username,
                redirectUrl: process.env.FRONTEND_URL,
            })
        );

        await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            subject: "Email verified",
            html,
        });
    };

    sendPasswordUpdated = async ({
        user,
    }: {
        user: {
            username: string;
            email: string;
        };
    }) => {
        const html = await renderAsync(
            PasswordChanged({
                site: {
                    name: siteConfig.name,
                    emails: {
                        support: siteConfig.emails.support,
                    },
                },
                username: user.username,
            })
        );

        await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            subject: "Password updated",
            html,
        });
    };

    sendAccountDeleted = async ({
        user,
    }: {
        user: {
            username: string;
            email: string;
        };
    }) => {
        const html = await renderAsync(
            AccountDeleted({
                site: {
                    name: siteConfig.name,
                    emails: {
                        support: siteConfig.emails.support,
                    },
                },
                username: user.username,
            })
        );

        await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            subject: "Account deleted",
            html,
        });
    };

    sendJobApplied = async ({
        company,
        user,
    }: {
        company: {
            name: string;
            position: string;
            email: string;
        };
        user: {
            username: string;
            email: string;
        };
    }) => {
        const html = await renderAsync(
            JobApplied({
                company,
                username: user.username,
            })
        );

        await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME,
                address: process.env.EMAIL_FROM_ADDRESS,
            },
            to: [
                {
                    name: user.username,
                    address: user.email,
                },
            ],
            subject: `Application Submitted for ${company.name} - ${company.position}`,
            html,
        });
    };
}

export const mailer = new Mailer(transporter);
