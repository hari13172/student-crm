"use client";

import { FileText, Loader2, SquareArrowOutUpRight, Trash2, Upload, X } from "lucide-react";
import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/components/api/fetcher";
import { routes } from "@/components/api/route";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

interface FileUploadFieldProps {
    name: string;
    label: string;
    description?: string;
    accept: string;
}

export function FileUploadField({
    name,
    label,
    description,
    accept,
}: FileUploadFieldProps) {
    const { setValue, watch } = useFormContext();
    const currentUrl = watch(name) as string | undefined;

    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentUrl);

    // react-dropzone setup
    const onDrop = useCallback((accepted: File[]) => {
        setFiles(accepted);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept.split(",").reduce((o, ext) => {
            const mime =
                ext.trim().toLowerCase() === ".jpg" ||
                    ext.trim().toLowerCase() === ".jpeg"
                    ? "image/jpeg"
                    : ext.trim().toLowerCase() === ".png"
                        ? "image/png"
                        : ext.trim().toLowerCase() === ".webp"
                            ? "image/webp"
                            : ext.trim().toLowerCase() === ".pdf"
                                ? "application/pdf"
                                : ext.trim().toLowerCase() === ".doc"
                                    ? "application/msword"
                                    : ext.trim().toLowerCase() === ".docx"
                                        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        : ext.trim().toLowerCase() === ".xlsx"
                                            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            : ext.trim().toLowerCase() === ".csv"
                                                ? "text/csv"
                                                : ext.trim().toLowerCase() === ".svg"
                                                    ? "image/svg+xml"
                                                    : ext.trim();
            return { ...o, [mime]: [ext.trim()] };
        }, {} as Record<string, string[]>),
        multiple: false,
    });

    const UploadFile = api.post(
        `${routes.files.upload}?folder_path=colleges/${watch("college.name")}`
    );

    const uploadToServer = async () => {
        if (!files.length) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("files", files[0]);
        try {
            UploadFile.mutate(formData, {
                onSuccess: (data: any) => {
                    toast.success(`${data.detail}`, {
                        description: `${new Date().toLocaleTimeString()}`,
                    });
                    const url = Array.isArray(data.file_urls)
                        ? data.file_urls[0]
                        : data.url;
                    setValue(name as any, url || "", { shouldTouch: true });
                    setUploadedUrl(url);
                    setFiles([]);
                    setUploading(false);
                },
                onError: (err) => {
                    toast.error(err.message, {
                        description: `${new Date().toLocaleTimeString()}`,
                    });
                    console.error(err);
                    setUploading(false);
                },
            });
        } catch (err) {
            console.error(err);
            setUploading(false);
        }
    };

    const deleteFile = api.delete(routes.files.delete + watch(name));

    const handleCancel = async (filePath: String) => {
        if (filePath) {
            deleteFile.mutate(undefined, {
                onSuccess: (data: any) => {
                    toast.success(data.detail || "File deleted successfully", {
                        description: `${new Date().toLocaleTimeString()}`,
                    });
                    console.log("File deleted successfully");
                    setFiles([]);
                    setUploadedUrl(undefined);
                    setValue(name as any, "", { shouldTouch: true });
                },
                onError: (error) => {
                    toast.error(error.message || "Error deleting file", {
                        description: `${new Date().toLocaleTimeString()}`,
                    });
                    console.error("Error deleting file:", error);
                    setUploading(false);
                },
            });
        }
    };

    return (
        <FormItem className="flex flex-col">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <FormLabel>{label}</FormLabel>
            </div>
            {description && (
                <FormDescription className="pl-6 text-sm">
                    {description}
                </FormDescription>
            )}

            {/* Stage 1: drop zone */}
            {!files.length && !uploadedUrl && (
                <div
                    {...getRootProps()}
                    className={
                        "p-6 border-2 border-dashed border-primary/30 rounded-lg text-center cursor-pointer w-full" +
                        (isDragActive
                            ? "border-primary bg-primary/30"
                            : "border-muted hover:border-primary")
                    }
                >
                    <input {...getInputProps()} />
                    <p className="text-muted-foreground truncate">
                        Drag & drop a file here, or click to select
                    </p>
                </div>
            )}

            {/* Stage 2: file preview + actions */}
            {files.length > 0 && (
                <div className="flex flex-col gap-2 items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="w-full">
                        <p className="font-medium truncate w-full">{files[0].name}</p>
                        <p className="text-sm text-muted-foreground">
                            {(files[0].size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                    <div className="flex gap-2 w-full">
                        <Button
                            type="button"
                            size="sm"
                            onClick={uploadToServer}
                            disabled={uploading}
                            className="w-1/2"
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : (
                                <Upload />
                            )}
                            <span>{uploading ? "Uploading" : "Upload"}</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => handleCancel("")}
                            disabled={uploading}
                            className="w-1/2"
                        >
                            <X />
                            <span>Cancel</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* Stage 3: uploaded confirmation */}
            {uploadedUrl && (
                <div className="flex flex-col gap-2 items-center justify-between bg-success/10 p-4 rounded-lg">
                    <div className="flex-1 w-full">
                        <p className="font-medium truncate">
                            {uploadedUrl.split("/").pop()}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center w-full">
                        <a
                            href={`http://10.5.0.101/api/storage/object${uploadedUrl}`}
                            target="_blank"
                            className="w-1/2"
                        >
                            <Button type="button" size="sm" className="w-full">
                                <SquareArrowOutUpRight className="w-4 h-4" />
                                <span>Preview</span>
                            </Button>
                        </a>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(uploadedUrl)}
                            type="button"
                            className="w-1/2 border-destructive/50"
                        >
                            <Trash2 className="text-destructive" />
                            <span className="text-destructive">Remove</span>
                        </Button>
                    </div>
                </div>
            )}

            <FormMessage className="pl-7" />
        </FormItem>
    );
}