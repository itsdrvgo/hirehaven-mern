import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { JOB_TYPES, LOCATION_TYPES, PAYMENT_MODES } from "@/config/const";
import {
    getCitiesByState,
    getCountries,
    getStatesByCountry,
} from "@/config/country";
import {
    UploadEvent,
    useCategories,
    useDropzone,
    useJobCreate,
    useJobUpdate,
} from "@/hooks";
import { cn, convertValueToLabel } from "@/lib/utils";
import {
    CreateJobData,
    createJobSchema,
    ResponseJobData,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ElementRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
    job?: ResponseJobData;
}

export function JobManageForm({ job }: PageProps) {
    const { processFiles, uploadConfig } = useDropzone();
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<ElementRef<"input">>(null!);
    const [image, setImage] = useState<ExtendedFile>();

    const form = useForm<CreateJobData>({
        resolver: zodResolver(createJobSchema),
        defaultValues: {
            companyName: job?.companyName ?? "",
            companyEmail: job?.companyEmail ?? "",
            position: job?.position ?? "",
            categoryId: job?.categoryId ?? "",
            description: job?.description ?? "",
            locationType: job?.locationType ?? "remote",
            isPublished: job?.isPublished ?? false,
            isFeatured: job?.isFeatured ?? false,
            location: {
                city: job?.location?.city ?? "",
                state: job?.location?.state ?? "",
                country: job?.location?.country ?? "",
            },
            salary: {
                mode: job?.salary?.mode ?? "yearly",
                amount: job?.salary?.amount ?? "0",
            },
            type: job?.type ?? "full_time",
        },
    });

    const { categories } = useCategories();

    const { data: countries } = useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });

    const { data: states } = useQuery({
        queryKey: ["states", form.watch("location.country")],
        queryFn: () =>
            getStatesByCountry(form.watch("location.country"), countries),
        enabled: !!form.watch("location.country") && !!countries?.length,
    });

    const { data: cities } = useQuery({
        queryKey: ["cities", form.watch("location.state")],
        queryFn: () => getCitiesByState(form.watch("location.state"), states),
        enabled: !!form.watch("location.state") && !!states?.length,
    });

    const handleUpload = (e: UploadEvent) => {
        if (job) return;
        const { message, type, data, isError } = processFiles(e);

        if (isError) return toast.error(message);
        if (!type) return;

        setIsDragging(false);

        if (type !== "image") return;

        if (data) {
            if (data.acceptedFiles.length > uploadConfig.maxImageCount)
                return toast.error(
                    "You can only upload up to " +
                        uploadConfig.maxImageCount +
                        " images"
                );

            setImage(data.acceptedFiles[0]);
        }
    };

    const { create, isCreating } = useJobCreate();
    const { update, isUpdating } = useJobUpdate();

    return (
        <Form {...form}>
            <form
                className="space-y-5"
                onSubmit={(...args) =>
                    form.handleSubmit((data) =>
                        job
                            ? update({
                                  data,
                                  jobId: job.id,
                              })
                            : create({
                                  ...data,
                                  logo: image?.file,
                              })
                    )(...args)
                }
            >
                <Card>
                    <CardHeader>
                        <CardTitle>About the Company</CardTitle>
                        <CardDescription>
                            Enter details about the company
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Company Logo</Label>

                            <div
                                className={cn(
                                    "flex min-h-80 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-5 md:gap-4",
                                    isDragging && "bg-muted",
                                    job
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                )}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (job) return;
                                    setIsDragging(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    if (job) return;
                                    setIsDragging(false);
                                }}
                                onDrop={handleUpload}
                                onPaste={handleUpload}
                                onClick={() => {
                                    if (isCreating || isUpdating || !!job)
                                        return;
                                    fileInputRef.current.click();
                                }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    className="hidden"
                                    accept={uploadConfig.acceptedImageTypes.join(
                                        ","
                                    )}
                                    multiple={
                                        uploadConfig.maxImageCount > 1
                                            ? true
                                            : false
                                    }
                                />

                                <Avatar
                                    className={cn(
                                        "size-32",
                                        !!job && "opacity-60"
                                    )}
                                >
                                    <AvatarImage
                                        src={image ? image.url : job?.logoUrl}
                                        alt={job?.companyName ?? "Company logo"}
                                        className="size-full object-cover"
                                    />
                                    <AvatarFallback>
                                        {job?.companyName[0] ?? "C"}
                                    </AvatarFallback>
                                </Avatar>

                                <p className="text-sm text-muted-foreground">
                                    {isDragging
                                        ? "Drop the file here"
                                        : "Drag and drop or click to upload your logo"}
                                </p>

                                {!image && (
                                    <Button
                                        className="font-semibold"
                                        size="sm"
                                        isDisabled={
                                            isCreating || isUpdating || !!job
                                        }
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        {isDragging
                                            ? "Drop the files here"
                                            : "Choose logo"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter company name..."
                                                isDisabled={!!job || isCreating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Company Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                inputMode="email"
                                                placeholder="Enter company email..."
                                                isDisabled={!!job || isCreating}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About the Job</CardTitle>
                        <CardDescription>
                            Enter details about the job
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the job position or title..."
                                            isDisabled={!!job || isCreating}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the job description and responsibilities..."
                                            minRows={8}
                                            className="resize-none"
                                            {...field}
                                            value={
                                                field.value.replace(
                                                    /\\n/g,
                                                    "\n"
                                                ) ?? ""
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <span className="text-xs text-muted-foreground">
                                        * You can use characters like *, **, _
                                        to format the text
                                    </span>
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    disabled={
                                                        !!job || isCreating
                                                    }
                                                >
                                                    <SelectValue placeholder="Select the job category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Job Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the job type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(JOB_TYPES).map(
                                                    (x) => (
                                                        <SelectItem
                                                            key={x}
                                                            value={x}
                                                        >
                                                            {convertValueToLabel(
                                                                x
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="locationType"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Location Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the job location type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(
                                                    LOCATION_TYPES
                                                ).map((x) => (
                                                    <SelectItem
                                                        key={x}
                                                        value={x}
                                                    >
                                                        {convertValueToLabel(x)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <FormField
                                control={form.control}
                                name="salary.amount"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Salary Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the job salary amount..."
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;

                                                    if (
                                                        !/^\d*\.?\d*$/.test(
                                                            value
                                                        )
                                                    )
                                                        return;

                                                    field.onChange({
                                                        target: {
                                                            value,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salary.mode"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Salary Mode</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the job salary mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(
                                                    PAYMENT_MODES
                                                ).map((x) => (
                                                    <SelectItem
                                                        key={x}
                                                        value={x}
                                                    >
                                                        {convertValueToLabel(x)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <FormField
                                control={form.control}
                                name="location.country"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Country</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    disabled={
                                                        !!job || isCreating
                                                    }
                                                >
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
                                name="location.state"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>State</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={
                                                !states?.length ||
                                                !form.watch("location.country")
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    disabled={
                                                        !!job || isCreating
                                                    }
                                                >
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
                                name="location.city"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>City</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            disabled={
                                                !cities?.length ||
                                                !form.watch("location.state")
                                            }
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    disabled={
                                                        !!job || isCreating
                                                    }
                                                >
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>
                            Set your job configurations
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Featured Job
                                        </FormLabel>
                                        <FormDescription>
                                            Featured jobs are highlighted and
                                            get more visibility
                                        </FormDescription>
                                    </div>

                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-readonly
                                            disabled={isCreating || isUpdating}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Published Job
                                        </FormLabel>
                                        <FormDescription>
                                            Published jobs are visible to
                                            everyone
                                            {!!job &&
                                                ". Please update the job visibility from the dashboard."}
                                        </FormDescription>
                                    </div>

                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-readonly
                                            disabled={!!job || isCreating}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button
                    className="w-full font-semibold"
                    type="submit"
                    isLoading={isCreating || isUpdating}
                    isDisabled={
                        isCreating || isUpdating || !form.formState.isDirty
                    }
                >
                    {job ? "Update Job" : "Create Job"}
                </Button>
            </form>
        </Form>
    );
}
