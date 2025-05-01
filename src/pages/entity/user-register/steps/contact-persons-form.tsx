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
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function ContactPersonsForm() {
  const { control, watch, setValue, getValues } = useFormContext();
  const [isPermanentSameAsCommunication, setIsPermanentSameAsCommunication] = useState(false);

  // Watch individual communication address fields
  const commAddressLine1 = watch("student_contact_persons.communication_address_line1");
  const commAddressLine2 = watch("student_contact_persons.communication_address_line2");
  const commDistrict = watch("student_contact_persons.communication_district");
  const commState = watch("student_contact_persons.communication_state");
  const commCountry = watch("student_contact_persons.communication_country");
  const commPinCode = watch("student_contact_persons.communication_pin_code");

  // Update permanent address fields when communication address changes and checkbox is checked
  useEffect(() => {
    if (isPermanentSameAsCommunication) {
      // Only update if values differ to prevent infinite loop
      const currentValues = getValues();
      if (currentValues.student_contact_persons.permanent_address_line1 !== (commAddressLine1 || "")) {
        setValue("student_contact_persons.permanent_address_line1", commAddressLine1 || "", { shouldDirty: true });
      }
      if (currentValues.student_contact_persons.permanent_address_line2 !== (commAddressLine2 || "")) {
        setValue("student_contact_persons.permanent_address_line2", commAddressLine2 || "", { shouldDirty: true });
      }
      if (currentValues.student_contact_persons.permanent_district !== (commDistrict || "")) {
        setValue("student_contact_persons.permanent_district", commDistrict || "", { shouldDirty: true });
      }
      if (currentValues.student_contact_persons.permanent_state !== (commState || "")) {
        setValue("student_contact_persons.permanent_state", commState || "", { shouldDirty: true });
      }
      if (currentValues.student_contact_persons.permanent_country !== (commCountry || "")) {
        setValue("student_contact_persons.permanent_country", commCountry || "", { shouldDirty: true });
      }
      if (currentValues.student_contact_persons.permanent_pin_code !== (commPinCode || "")) {
        setValue("student_contact_persons.permanent_pin_code", commPinCode || "", { shouldDirty: true });
      }
    }
  }, [
    isPermanentSameAsCommunication,
    commAddressLine1,
    commAddressLine2,
    commDistrict,
    commState,
    commCountry,
    commPinCode,
    setValue,
    getValues,
  ]);

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setIsPermanentSameAsCommunication(checked);
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
                control={control}
                name="student_contact_persons.communication_address_line1"
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
                control={control}
                name="student_contact_persons.communication_address_line2"
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
                control={control}
                name="student_contact_persons.communication_country"
                label="Country"
                placeholder="Select..."
                apiUrl={routes.dropdown.country.get}
                required={isFieldRequired(contactPersonsSchema, "communication_country")}
              />

              <ApiSearchableSelect
                control={control}
                name="student_contact_persons.communication_state"
                label="State"
                placeholder="Select..."
                apiUrl={routes.dropdown.state.get}
                required={isFieldRequired(contactPersonsSchema, "communication_state")}
                disabled={!watch("student_contact_persons.communication_country")}
                filter={`{"country_id":{"$eq":"${watch("student_contact_persons.communication_country")}"}}`}
              />

              <ApiSearchableSelect
                control={control}
                name="student_contact_persons.communication_district"
                label="District"
                placeholder="Select..."
                apiUrl={routes.dropdown.district.get}
                required={isFieldRequired(contactPersonsSchema, "communication_district")}
                disabled={!watch("student_contact_persons.communication_state")}
                filter={`{"state_id":{"$eq":"${watch("student_contact_persons.communication_state")}"}}`}
              />

              <FormField
                control={control}
                name="student_contact_persons.communication_pin_code"
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
              <Checkbox
                id="sameAsCommunication"
                checked={isPermanentSameAsCommunication}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor="sameAsCommunication" className="ml-2 text-sm">
                Permanent Address is same as Communication Address
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="student_contact_persons.permanent_address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address Line 1
                      {isFieldRequired(contactPersonsSchema, "permanent_address_line1") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type here"
                        {...field}
                        disabled={isPermanentSameAsCommunication}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="student_contact_persons.permanent_address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type here"
                        {...field}
                        disabled={isPermanentSameAsCommunication}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ApiSearchableSelect
                control={control}
                name="student_contact_persons.permanent_country"
                label="Country"
                placeholder="Select..."
                apiUrl={routes.dropdown.country.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_country")}
                disabled={isPermanentSameAsCommunication}
              />

              <ApiSearchableSelect
                control={control}
                name="student_contact_persons.permanent_state"
                label="State"
                placeholder="Select..."
                apiUrl={routes.dropdown.state.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_state")}
                disabled={
                  isPermanentSameAsCommunication || !watch("student_contact_persons.permanent_country")
                }
                filter={`{"country_id":{"$eq":"${watch("student_contact_persons.permanent_country")}"}}`}
              />

              <ApiSearchableSelect
                control={control}
                name="student_contact_persons.permanent_district"
                label="District"
                placeholder="Select..."
                apiUrl={routes.dropdown.district.get}
                required={isFieldRequired(contactPersonsSchema, "permanent_district")}
                disabled={
                  isPermanentSameAsCommunication || !watch("student_contact_persons.permanent_state")
                }
                filter={`{"state_id":{"$eq":"${watch("student_contact_persons.permanent_state")}"}}`}
              />

              <FormField
                control={control}
                name="student_contact_persons.permanent_pin_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pin Code
                      {isFieldRequired(contactPersonsSchema, "permanent_pin_code") && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type here"
                        {...field}
                        disabled={isPermanentSameAsCommunication}
                      />
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