import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories, useCategoryDelete } from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { TableCategory } from "./categories-table";
import "@/components/ui/dialog";
import { CategoryManageForm } from "@/components/globals/forms";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PageProps {
    category: TableCategory;
}

export function CategoryAction({ category }: PageProps) {
    const { refetch } = useCategories();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { deleteCat, isDeleting } = useCategoryDelete(
        setIsDeleteModalOpen,
        refetch
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Icons.moreHor className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(category.id);
                            toast.success("ID copied to clipboard");
                        }}
                    >
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="focus:bg-destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Edit the category details
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryManageForm
                        category={category}
                        setIsOpen={setIsEditModalOpen}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>

                        <AlertDialogDescription>
                            {category.jobCount > 0
                                ? `Cannot delete ${category.name} because it has ${category.jobCount} jobs, please delete the jobs first!`
                                : `Are you sure you want to delete ${category.name}? This action is irreversible.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isDeleting}
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            isDisabled={category.jobCount > 0 || isDeleting}
                            isLoading={isDeleting}
                            onClick={() => deleteCat(category.id)}
                        >
                            Delete Category
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
