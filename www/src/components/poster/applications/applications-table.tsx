import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
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
import { APPLICATION_STATUSES } from "@/config/const";
import { useApplications } from "@/hooks";
import { convertValueToLabel } from "@/lib/utils";
import { ResponseApplicationData } from "@/lib/validation";
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
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ApplicationAction } from "./application-action";
import { DataTablePagination } from "./data-table";

export type TableApplication = Pick<
    ResponseApplicationData,
    "id" | "createdAt" | "status" | "jobId" | "coverLetter" | "applicant"
> &
    Pick<ResponseApplicationData["job"], "companyName" | "position"> & {
        appliedAt: Date;
    } & {
        applicantName: string;
        applicantAddress: string;
        applicantEmail: string;
    };

const columns: ColumnDef<TableApplication>[] = [
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
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            const position = row.original.position;
            const jobUrl = `/jobs/${row.original.jobId}`;
            return (
                <Link
                    type="link"
                    href={jobUrl}
                    isExternal
                    className="gap-1 text-accent"
                >
                    <span className="whitespace-nowrap">{position}</span>
                    <div>
                        <Icons.externalLink className="size-4" />
                    </div>
                </Link>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "applicantName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const value = `${row.original.applicant.firstName} ${row.original.applicant.lastName}`;
            return <span>{value}</span>;
        },
        enableHiding: false,
    },
    {
        accessorKey: "applicantEmail",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            const email = row.original.applicant.email;
            return <span>{email}</span>;
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => {
            const phone = row.original.applicant.phone;
            return <span>{phone}</span>;
        },
    },
    {
        accessorKey: "applicantAddress",
        header: "Location",
        cell: ({ row }) => {
            const address = row.original.applicantAddress;
            return <span className="whitespace-nowrap">{address}</span>;
        },
    },
    {
        accessorKey: "appliedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Applied At" />
        ),
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return format(new Date(date), "MMM d, yyyy");
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Chip
                    variant="dot"
                    scheme={
                        status === "pending"
                            ? "primary"
                            : status === "reviewed"
                              ? "warning"
                              : status === "hired"
                                ? "success"
                                : "destructive"
                    }
                >
                    {convertValueToLabel(status)}
                </Chip>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const applicantion = row.original;
            return <ApplicationAction application={applicantion} />;
        },
    },
];

export function ApplicationsTable() {
    const searchParams = useSearchParams();

    const { data: paginatedApplications, isPending: isApplicationsFetching } =
        useApplications({
            jobId: searchParams.get("jId") ?? undefined,
            enabled: !!searchParams.get("jId"),
        });

    const applications = useMemo(
        () =>
            paginatedApplications?.pages
                .flatMap((page) => page!.docs)
                .map((application) => ({
                    ...application,
                    companyName: application.job.companyName,
                    position: application.job.position,
                    appliedAt: application.createdAt,
                    applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
                    applicantAddress: Object.entries(
                        application.applicant.address
                    )
                        .filter(([key]) => ["state", "country"].includes(key))
                        .map((x) => x[1])
                        .join(", "),
                    applicantEmail: application.applicant.email,
                })) ?? [],
        [paginatedApplications]
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: applications,
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

    if (isApplicationsFetching) return <ApplicationTableSkeleon filters={3} />;

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by applicant name..."
                        value={
                            (table
                                .getColumn("applicantName")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("applicantName")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Input
                        placeholder="Search by applicant email..."
                        value={
                            (table
                                .getColumn("applicantEmail")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("applicantEmail")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Select
                        value={
                            (table
                                .getColumn("status")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value)
                        }
                    >
                        <SelectTrigger className="h-9 text-xs capitalize">
                            <SelectValue placeholder="Search by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(APPLICATION_STATUSES).map(
                                (status) => (
                                    <SelectItem
                                        key={status}
                                        value={status}
                                        className="text-xs"
                                    >
                                        {convertValueToLabel(status)}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
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

export function ApplicationTableSkeleon({ filters = 2 }: { filters?: number }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-5">
                <div className="flex w-full items-center gap-2">
                    {Array.from({ length: filters }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="w- h-9 w-full max-w-40"
                        />
                    ))}
                </div>

                <Skeleton className="h-8 w-full max-w-[4.5rem]" />
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
