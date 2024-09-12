import { TableCategory } from "@/components/admin/categories/categories-table";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCategories, useCategoryCreate, useCategoryUpdate } from "@/hooks";
import { CreateCategoryData, createCategorySchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

interface PageProps {
    category?: TableCategory;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CategoryManageForm({ category, setIsOpen }: PageProps) {
    const { refetch } = useCategories();

    const form = useForm<CreateCategoryData>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: category?.name ?? "",
        },
    });

    const { create, isCreating } = useCategoryCreate(setIsOpen, refetch);
    const { update, isUpdating } = useCategoryUpdate(setIsOpen, refetch);

    return (
        <Form {...form}>
            <form
                className="space-y-5"
                onSubmit={(...args) =>
                    form.handleSubmit((data) =>
                        category
                            ? update({
                                  categoryId: category.id,
                                  data,
                              })
                            : create(data)
                    )(...args)
                }
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    sizes="sm"
                                    placeholder="Enter category name..."
                                    disabled={isCreating || isUpdating}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        isDisabled={isCreating || isUpdating}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button className="font-semibold" size="sm" type="submit">
                        {category
                            ? isUpdating
                                ? "Updating..."
                                : "Update"
                            : isCreating
                              ? "Creating..."
                              : "Create"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
