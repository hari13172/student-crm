"use client";

import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiSearchableSelect } from "@/components/custom-ui/searchSelect/apiSearchSelection";
import { FileUploadField } from "./file-upload-filed";
import { z } from "zod";
import { routes } from "@/components/api/route";

export const studentSizeSchema = z.object({
  has_post_graduation: z.enum(["yes", "no"]).optional(),
  education_levels: z.array(
    z.object({
      level: z.enum(["class_10", "class_12", "diploma", "graduation", "post_graduation"]),
      year_of_passing: z.string(),
      percentage_or_cgpa: z.string(),
      school_institution: z.string(),
      board_university: z.string(),
      education_type: z.enum(["full_time", "part_time"]),
      marksheet: z.any().nullable(),
      class_10_total_mark: z.string().optional(),
      class_12_total_mark: z.string().optional(),
      group: z.string().optional(),
      department: z.string().optional(),
      percentage_in_diploma: z.string().optional(),
      program_degree: z.string().optional(),
      branch: z.string().optional(),
      history_of_arrear: z.string().optional(),
      current_arrear: z.string().optional(),
    })
  ),
});

export function StudentSizeForm() {
  const form = useFormContext();
  const { control, watch } = form;

  const [whatStudied, setWhatStudied] = useState<"class_12" | "diploma" | null>(null);
  const hasPostGraduation = watch("student_size.has_post_graduation");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "student_size.education_levels",
  });

  // Dynamically generate education_levels array
  useEffect(() => {
    const educationLevels = ["class_10"];

    if (whatStudied) {
      educationLevels.push(whatStudied);
    }

    educationLevels.push("graduation");

    if (hasPostGraduation === "yes") {
      educationLevels.push("post_graduation");
    }

    // Sync education levels
    replace(
      educationLevels.map((level: any) => ({
        level,
        year_of_passing: "",
        percentage_or_cgpa: "",
        school_institution: "",
        board_university: "",
        education_type: "full_time",
        marksheet: null,
        ...(level === "class_10" && { class_10_total_mark: '' }),
        ...(level === "class_12" && { group: "", class_12_total_mark: "" }),
        ...(level === "diploma" && { department: "", percentage_in_diploma: "" }),
        ...(["graduation", "post_graduation"].includes(level) && {
          program_degree: "",
          branch: "",
          history_of_arrear: "",
          current_arrear: "",
        }),
      }))
    );
  }, [whatStudied, hasPostGraduation, replace]);

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Student Education Details</h2>
        </div>

        {/* Select What You Studied */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">What have you studied?</h3>
          <FormItem>
            <FormControl>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="class_12"
                    checked={whatStudied === "class_12"}
                    onChange={() => setWhatStudied("class_12")}
                  />
                  Class 12th
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="diploma"
                    checked={whatStudied === "diploma"}
                    onChange={() => setWhatStudied("diploma")}
                  />
                  Diploma
                </label>
              </div>
            </FormControl>
          </FormItem>
        </div>

        {/* Select Post Graduation */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Post Graduation?</h3>
          <FormField
            control={control}
            name="student_size.has_post_graduation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="yes"
                        checked={field.value === "yes"}
                        onChange={() => field.onChange("yes")}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="no"
                        checked={field.value === "no"}
                        onChange={() => field.onChange("no")}
                      />
                      No
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Dynamic Form Based on Levels */}
        {fields.map((field: any, index) => {
          const prefix = `student_size.education_levels.${index}`;
          const level = field.level;

          return (
            <div key={field.id} className="space-y-4 border p-4 rounded-md bg-muted/20">
              <h3 className="text-lg font-semibold capitalize">{level.replaceAll("_", " ")}</h3>

              <ApiSearchableSelect
                control={control}
                name={`${prefix}.year_of_passing`}
                label="Year of Passed Out"
                placeholder="Select year"
                apiUrl={routes.dropdown.college.batches.get}
                required
              />

              {/* Marks based on level */}
              {level === "diploma" ? (
                <Input placeholder="Percentage in Diploma" {...form.register(`${prefix}.percentage_in_diploma`)} />
              ) : (
                <Input placeholder="Percentage/CGPA" {...form.register(`${prefix}.percentage_or_cgpa`)} />
              )}

              {level === "class_10" && (
                <Input placeholder="Class 10th Total Marks" {...form.register(`${prefix}.class_10_total_mark`)} />
              )}

              {level === "class_12" && (
                <>
                  <Input placeholder="Class 12th Total Marks" {...form.register(`${prefix}.class_12_total_mark`)} />
                  <ApiSearchableSelect
                    control={control}
                    name={`${prefix}.group`}
                    label="Group"
                    placeholder="Select group"
                    apiUrl={routes.dropdown.group.get}
                    required
                  />
                </>
              )}

              {level === "diploma" && (
                <ApiSearchableSelect
                  control={control}
                  name={`${prefix}.department`}
                  label="Department"
                  placeholder="Select department"
                  apiUrl={routes.dropdown.college.departments.get}
                  required
                />
              )}

              {["graduation", "post_graduation"].includes(level) && (
                <>
                  <ApiSearchableSelect
                    control={control}
                    name={`${prefix}.program_degree`}
                    label="Program Degree"
                    placeholder="Select degree"
                    apiUrl={routes.dropdown.college.degrees.get}
                    required
                  />
                  <ApiSearchableSelect
                    control={control}
                    name={`${prefix}.branch`}
                    label="Branch"
                    placeholder="Select branch"
                    apiUrl={routes.dropdown.branch.get}
                    required
                  />
                  <Input placeholder="History of Arrears" {...form.register(`${prefix}.history_of_arrear`)} />
                  <Input placeholder="Current Arrears" {...form.register(`${prefix}.current_arrear`)} />
                </>
              )}

              <Input
                placeholder="School / College / Institution"
                {...form.register(`${prefix}.school_institution`)}
              />

              <ApiSearchableSelect
                control={control}
                name={`${prefix}.board_university`}
                label="Board / University"
                placeholder="Select Board/University"
                apiUrl={routes.dropdown.board.get}
                required
              />

              {/* Education Type */}
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="full_time"
                    {...form.register(`${prefix}.education_type`)}
                    defaultChecked
                  />
                  Full Time
                </label>
                <label>
                  <input type="radio" value="part_time" {...form.register(`${prefix}.education_type`)} />
                  Part Time
                </label>
              </div>

              {/* Marksheet upload */}
              <FileUploadField
                name={`${prefix}.marksheet`}
                label="Upload Marksheet"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

