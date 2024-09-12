import { CategoryManageForm } from "@/components/globals/forms";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DataTableColumnHeader,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks";
import { CategoryData } from "@/lib/validation";
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
import { useState } from "react";
import { CategoryAction } from "./category-action";
import { DataTablePagination } from "./data-table";

export type TableCategory = Omit<CategoryData, "slug" | "jobs">;

const columns: ColumnDef<TableCategory>[] = [
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
        accessorKey: "jobCount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Job Count" />
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
            const category = row.original;
            return <CategoryAction category={category} />;
        },
    },
];

export function CategoriesTable() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { categories, isPending: isCategoriesFetching } = useCategories();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: categories ?? [],
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

    if (isCategoriesFetching) return <CategoryTableSkeleton filters={1} />;

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                        <Input
                            placeholder="Search by name..."
                            value={
                                (table
                                    .getColumn("name")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("name")
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        <div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Icons.plus className="size-4" />
                                <span>Add Category</span>
                            </Button>
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
                                                          header.column
                                                              .columnDef.header,
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

            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogDescription>
                            Create a new category
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryManageForm setIsOpen={setIsCreateModalOpen} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export function CategoryTableSkeleton({ filters = 2 }: { filters?: number }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-5">
                <div className="flex w-full items-center gap-2">
                    {Array.from({ length: filters }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="w- h-9 w-full max-w-80"
                        />
                    ))}
                </div>

                <div className="flex w-full items-center justify-end gap-2">
                    <Skeleton className="h-8 w-full max-w-28" />
                    <Skeleton className="h-8 w-full max-w-[4.5rem]" />
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
