import { Icons } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { PAGES } from "@/config/const";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Link } from "../ui/link";

export function About({ className, ...props }: GenericProps) {
    const features = [
        {
            icon: <Icons.target className="size-6" />,
            text: "Tailored Matches",
        },
        {
            icon: <Icons.shield className="size-6" />,
            text: "Verified Companies",
        },
        {
            icon: <Icons.lightbulb className="size-6" />,
            text: "Startup Ecosystem",
        },
        {
            icon: <Icons.graduationCap className="size-6" />,
            text: "Skill Development",
        },
    ];

    return (
        <section id="about" className={cn("py-20", className)} {...props}>
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold">
                        About{" "}
                        <span className="text-primary">{siteConfig.name}</span>
                    </h2>
                    <div className="mx-auto mb-8 h-1 w-20 bg-primary" />
                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                        HireHaven is a cutting-edge job platform designed to
                        connect innovative startups with talented professionals.
                        We believe in fostering collaboration and growth,
                        creating a haven where careers flourish and businesses
                        thrive.
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4"
                            >
                                <div className="rounded-full bg-muted p-3 text-accent">
                                    {feature.icon}
                                </div>
                                <span className="font-semibold">
                                    {feature.text}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="mt-12 flex justify-center space-x-4">
                    <Link
                        type="button"
                        href={PAGES.FRONTEND.SIGNIN.SEEKER}
                        size="lg"
                        className="px-8"
                    >
                        Join HireHaven
                        <Icons.arrowRight className="ml-2 size-4" />
                    </Link>
                    <Link
                        type="button"
                        href="/jobs"
                        size="lg"
                        variant="outline"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}
