"use client";

import { UploadEvent, useDropzone, useUserAvatar } from "@/hooks";
import { cn } from "@/lib/utils";
import { SafeUserData } from "@/lib/validation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

interface PageProps {
    user: SafeUserData;
}

export function UpdateAvatarCard({ user }: PageProps) {
    const { processFiles, uploadConfig } = useDropzone();
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<ElementRef<"input">>(null!);
    const [image, setImage] = useState<ExtendedFile>();

    const handleUpload = (e: UploadEvent) => {
        const { message, type, data, isError } = processFiles(e);

        if (isError) return toast.error(message);
        if (!type) return toast.error("No file selected");

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

    const { updateAvatar, isAvatarUpdating, isSuccess } = useUserAvatar(
        image?.file
    );

    useEffect(() => {
        if (isSuccess) setImage(undefined);
    }, [isSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>

            <CardContent>
                <div
                    className={cn(
                        "flex min-h-80 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-5 md:gap-4",
                        isDragging && "bg-muted"
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={handleUpload}
                    onPaste={handleUpload}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        accept={uploadConfig.acceptedImageTypes.join(",")}
                        multiple={uploadConfig.maxImageCount > 1 ? true : false}
                    />

                    <Avatar className="size-32">
                        <AvatarImage
                            src={image ? image.url : user.avatarUrl}
                            alt={user.firstName}
                            className="size-full object-cover"
                        />
                        <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                    </Avatar>

                    <p className="text-sm text-muted-foreground">
                        {isDragging
                            ? "Drop the file here"
                            : "Drag and drop or click to upload your avatar"}
                    </p>

                    {!image && (
                        <Button
                            className="font-semibold"
                            size="sm"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {isDragging
                                ? "Drop the files here"
                                : "Choose avatar"}
                        </Button>
                    )}
                </div>
            </CardContent>

            <CardFooter
                className={cn("justify-end gap-2", !image && "p-0 opacity-0")}
            >
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setImage(undefined)}
                    isDisabled={isAvatarUpdating}
                    className={cn(
                        "font-semibold",
                        !image && "pointer-events-none h-0"
                    )}
                >
                    Cancel
                </Button>

                <Button
                    size="sm"
                    onClick={() => updateAvatar()}
                    isLoading={isAvatarUpdating}
                    isDisabled={!image || isAvatarUpdating}
                    className={cn(
                        "font-semibold",
                        !image && "pointer-events-none h-0"
                    )}
                >
                    Update
                </Button>
            </CardFooter>
        </Card>
    );
}
