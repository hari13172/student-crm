"use client";

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
import { Map } from "lucide-react";
import { contactPersonsSchema } from "../schema";
import { isFieldRequired } from "@/components/zod/checkFieldRequired";
import { routes } from "@/components/api/route";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

export function ContactPersonsForm() {
  const form = useFormContext();
  const [isPermanentSameAsCommunication, setIsPermanentSameAsCommunication] = useState(false);

  // Function to copy Communication Address to Permanent Address
  const handleCopyAddress = () => {
    if (isPermanentSameAsCommunication) {
      const communicationValues = {
        communication_address_line1: form.getValues("student.communication_address_line1") || "",
        communication_address_line2: form.getValues("student.communication_address_line2") || "",
        communication_district: form.getValues("student.communication_district") || "",
        communication_state: form.getValues("student.communication_state") || "",
        communication_country: form.getValues("student.communication_country") || "",
        communication_pin_code: form.getValues("student.communication_pin_code") || "",
      };
      form.setValue("student.permanent_address_line1", communicationValues.communication_address_line1);
      form.setValue("student.permanent_address_line2", communicationValues.communication_address_line2);
      form.setValue("student.permanent_district", communicationValues.communication_district);
      form.setValue("student.permanent_state", communicationValues.communication_state);
      form.setValue("student.permanent_country", communicationValues.communication_country);
      form.setValue("student.permanent_pin_code", communicationValues.communication_pin_code);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Map className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Contact Details</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Please provide the communication and permanent address details.
          </p>
          <Separator />

          {/* Communication Address */}
          <div>
            <h3 className="text-lg font-medium mb-2">Communication Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="student.communication_address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address Line 1
                      {isFieldRequired(contactPersonsSchema, "communication_address_line1") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="student.communication_address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.communication_district"
                label="District"
                placeholder="Select..."
                apiUrl={routes.dropdown.district.get}
                required={isFieldRequired(contactPersonsSchema, "communication_district")}
                disabled={false}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.communication_state"
                label="State"
                placeholder="Select..."
                apiUrl={routes.dropdown.state.get}
                required={isFieldRequired(contactPersonsSchema, "communication_state")}
                disabled={false}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.communication_country"
                label="Country"
                placeholder="Select..."
                apiUrl={routes.dropdown.country.get}
                required={isFieldRequired(contactPersonsSchema, "communication_country")}
                disabled={false}
              />

              <FormField
                control={form.control}
                name="student.communication_pin_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pin Code
                      {isFieldRequired(contactPersonsSchema, "communication_pin_code") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Permanent Address */}
          <div>
            <h3 className="text-lg font-medium mb-2">Permanent Address</h3>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="sameAsCommunication"
                checked={isPermanentSameAsCommunication}
                onChange={(e) => {
                  setIsPermanentSameAsCommunication(e.target.checked);
                  handleCopyAddress();
                }}
                className="mr-2"
              />
              <label htmlFor="sameAsCommunication" className="text-sm">
                Permanent Address is same as Communication Address
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="student.permanent_address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address Line 1
                      {isFieldRequired(contactPersonsSchema, "permanent_address_line1") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} disabled={isPermanentSameAsCommunication} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="student.permanent_address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} disabled={isPermanentSameAsCommunication} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.permanent_district"
                label="District"
                placeholder="Select..."
                apiUrl={routes.dropdown.district.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_district")}
                disabled={isPermanentSameAsCommunication}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.permanent_state"
                label="State"
                placeholder="Select..."
                apiUrl={routes.dropdown.state.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_state")}
                disabled={isPermanentSameAsCommunication}
              />

              <ApiSearchableSelect
                control={form.control}
                name="student.permanent_country"
                label="Country"
                placeholder="Select..."
                apiUrl={routes.dropdown.country.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_country")}
                disabled={isPermanentSameAsCommunication}
              />

              <FormField
                control={form.control}
                name="student.permanent_pin_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pin Code
                      {isFieldRequired(contactPersonsSchema, "permanent_pin_code") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} disabled={isPermanentSameAsCommunication} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}