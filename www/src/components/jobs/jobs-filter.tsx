"use client";

import { DEFAULT_FILTERS, JobTypes, LocationTypes } from "@/config/const";
import { getCountries } from "@/config/country";
import { useCategories } from "@/hooks";
import { cn } from "@/lib/utils";
import { FilterJobData, filterJobSchema } from "@/lib/validation";
import { GenericProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

const jobTypes = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "internship", label: "Internship" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
];

const locationTypes = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "Onsite" },
];

export function JobsFilter({ className, ...props }: GenericProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();

    const { categories, isPending: isCategoriesFetching } = useCategories();
    const { data: countries, isPending: isCountriesFetching } = useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });

    const form = useForm<FilterJobData>({
        resolver: zodResolver(filterJobSchema),
        defaultValues: {
            category: currentSearchParams.get("category") || "",
            type:
                (currentSearchParams.get("type")?.split(" ") as unknown as
                    | JobTypes[]
                    | undefined) || [],
            country: currentSearchParams.get("country") || "",
            name: currentSearchParams.get("name") || "",
            location:
                (currentSearchParams.get("location")?.split(" ") as unknown as
                    | LocationTypes[]
                    | undefined) || [],
            salaryRange: [
                Number(currentSearchParams.get("minSalary")) || 0,
                Number(currentSearchParams.get("maxSalary")) || 300_000,
            ],
        },
    });

    const createQueryString = useCallback(
        (params: {
            category?: string;
            name?: string;
            type?: string;
            location?: string;
            country?: string;
            minSalary?: string;
            maxSalary?: string;
            isFeatured?: string;
            status?: "draft" | "published";
            poster?: string;
        }) => {
            const existingParams = new URLSearchParams(
                currentSearchParams.toString()
            );

            for (const [key, value] of Object.entries(params)) {
                if (value) existingParams.set(key, value);
                else existingParams.delete(key);
            }

            if (existingParams.get("isFeatured") === "true")
                existingParams.delete("isFeatured");

            return existingParams.toString();
        },
        [currentSearchParams]
    );

    const handleFilter = (data: FilterJobData) => {
        const newSearchParams = createQueryString({
            type: data.type?.join(" "),
            category: data.category,
            country: data.country,
            name: data.name,
            location: data.location?.join(" "),
            minSalary: data.salaryRange?.[0].toString(),
            maxSalary: data.salaryRange?.[1].toString(),
        });

        router.push(pathname + "?" + newSearchParams);
    };

    return (
        <div
            className={cn("rounded-xl border bg-card p-5", className)}
            {...props}
        >
            <Form {...form}>
                <form
                    className="space-y-4"
                    onSubmit={(...args) =>
                        form.handleSubmit((data) => handleFilter(data))(...args)
                    }
                >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-10">
                        <div className="w-full space-y-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <SelectTrigger
                                                            className="h-9"
                                                            disabled={
                                                                isCategoriesFetching
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>

                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                form.setValue(
                                                                    "category",
                                                                    ""
                                                                );
                                                            }}
                                                        >
                                                            <Icons.cross className="size-4" />
                                                        </Button>
                                                    </div>
                                                </FormControl>

                                                <SelectContent>
                                                    {categories?.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Types</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={jobTypes}
                                                onValueChange={field.onChange}
                                                defaultValue={
                                                    field.value as string[]
                                                }
                                                placeholder="Select job types"
                                                maxCount={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full space-y-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <SelectTrigger
                                                        className="h-9"
                                                        disabled={
                                                            isCountriesFetching
                                                        }
                                                    >
                                                        <SelectValue placeholder="Select a country" />
                                                    </SelectTrigger>

                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "country",
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        <Icons.cross className="size-4" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <SelectContent>
                                                {countries?.map((country) => (
                                                    <SelectItem
                                                        key={country.iso2}
                                                        value={country.iso2}
                                                    >
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9"
                                                placeholder="Search for a job title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full space-y-4">
                            <FormField
                                control={form.control}
                                name="salaryRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salary (USD/year)</FormLabel>
                                        <FormControl>
                                            <Slider
                                                minStepsBetweenThumbs={10}
                                                max={300_000}
                                                min={0}
                                                step={1000}
                                                onValueChange={field.onChange}
                                                value={
                                                    field.value || [0, 300_000]
                                                }
                                                className={cn("w-full")}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>

                                        {locationTypes.map((item) => (
                                            <FormField
                                                key={item.value}
                                                control={form.control}
                                                name="location"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.value}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    className="border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                                                    checked={field.value?.includes(
                                                                        item.value as LocationTypes
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  field.value
                                                                                      ? [
                                                                                            ...field.value,
                                                                                            item.value,
                                                                                        ]
                                                                                      : [
                                                                                            item.value,
                                                                                        ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          item.value
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full font-semibold"
                        isDisabled={
                            isCategoriesFetching ||
                            isCountriesFetching ||
                            JSON.stringify(form.getValues()) ===
                                JSON.stringify(DEFAULT_FILTERS)
                        }
                    >
                        Apply Filters
                    </Button>
                </form>
            </Form>
        </div>
    );
}
