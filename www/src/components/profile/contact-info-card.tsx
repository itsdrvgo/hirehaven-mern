"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getCitiesByState,
    getCountries,
    getStatesByCountry,
} from "@/config/country";
import { useUser, useUserContact } from "@/hooks";
import { cn } from "@/lib/utils";
import {
    SafeUserData,
    UpdateUserContactData,
    updateUserContactSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface ContactlInfoCardProps {
    user: SafeUserData;
}

export function ContactInfoCard({ user }: ContactlInfoCardProps) {
    const form = useForm<UpdateUserContactData>({
        resolver: zodResolver(updateUserContactSchema),
        defaultValues: {
            address: user.address ?? {
                street: "",
                city: "",
                state: "",
                country: "",
                zip: "0",
            },
            phone: user.phone ?? "",
        },
    });

    const { data: countries } = useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });

    const { data: states } = useQuery({
        queryKey: ["states", form.watch("address.country")],
        queryFn: () =>
            getStatesByCountry(form.watch("address.country"), countries),
        enabled: !!form.watch("address.country") && !!countries?.length,
    });

    const { data: cities } = useQuery({
        queryKey: ["cities", form.watch("address.state")],
        queryFn: () => getCitiesByState(form.watch("address.state"), states),
        enabled: !!form.watch("address.state") && !!states?.length,
    });

    const { updateUser, isUpdating } = useUserContact();
    const { status } = useUser();

    useEffect(() => {
        if (status === "success") form.reset(user);
    }, [status, user, form]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                    Update your contact information here. In order to book a
                    service, you must complete your contact information.
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form
                    onSubmit={(...args) =>
                        form.handleSubmit((data) => updateUser(data))(...args)
                    }
                >
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="address.country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isUpdating}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
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
                                name="address.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={
                                                !states?.length ||
                                                !form.watch(
                                                    "address.country"
                                                ) ||
                                                isUpdating
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {states?.map((state) => (
                                                    <SelectItem
                                                        key={state.state_code}
                                                        value={state.state_code}
                                                    >
                                                        {state.name}
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
                                name="address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={
                                                !cities?.length ||
                                                !form.watch("address.state") ||
                                                isUpdating
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a city" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {cities?.map((city) => (
                                                    <SelectItem
                                                        key={city.id}
                                                        value={city.name.toLowerCase()}
                                                    >
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="address.street"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Street</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter street address"
                                                isDisabled={isUpdating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address.zip"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Zip Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter zip code"
                                                isDisabled={isUpdating}
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;

                                                    if (/^[0-9]*$/.test(value))
                                                        field.onChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter phone number"
                                                isDisabled={isUpdating}
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;

                                                    if (
                                                        /^(\+)?[0-9]*$/.test(
                                                            value
                                                        )
                                                    )
                                                        field.onChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>

                    <CardFooter
                        className={cn(
                            "justify-end gap-2",
                            !form.formState.isDirty && "p-0 opacity-0"
                        )}
                    >
                        <Button
                            type="reset"
                            variant="ghost"
                            className={cn(
                                "font-semibold",
                                !form.formState.isDirty &&
                                    "pointer-events-none h-0"
                            )}
                            isDisabled={isUpdating}
                            onClick={() => form.reset()}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className={cn(
                                "font-semibold",
                                !form.formState.isDirty &&
                                    "pointer-events-none h-0"
                            )}
                            isDisabled={isUpdating}
                            isLoading={isUpdating}
                        >
                            Update
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
