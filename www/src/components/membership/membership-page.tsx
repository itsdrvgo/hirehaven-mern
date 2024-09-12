import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Icons } from "../icons";

const features = [
    { name: "Advanced job search filters", free: true, pro: true },
    { name: "Unlimited job applications", free: false, pro: true },
    { name: "Priority application review", free: false, pro: true },
    { name: "Profile boost in search results", free: false, pro: true },
    { name: "Early access to new jobs", free: false, pro: true },
    { name: "Direct messaging with employers", free: false, pro: true },
    { name: "Resume review and optimization", free: false, pro: true },
    { name: "Personalized career coaching", free: false, pro: true },
];

const FeatureItem = ({
    name,
    included,
}: {
    name: string;
    included: boolean;
}) => (
    <div className="flex items-center space-x-2">
        {included ? (
            <Icons.checkCircle className="size-5 text-green-500" />
        ) : (
            <Icons.cross className="size-5 text-red-500" />
        )}
        <span
            className={included ? "text-foreground" : "text-muted-foreground"}
        >
            {name}
        </span>
    </div>
);

export function MembershipPage() {
    return (
        <div className="container space-y-16">
            <div className="space-y-2">
                <h1 className="text-center text-4xl font-bold">
                    Upgrade to HireHaven Pro
                </h1>
                <p className="text-center text-xl text-muted-foreground">
                    Supercharge your job search and career growth with our Pro
                    membership
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>
                            Basic features for job seekers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-3xl font-bold">
                            $0{" "}
                            <span className="text-lg font-normal text-muted-foreground">
                                /month
                            </span>
                        </p>
                        <div className="space-y-2">
                            {features.map((feature) => (
                                <FeatureItem
                                    key={feature.name}
                                    name={feature.name}
                                    included={feature.free}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline">
                            Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden border-primary">
                    <div className="absolute -right-20 -top-20 size-40 rounded-full bg-primary opacity-10" />
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pro Plan</CardTitle>
                            <Badge
                                variant="secondary"
                                className="bg-primary text-primary-foreground"
                            >
                                Best Value
                            </Badge>
                        </div>
                        <CardDescription>
                            Advanced features for serious job seekers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-3xl font-bold">
                            $19.99{" "}
                            <span className="text-lg font-normal text-muted-foreground">
                                /month
                            </span>
                        </p>
                        <div className="space-y-2">
                            {features.map((feature) => (
                                <FeatureItem
                                    key={feature.name}
                                    name={feature.name}
                                    included={feature.pro}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" isDisabled>
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold">
                    Frequently Asked Questions
                </h2>
                <div className="mx-auto max-w-2xl space-y-4">
                    <details className="rounded-lg border p-4">
                        <summary className="cursor-pointer font-medium">
                            What is included in the Pro membership?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            Pro membership includes all features of the free
                            plan, plus unlimited job applications, priority
                            application review, profile boost, early access to
                            new jobs, direct messaging with employers, resume
                            review, and personalized career coaching.
                        </p>
                    </details>
                    <details className="rounded-lg border p-4">
                        <summary className="cursor-pointer font-medium">
                            Can I cancel my Pro membership at any time?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            Yes, you can cancel your Pro membership at any time.
                            Your benefits will continue until the end of your
                            current billing cycle.
                        </p>
                    </details>
                    <details className="rounded-lg border p-4">
                        <summary className="cursor-pointer font-medium">
                            Is there a free trial for the Pro membership?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            We occasionally offer free trials for new users.
                            Check our promotions page or sign up for our
                            newsletter to stay informed about upcoming offers.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
}
