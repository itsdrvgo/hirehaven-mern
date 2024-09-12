import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { LoginButton } from "../globals/buttons";
import { Icons } from "../icons";
import { Card, CardContent } from "../ui/card";
import { Link } from "../ui/link";

export function Hero({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("relative overflow-hidden py-20", className)}
            {...props}
        >
            <div className="container relative z-10 mx-auto w-full px-4">
                <div className="flex flex-col items-center justify-center gap-10 text-center">
                    <div className="space-y-4">
                        <h1 className="bg-gradient-to-r from-red-600 via-blue-500 to-lime-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
                            Collaborate. Grow. Thrive.
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            {siteConfig.description}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <LoginButton
                            type="button"
                            href="/auth/signin"
                            size="lg"
                            className="h-12 px-6 text-base"
                            content={
                                <>
                                    <span>Join now</span>
                                    <Icons.arrowRight className="ml-2 size-4" />
                                </>
                            }
                        />

                        <Link
                            type="button"
                            size="lg"
                            variant="outline"
                            className="h-12 rounded-full px-6 text-base"
                            href="/contact?q=become-a-poster"
                        >
                            Post a Job
                            <Icons.briefcase className="ml-2 size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid w-full max-w-screen-xl grid-cols-1 gap-5 sm:grid-cols-3">
                        {[
                            {
                                icon: <Icons.users className="size-6" />,
                                title: "10,000+ Users",
                                description: "Join our thriving community",
                            },
                            {
                                icon: <Icons.briefcase className="size-6" />,
                                title: "5,000+ Jobs",
                                description: "Find your perfect role",
                            },
                            {
                                icon: <Icons.building className="size-6" />,
                                title: "1,000+ Companies",
                                description: "Connect with top startups",
                            },
                        ].map((item, index) => (
                            <Card
                                key={index}
                                className="border-primary/40 bg-primary/5 backdrop-blur-sm"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-4 rounded-full bg-accent/10 p-3 text-accent">
                                        {item.icon}
                                    </div>

                                    <h3 className="mb-2 text-lg font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-20 bg-gradient-to-b from-primary/5 to-background py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold">
                        Key Features
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: <Icons.target className="size-10" />,
                                title: "Smart Matching",
                                description:
                                    "Our AI-powered algorithm connects you with the most relevant opportunities tailored to your skills and preferences.",
                            },
                            {
                                icon: <Icons.zap className="size-10" />,
                                title: "Instant Connections",
                                description:
                                    "Connect directly with hiring managers and decision-makers, streamlining your job search process.",
                            },
                            {
                                icon: <Icons.trendingUp className="size-10" />,
                                title: "Career Growth Tools",
                                description:
                                    "Access resources, mentorship, and skill assessments to accelerate your professional development.",
                            },
                            {
                                icon: <Icons.shield className="size-10" />,
                                title: "Verified Opportunities",
                                description:
                                    "All job listings and companies on our platform are thoroughly vetted for your peace of mind.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg_glow absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2" />
        </section>
    );
}
