import { Checkbox } from "@/components/ui/checkbox";
import {
    DataTableColumnHeader,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
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
import { contactQueries } from "@/config/const";
import { useContacts } from "@/hooks";
import { convertValueToLabel } from "@/lib/utils";
import { ResponseContactData } from "@/lib/validation";
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
import { TicketAction } from "./ticket-action";

export type TableTicket = ResponseContactData & { name: string; email: string };

const columns: ColumnDef<TableTicket>[] = [
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
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "query",
        header: "Query",
        cell: ({ row }) => (
            <span>{convertValueToLabel(row.original.query)}</span>
        ),
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
            const ticket = row.original;
            return <TicketAction ticket={ticket} />;
        },
    },
];

export function TicketsTable() {
    const { data: paginatedContacts, isPending: isContactsFetching } =
        useContacts();

    const contacts = useMemo(
        () =>
            paginatedContacts?.pages
                .flatMap((page) => page!.docs)
                .map((c) => ({
                    ...c,
                    name: `${c.user.firstName} ${c.user.lastName}`,
                    email: c.user.email,
                })) ?? [],
        [paginatedContacts]
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: contacts,
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

    if (isContactsFetching) return <TicketsTableSkeleton filters={2} />;

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by name..."
                        value={
                            (table
                                .getColumn("fullName")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("fullName")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Input
                        placeholder="Search by Email..."
                        value={
                            (table
                                .getColumn("email")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("email")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Select
                        value={
                            (table
                                .getColumn("query")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onValueChange={(value) =>
                            table.getColumn("query")?.setFilterValue(value)
                        }
                    >
                        <SelectTrigger className="h-9 text-xs capitalize">
                            <SelectValue placeholder="Search by Query" />
                        </SelectTrigger>
                        <SelectContent>
                            {contactQueries.map((c) => (
                                <SelectItem
                                    key={c.value}
                                    value={c.value}
                                    className="text-xs"
                                >
                                    {c.label}
                                </SelectItem>
                            ))}
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

export function TicketsTableSkeleton({ filters = 2 }: { filters?: number }) {
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
