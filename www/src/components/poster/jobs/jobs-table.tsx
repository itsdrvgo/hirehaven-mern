import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DataTableColumnHeader,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { JOB_TYPES, LOCATION_TYPES, PAGES } from "@/config/const";
import { useInfiniteJobs, useUser } from "@/hooks";
import { convertValueToLabel } from "@/lib/utils";
import { ResponseJobData } from "@/lib/validation";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { DataTablePagination } from "./data-table";
import { JobAction } from "./job-action";

export type TableJob = Omit<
    ResponseJobData,
    "postedBy" | "applicants" | "location"
> & {
    company: string;
    location: string;
    place: ResponseJobData["location"];
};

const columns: ColumnDef<TableJob>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
    },
    {
        accessorKey: "company",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Company" />
        ),
        enableHiding: false,
    },
    {
        accessorKey: "position",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Position" />
        ),
        cell: ({ row }) => {
            const value = row.original.position;
            const isPublished = row.original.isPublished;
            return isPublished ? (
                <Link
                    type="link"
                    href={`/jobs/${row.original.id}`}
                    className="gap-1 whitespace-nowrap text-accent"
                    isExternal
                >
                    <span>{value}</span>
                    <Icons.externalLink className="size-4" />
                </Link>
            ) : (
                <span className="whitespace-nowrap">{value}</span>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Job Type",
        cell: ({ row }) => {
            const value = convertValueToLabel(row.original.type);
            return <span>{value}</span>;
        },
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const value = row.original.location;
            return <span className="whitespace-nowrap">{value}</span>;
        },
    },
    {
        accessorKey: "locationType",
        header: () => <span className="whitespace-nowrap">Location Type</span>,
        cell: ({ row }) => {
            const value = convertValueToLabel(row.original.locationType);
            return <span>{value}</span>;
        },
    },
    {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) => {
            const value = row.original.salary;
            return (
                <span>
                    {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                    }).format(Number(value.amount))}
                    /{value.mode.slice(0, -2)}
                </span>
            );
        },
    },
    {
        accessorKey: "applications",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Applications" />
        ),
        cell: ({ row }) => {
            const value = row.original.applications;
            return <span>{Intl.NumberFormat("en-US").format(value)}</span>;
        },
    },
    {
        accessorKey: "published",
        header: "Published",
        cell: ({ row }) => {
            const value = row.original.isPublished;
            return <span>{value ? "Yes" : "No"}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const value = new Date(row.original.createdAt);
            return (
                <span className="whitespace-nowrap">
                    {format(value, "PPP")}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const job = row.original;
            return <JobAction job={job} />;
        },
    },
];

export function JobsTable() {
    const { user } = useUser("poster");

    const { paginatedJobs, isPending: isJobsFetching } = useInfiniteJobs({
        poster: user?.id!,
    });

    const jobs = useMemo(
        () =>
            paginatedJobs?.pages
                .flatMap((page) => page!.docs)
                .map((job) => ({
                    ...job,
                    place: job.location,
                    company: job.companyName,
                    location: Object.values(job.location)
                        .map((x) =>
                            typeof x === "string" ? convertValueToLabel(x) : x
                        )
                        .join(", "),
                })) ?? [],
        [paginatedJobs]
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: jobs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (isJobsFetching) return <JobTableSkeleton filters={3} />;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search by company..."
                                value={
                                    (table
                                        .getColumn("company")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn("company")
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />

                            <Input
                                placeholder="Search by position..."
                                value={
                                    (table
                                        .getColumn("position")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn("position")
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />

                            <Input
                                placeholder="Search by location..."
                                value={
                                    (table
                                        .getColumn("location")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn("location")
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={
                                    (table
                                        .getColumn("type")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onValueChange={(value) =>
                                    table
                                        .getColumn("type")
                                        ?.setFilterValue(value)
                                }
                            >
                                <SelectTrigger className="h-9 text-xs capitalize">
                                    <SelectValue placeholder="Search by job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(JOB_TYPES).map((x) => (
                                        <SelectItem
                                            key={x}
                                            value={x}
                                            className="text-xs"
                                        >
                                            {convertValueToLabel(x)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    (table
                                        .getColumn("locationType")
                                        ?.getFilterValue() as string) ?? ""
                                }
                                onValueChange={(value) =>
                                    table
                                        .getColumn("locationType")
                                        ?.setFilterValue(value)
                                }
                            >
                                <SelectTrigger className="h-9 text-xs capitalize">
                                    <SelectValue placeholder="Search by location type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(LOCATION_TYPES).map((x) => (
                                        <SelectItem
                                            key={x}
                                            value={x}
                                            className="text-xs"
                                        >
                                            {convertValueToLabel(x)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex w-full justify-end md:w-fit">
                        <Link
                            type="button"
                            href={PAGES.FRONTEND.POSTER.JOBS.CREATE}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Icons.plus className="size-4" />
                            <span>Post a Job</span>
                        </Link>
                    </div>
                </div>

                <DataTableViewOptions table={table} />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}

export function JobTableSkeleton({ filters = 2 }: { filters?: number }) {
    return (
        <div className="space-y-5">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
                <div className="w-full space-y-2">
                    <div className="flex w-full items-center gap-2">
                        {Array.from({ length: filters }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w- h-9 w-full max-w-40"
                            />
                        ))}
                    </div>

                    <div className="flex w-full items-center gap-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <Skeleton key={index} className="w- h-9 w-full" />
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-end gap-2">
                    <Skeleton className="h-8 w-full max-w-[6.5rem]" />
                    <Skeleton className="hidden h-8 w-full max-w-[4.5rem] md:inline-block" />
                </div>
            </div>

            <Skeleton className="h-96 w-full" />

            <div className="flex items-center justify-between gap-5">
                <Skeleton className="h-5 w-full max-w-48" />

                <div className="flex items-center gap-6">
                    <Skeleton className="h-5 w-32" />

                    <div className="flex gap-2">
                        <Skeleton className="size-9" />
                        <Skeleton className="size-9" />
                    </div>
                </div>
            </div>
        </div>
    );
}
