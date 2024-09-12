import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function WhyChoose({ className, ...props }: GenericProps) {
    const features = [
        {
            icon: <Icons.briefcase className="size-6" />,
            title: "Curated Opportunities",
            description:
                "Access a handpicked selection of exciting startup jobs and talented professionals.",
            details:
                "Our platform connects you with the best in the startup world, offering opportunities across various industries like tech, design, marketing, and more.",
            badge: "Quality Assured",
        },
        {
            icon: <Icons.users className="size-6" />,
            title: "Strong Network",
            description:
                "Connect with a community of innovative startups and skilled job seekers.",
            details:
                "Our platform fosters meaningful connections between startups looking for talent and professionals seeking new challenges.",
            badge: "Community Driven",
        },
        {
            icon: <Icons.trendingUp className="size-6" />,
            title: "Career Growth",
            description:
                "Find opportunities that align with your career goals and help you thrive.",
            details:
                "We connect you with positions that match your skills and ambitions, ensuring you can grow in your chosen field.",
            badge: "Future Focused",
        },
        {
            icon: <Icons.search className="size-6" />,
            title: "Smart Matching",
            description:
                "Our intelligent algorithm ensures you find the perfect fit for your needs.",
            details:
                "By analyzing your preferences and qualifications, we deliver opportunities tailored to your specific requirements.",
            badge: "AI Powered",
        },
    ];

    return (
        <section
            className={cn(
                "bg-gradient-to-b from-background to-primary/5 py-20",
                className
            )}
            {...props}
        >
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-center text-4xl font-bold">
                    Why Choose{" "}
                    <span className="text-primary">{siteConfig.name}</span>
                </h2>
                <p className="mb-12 text-center text-xl text-muted-foreground">
                    Discover the advantages that set us apart in the world of
                    startup recruitment
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden transition-all hover:shadow-lg"
                        >
                            <CardHeader className="bg-primary/10 pb-4">
                                <CardTitle className="flex items-center text-2xl">
                                    <div className="mr-4 rounded-full bg-primary p-2 text-primary-foreground">
                                        {feature.icon}
                                    </div>
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-4">
                                <Badge variant="secondary">
                                    {feature.badge}
                                </Badge>
                                <p className="text-lg font-medium">
                                    {feature.description}
                                </p>
                                <p className="text-muted-foreground">
                                    {feature.details}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
