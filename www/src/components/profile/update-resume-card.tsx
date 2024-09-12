"use client";

import { UploadEvent, useDropzone, useUserResume } from "@/hooks";
import { cn } from "@/lib/utils";
import { SafeUserData } from "@/lib/validation";
import Link from "next/link";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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

export function UpdateResumeCard({ user }: PageProps) {
    const { processFiles, uploadConfig } = useDropzone();
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<ElementRef<"input">>(null!);
    const [resume, setResume] = useState<ExtendedFile>();

    const handleUpload = (e: UploadEvent) => {
        const { message, type, data, isError } = processFiles(e);

        if (isError) return toast.error(message);
        if (!type) return toast.error("No file selected");

        setIsDragging(false);

        if (type !== "doc") return;

        if (data) {
            if (data.acceptedFiles.length > uploadConfig.maxDocCount)
                return toast.error(
                    "You can only upload up to " +
                        uploadConfig.maxDocCount +
                        " docs"
                );

            setResume(data.acceptedFiles[0]);
        }
    };

    const { updateResume, isResumeUpdating, isSuccess } = useUserResume(
        resume?.file
    );

    useEffect(() => {
        if (isSuccess) setResume(undefined);
    }, [isSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Update your resume</CardDescription>
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
                        accept={uploadConfig.acceptedDocTypes.join(",")}
                        multiple={uploadConfig.maxDocCount > 1 ? true : false}
                    />

                    {resume ? (
                        <div className="size-full overflow-hidden rounded-sm">
                            <object
                                data={resume.url}
                                type="application/pdf"
                                width="100%"
                                height="600"
                            >
                                <p>
                                    <Link href={resume.url}>
                                        Download your resume
                                    </Link>
                                </p>
                            </object>
                        </div>
                    ) : user.resumeUrl ? (
                        <div className="size-full overflow-hidden rounded-sm">
                            <object
                                data={user.resumeUrl}
                                type="application/pdf"
                                width="100%"
                                height="600"
                            >
                                <p>
                                    <Link href={user.resumeUrl}>
                                        Download your resume
                                    </Link>
                                </p>
                            </object>
                        </div>
                    ) : null}

                    <p className="text-sm text-muted-foreground">
                        {isDragging
                            ? "Drop the file here"
                            : "Drag and drop or click to upload your resume"}
                    </p>

                    {!resume && (
                        <Button
                            className="font-semibold"
                            size="sm"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {isDragging
                                ? "Drop the files here"
                                : "Choose resume"}
                        </Button>
                    )}
                </div>
            </CardContent>

            <CardFooter
                className={cn("justify-end gap-2", !resume && "p-0 opacity-0")}
            >
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setResume(undefined)}
                    disabled={isResumeUpdating}
                    className={cn(
                        "font-semibold",
                        !resume && "pointer-events-none h-0"
                    )}
                >
                    Cancel
                </Button>

                <Button
                    size="sm"
                    onClick={() => updateResume()}
                    disabled={!resume || isResumeUpdating}
                    className={cn(
                        "font-semibold",
                        !resume && "pointer-events-none h-0"
                    )}
                >
                    {isResumeUpdating ? "Updating..." : "Update"}
                </Button>
            </CardFooter>
        </Card>
    );
}
