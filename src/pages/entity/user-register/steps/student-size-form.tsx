"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiSearchableSelect } from "@/components/custom-ui/searchSelect/apiSearchSelection";
import { FileUploadField } from "./file-upload-filed";
import { routes } from "@/components/api/route";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function StudentSizeForm() {
  const { control, watch, setValue } = useFormContext();
  const [whatStudied, setWhatStudied] = useState<"class_12" | "diploma" | null>(null);

  const class12Studied = watch("student_size.education_details.class12_studied");
  const diplomaStudied = watch("student_size.education_details.diploma_studied");
  const pgStudied = watch("student_size.education_details.pg_studied");

  // Handle "What Studied" selection
  useEffect(() => {
    if (whatStudied === "class_12") {
      setValue("student_size.education_details.class12_studied", true);
      setValue("student_size.education_details.diploma_studied", false);
    } else if (whatStudied === "diploma") {
      setValue("student_size.education_details.class12_studied", false);
      setValue("student_size.education_details.diploma_studied", true);
    }
  }, [whatStudied, setValue]);

  const renderEducationSection = (level: string) => {
    const prefix = `student_size.education_details`;
    const isClass10 = level === "class_10";
    const isClass12 = level === "class_12";
    const isDiploma = level === "diploma";
    const isUG = level === "graduation";
    const isPG = level === "post_graduation";

    // Skip rendering if not studied
    if ((isClass12 && !class12Studied) || (isDiploma && !diplomaStudied) || (isPG && !pgStudied)) {
      return null;
    }

    return (
      <div className="space-y-4 border p-4 rounded-md bg-muted/20">
        <h3 className="text-lg font-semibold capitalize">{level.replace(/_/g, " ")}</h3>

        <FormField
          control={control}
          name={`${prefix}.${isClass10 ? "class10_year" : isClass12 ? "class12_year" : isDiploma ? "diploma_year" : isUG ? "ug_year" : "pg_year"}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Passed Out</FormLabel>
              <Input
                type="number"
                placeholder="Enter year"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {isClass10 && (
          <FormField
            control={control}
            name={`${prefix}.class10_marks`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class 10 Total Marks</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter total marks"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isClass12 && (
          <FormField
            control={control}
            name={`${prefix}.class12_marks`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class 12 Total Marks</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter total marks"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name={`${prefix}.${isClass10 ? "class10_percentage" : isClass12 ? "class12_percentage" : isDiploma ? "diploma_percentage" : isUG ? "ug_percentage_cgpa" : "pg_percentage"}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isDiploma || isUG || isPG ? "Percentage/CGPA" : "Percentage"}</FormLabel>
              <Input
                type="number"
                placeholder="Enter percentage or CGPA"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {isClass12 && (
          <FormField
            control={control}
            name={`${prefix}.class12_group`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter group"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isDiploma && (
          <FormField
            control={control}
            name={`${prefix}.diploma_department`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter department"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(isUG || isPG) && (
          <>
            <FormField
              control={control}
              name={`${prefix}.${isUG ? "ug_program" : "pg_program"}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Degree</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter degree"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${prefix}.${isUG ? "ug_branch" : "pg_branch"}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter branch"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${prefix}.${isUG ? "ug_arrear_history" : "pg_arrear_history"}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>History of Arrears</FormLabel>
                  <Input placeholder="Enter history of arrears" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${prefix}.${isUG ? "ug_current_arrear" : "pg_current_arrear"}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Arrears</FormLabel>
                  <Input placeholder="Enter current arrears" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control}
          name={`${prefix}.${isClass10 ? "class10_school" : isClass12 ? "class12_school" : isDiploma ? "diploma_college" : isUG ? "ug_college" : "pg_college"}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isDiploma || isUG || isPG ? "College" : "School"}</FormLabel>
              <Input placeholder={`Enter ${isDiploma || isUG || isPG ? "college" : "school"} name`} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {(isClass10 || isClass12 || isDiploma) && (
          <FormField
            control={control}
            name={`${prefix}.${isClass10 ? "class10_board" : isClass12 ? "class12_board" : "diploma_board"}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board</FormLabel>
                <select
                  className="form-select"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select board
                  </option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="STATE">State</option>
                  <option value="OTHER">Other</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(isUG || isPG) && (
          <FormField
            control={control}
            name={`${prefix}.${isUG ? "ug_university" : "pg_university"}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter university"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name={`${prefix}.${isClass10 ? "class10_education_type" : isClass12 ? "class12_education_type" : isDiploma ? "diploma_education_type" : isUG ? "ug_education_type" : "pg_education_type"}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Type</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FullTime" id={`${level}-fulltime`} />
                  <FormLabel htmlFor={`${level}-fulltime`}>Full Time</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PartTime" id={`${level}-parttime`} />
                  <FormLabel htmlFor={`${level}-parttime`}>Part Time</FormLabel>
                </div>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${prefix}.${isClass10 ? "class10_marksheet_path" : isClass12 ? "class12_marksheet_path" : isDiploma ? "diploma_marksheet_path" : isUG ? "ug_marksheet_path" : "pg_marksheet_path"}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Marksheet</FormLabel>
              <FileUploadField
                name={field.name}
                label="Upload Marksheet"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {isClass10 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What have you studied?</h3>
            <RadioGroup
              onValueChange={(value) => setWhatStudied(value as "class_12" | "diploma")}
              value={whatStudied || ""}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class_12" id="class_12" />
                <FormLabel htmlFor="class_12">Class 12th</FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="diploma" id="diploma" />
                <FormLabel htmlFor="diploma">Diploma</FormLabel>
              </div>
            </RadioGroup>
          </div>
        )}

        {isUG && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Post Graduation?</h3>
            <FormField
              control={control}
              name={`${prefix}.pg_studied`}
              render={({ field }) => (
                <FormItem>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value.toString()}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="pg_yes" />
                      <FormLabel htmlFor="pg_yes">Yes</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="pg_no" />
                      <FormLabel htmlFor="pg_no">No</FormLabel>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Student Education Details</h2>
        </div>

        <Separator />

        {renderEducationSection("class_10")}
        {renderEducationSection("class_12")}
        {renderEducationSection("diploma")}
        {renderEducationSection("graduation")}
        {renderEducationSection("post_graduation")}
      </CardContent>
    </Card>
  );
}