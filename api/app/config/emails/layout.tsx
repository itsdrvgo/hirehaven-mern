import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Tailwind,
} from "@react-email/components";
import * as React from "react";
import { socials } from "../site.js";

interface Props {
    children?: React.ReactNode;
    preview: string;
    heading: string;
}

export default function EmailLayout({ children, preview, heading }: Props) {
    return (
        <Html>
            <Preview>{preview}</Preview>

            <Tailwind>
                <Head />
                <Body className="font-sans">
                    <Container className="max-w-3xl bg-gray-200 p-5 py-8 md:p-10">
                        <div
                            className="mb-10"
                            style={{
                                width: "100%",
                            }}
                        >
                            <Img
                                src="https://utfs.io/f/25c1fa77-bdda-406f-86e5-cb1b5ea47343-mk6pdp.png"
                                alt="HireHaven Logo"
                                width={45}
                                height={45}
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            />
                        </div>

                        <div className="mb-10 bg-white p-5 md:p-10 md:py-8">
                            <Heading
                                as="h1"
                                className="mt-0 text-2xl md:text-3xl"
                            >
                                {heading}
                            </Heading>

                            <div>{children}</div>
                        </div>

                        <div
                            className="mb-10"
                            style={{
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    width: "fit-content",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                {socials.map((social) => (
                                    <Link
                                        key={social.name}
                                        className="mx-1 rounded-full bg-blue-700 p-2 text-white"
                                        href={social.url}
                                    >
                                        <Img
                                            src={social.icon}
                                            alt={social.name}
                                            width={20}
                                            height={20}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Heading as="h4" className="my-0 mb-1">
                                Need Support?
                            </Heading>
                            <p className="my-0 text-sm text-gray-800">
                                Feel free to email us if you have any questions,
                                comments or concerns. We&apos;re here to help!
                            </p>
                        </div>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
