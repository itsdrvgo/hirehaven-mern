"use client";

import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { JobListing } from "./jobs-listing";

const seekerGenders = ["male", "male", "female", "male"];

interface PageProps extends GenericProps {
    searchParams: {
        category?: string;
        name?: string;
        type?: string;
        location?: string;
        country?: string;
        minSalary?: string;
        maxSalary?: string;
        isFeatured?: string;
    };
}

export function JobsPage({ className, searchParams, ...props }: PageProps) {
    return (
        <div className={cn("space-y-8", className)} {...props}>
            <div className="space-y-4">
                <h2 className="max-w-md text-balance text-center text-4xl font-semibold capitalize md:text-start md:text-5xl">
                    Where
                    <span className="text-primary"> Dreamers </span>
                    Find Their Next Job
                </h2>

                <p className="max-w-md text-balance text-center text-muted-foreground md:text-start">
                    We help thousands of developers find their next job. Explore
                    our job board, tools, and resources to stand out and get
                    hired.
                </p>
            </div>

            <div className="flex items-center justify-center gap-4 md:justify-start">
                <div className="flex items-center">
                    {seekerGenders.map((x, i) => (
                        <Avatar
                            key={i}
                            className={cn("outline outline-2 outline-primary", {
                                "-ml-1": i === 1,
                                "-ml-2": i === 2,
                                "-ml-3": i === 3,
                            })}
                        >
                            <AvatarImage
                                src={`https://xsgames.co/randomusers/avatar.php?g=${x}`}
                                alt={x}
                            />
                            <AvatarFallback className="uppercase">
                                {x[0]}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>

                <p className="text-sm">
                    Used by
                    <span className="text-accent"> 100K+ </span>
                    professionals
                </p>
            </div>

            <Separator />

            <JobListing searchParams={searchParams} />
        </div>
    );
}
