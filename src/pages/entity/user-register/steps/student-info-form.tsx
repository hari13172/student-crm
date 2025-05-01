"use client";

import { Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiSearchableSelect } from "@/components/custom-ui/searchSelect/apiSearchSelection";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { studentSchema } from "../schema";
import { isFieldRequired } from "@/components/zod/checkFieldRequired";
import { routes } from "@/components/api/route";
import { useFormContext } from "react-hook-form";

export function StudentInfoForm() {
  const form = useFormContext();
  const watchedValues = form.watch();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Student Basic Details</h3>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="student.first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name
                    {isFieldRequired(studentSchema, "first_name") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="student.middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="student.last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name
                    {isFieldRequired(studentSchema, "last_name") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Number */}
            <FormField
              control={form.control}
              name="student.registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Registration Number
                    {isFieldRequired(studentSchema, "registration_number") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aadhar Number */}
            <FormField
              control={form.control}
              name="student.aadhar_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Aadhar Number
                    {isFieldRequired(studentSchema, "aadhar_number") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Father Name */}
            <FormField
              control={form.control}
              name="student.father_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mother Name */}
            <FormField
              control={form.control}
              name="student.mother_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Religion */}
            <ApiSearchableSelect
              control={form.control}
              name="student.religion"
              label="Religion"
              placeholder="Select..."
              apiUrl={routes.dropdown.religion.get} // Adjust this route as needed
              required={isFieldRequired(studentSchema, "religion.id")}
              disabled={false}
            />

            {/* Caste */}
            <ApiSearchableSelect
              control={form.control}
              name="student.caste"
              label="Caste"
              placeholder="Type Here"
              apiUrl={routes.dropdown.caste.get} // Adjust this route as needed
              required={isFieldRequired(studentSchema, "caste.id")}
              disabled={false}
            />

            {/* Email ID */}
            <FormField
              control={form.control}
              name="student.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email ID
                    {isFieldRequired(studentSchema, "email") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="student.phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number
                    {isFieldRequired(studentSchema, "phone_number") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="student.date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Date of Birth
                    {isFieldRequired(studentSchema, "date_of_birth") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="DD/MM/YYYY..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="student.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender
                    {isFieldRequired(studentSchema, "gender") && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* College */}
            <ApiSearchableSelect
              control={form.control}
              name="student.college"
              label="College"
              placeholder="Select..."
              apiUrl={routes.dropdown.colleges.get} // Adjust this route as needed
              required={isFieldRequired(studentSchema, "college")}
              disabled={false}
            />

            {/* Degree */}
            <ApiSearchableSelect
              control={form.control}
              name="student.degree"
              label="Degree"
              placeholder="Select..."
              apiUrl={routes.dropdown.college.degrees.get} // Adjust this route as needed
              required={isFieldRequired(studentSchema, "degree.id")}
              disabled={false}
            />

            {/* Department */}
            <ApiSearchableSelect
              control={form.control}
              name="student.department"
              label="Department"
              placeholder="Select..."
              apiUrl={routes.dropdown.college.departments.get} // Adjust this route as needed
              disabled={!watchedValues.student.degree.id}
              filter={`{"degree":{"$eq":"${watchedValues.student.degree.id}"}}`}
            />

            {/* Year of Passing */}
            <ApiSearchableSelect
              control={form.control}
              name="student.year_of_passing"
              label="Year of Passing"
              placeholder="Select..."
              apiUrl={routes.dropdown.college.batches.get} // Adjust this route as needed
              required={isFieldRequired(studentSchema, "year_of_passing.id")}
              disabled={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}