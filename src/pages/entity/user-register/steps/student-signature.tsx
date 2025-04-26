"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadField } from "./file-upload-filed"; // Already imported
import { Separator } from "@/components/ui/separator";
import { Camera, Pen } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { photosSignatureSchema } from "../schema";
import { isFieldRequired } from "@/components/zod/checkFieldRequired";

export function PhotosSignatureForm() {
  const form = useFormContext();

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Photos and Signature</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Please upload your photo and signature.
          </p>
          <Separator />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="student_photos_signature.photo"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Pen className="h-5 w-5 text-primary" />
                    <FormLabel>
                      Upload Your Photo
                      {isFieldRequired(photosSignatureSchema, "photo") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <FileUploadField
                      name="student_photos_signature.photo"
                      label="Upload Your Photo"
                      accept=".jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="student_photos_signature.signature"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Pen className="h-5 w-5 text-primary" />
                    <FormLabel>
                      Upload Your Signature
                      {isFieldRequired(photosSignatureSchema, "signature") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <FileUploadField
                      name="student_photos_signature.signature"
                      label="Upload Your Signature"
                      accept=".jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}