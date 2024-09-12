import { Checkbox } from "@/components/ui/checkbox";
import {
    DataTableColumnHeader,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks";
import { SafeUserData } from "@/lib/validation";
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
import { UserTableSkeleton } from "../seekers/seekers-table";
import { DataTablePagination } from "./data-table";
import { PosterAction } from "./poster-action";

export type TablePoster = Omit<
    SafeUserData,
    "coverLetter" | "resumeUrl" | "isProfileCompleted" | "updatedAt" | "role"
> & { fullName: string; joinedAt: Date };

const columns: ColumnDef<TablePoster>[] = [
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
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const value = `${row.original.firstName} ${row.original.lastName}`;
            return <span>{value}</span>;
        },
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            const value = row.original.address;
            const address = value
                ? Object.values(value)
                      .map((x) =>
                          typeof x === "string"
                              ? x[0].toUpperCase() + x.slice(1)
                              : x
                      )
                      .join(", ")
                : "N/A";
            return <span className="whitespace-nowrap">{address}</span>;
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            const value = row.original.phone ?? "N/A";
            return <span>{value}</span>;
        },
    },
    {
        accessorKey: "verified",
        header: "Verified",
        cell: ({ row }) => {
            const value = row.original.isVerified;
            return value ? "Yes" : "No";
        },
    },
    {
        accessorKey: "restricted",
        header: "Restricted",
        cell: ({ row }) => {
            const value = row.original.isRestricted;
            return value ? "Yes" : "No";
        },
    },
    {
        accessorKey: "joinedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Joined At" />
        ),
        cell: ({ row }) => {
            const value = row.original.createdAt;
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
            const user = row.original;
            return <PosterAction user={user} />;
        },
    },
];

export function PostersTable() {
    const { data: paginatedUsers, isPending: isUsersFetching } =
        useUsers("poster");

    const users = useMemo(
        () =>
            paginatedUsers?.pages
                .flatMap((page) => page!.docs)
                .map((user) => ({
                    ...user,
                    fullName: `${user.firstName} ${user.lastName}`,
                    joinedAt: new Date(user.createdAt),
                })) ?? [],
        [paginatedUsers]
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: users,
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

    if (isUsersFetching) return <UserTableSkeleton />;

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