"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactQueries } from "@/config/const";
import { useContactCreate } from "@/hooks";
import { ContactData, contactSchema, SafeUserData } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface PageProps {
    searchParams: {
        q?: string;
    };
    user: SafeUserData;
}

export function ContactForm({ searchParams, user }: PageProps) {
    const { q } = searchParams;

    const form = useForm<ContactData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            query: q ?? "",
            message: "",
        },
    });

    const { sendRequest, isSendingRequest } = useContactCreate(form);

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={(...args) =>
                    form.handleSubmit((data) => {
                        sendRequest(data);
                    })(...args)
                }
            >
                <div className="flex flex-col items-center gap-2 md:flex-row">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ryomen"
                                        isDisabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Sukuna"
                                        isDisabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    inputMode="email"
                                    placeholder="ryomensukuna@jjk.jp"
                                    isDisabled
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Query</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger disabled={isSendingRequest}>
                                        <SelectValue placeholder="Select a query type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {contactQueries.map((query) => (
                                        <SelectItem
                                            key={query.value}
                                            value={query.value}
                                            disabled={query.disabled}
                                        >
                                            {query.label}
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
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="I need help with..."
                                    minRows={8}
                                    className="resize-none"
                                    disabled={isSendingRequest}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full font-semibold"
                    type="submit"
                    isDisabled={isSendingRequest}
                    isLoading={isSendingRequest}
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
}
