import { PAGES } from "@/config/const";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Icons } from "../icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "../ui/link";

export function HowItWorks({ className, ...props }: GenericProps) {
    const steps = [
        {
            icon: <Icons.search className="size-10" />,
            title: "Search",
            description:
                "Browse through our curated list of startup jobs or talented professionals.",
            details:
                "Use our advanced filters to find the perfect match for your skills or company needs.",
            color: "text-blue-500",
        },
        {
            icon: <Icons.users className="size-10" />,
            title: "Connect",
            description:
                "Reach out to potential candidates or employers that match your criteria.",
            details:
                "Our platform facilitates seamless communication between job seekers and employers.",
            color: "text-green-500",
        },
        {
            icon: <Icons.trendingUp className="size-10" />,
            title: "Grow",
            description:
                "Collaborate on exciting projects and advance your career or business.",
            details:
                "Join a thriving community of innovators and take your professional journey to new heights.",
            color: "text-purple-500",
        },
    ];

    return (
        <section className={cn("py-20", className)} {...props}>
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-center text-4xl font-bold">
                    How <span className="text-primary">{siteConfig.name}</span>{" "}
                    Works
                </h2>
                <p className="mb-12 text-center text-xl text-muted-foreground">
                    Your journey to success in three simple steps
                </p>
                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden transition-all hover:shadow-lg"
                        >
                            <div
                                className={cn(
                                    "absolute inset-x-0 top-0 h-1",
                                    step.color
                                )}
                            />
                            <CardHeader>
                                <div
                                    className={cn(
                                        "mb-4 inline-block rounded-full p-3",
                                        `bg-${step.color}/10`
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "rounded-full p-2",
                                            step.color
                                        )}
                                    >
                                        {step.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">
                                    <span
                                        className={cn(
                                            "mr-2 text-3xl font-bold",
                                            step.color
                                        )}
                                    >
                                        {index + 1}.
                                    </span>
                                    {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-lg">{step.description}</p>
                                <p className="text-muted-foreground">
                                    {step.details}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        type="button"
                        href={PAGES.FRONTEND.SIGNIN.SEEKER}
                        size="lg"
                        className="px-8"
                    >
                        Get Started Now
                        <Icons.arrowRight className="ml-2 size-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
