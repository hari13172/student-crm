"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";

export function TermsAndConditionsForm() {
  const form = useFormContext();

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Terms and Conditions</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Please read and accept our terms and conditions to complete your
            registration.
          </p>

          <Separator />

          <Card className="border border-muted">
            <CardContent className="p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-medium mb-2">Terms of Service</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: April 14, 2025
              </p>
              <div className="space-y-4 text-sm">
                <p>
                  Welcome to our College Registration Platform. By registering
                  your college, you agree to comply with and be bound by the
                  following terms and conditions.
                </p>
                <p>
                  <strong>1. Registration Information</strong>
                  <br />
                  You agree to provide accurate, current, and complete
                  information during the registration process and to update such
                  information to keep it accurate, current, and complete.
                </p>
                <p>
                  <strong>2. Data Privacy</strong>
                  <br />
                  We respect your privacy and are committed to protecting it.
                  The information you provide will be used to process your
                  registration and provide you with the services you request.
                </p>
                <p>
                  <strong>3. Document Verification</strong>
                  <br />
                  All documents submitted during registration are subject to
                  verification. We reserve the right to reject any registration
                  if the documents are found to be invalid or fraudulent.
                </p>
                <p>
                  <strong>4. Service Delivery</strong>
                  <br />
                  We will make reasonable efforts to provide the services as
                  requested, but we cannot guarantee that all services will be
                  available at all times or in all locations.
                </p>
                <p>
                  <strong>5. Intellectual Property</strong>
                  <br />
                  All content, including but not limited to text, graphics,
                  logos, and software, is the property of our company and is
                  protected by copyright and other intellectual property laws.
                </p>
                <p>
                  <strong>6. Limitation of Liability</strong>
                  <br />
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use our services.
                </p>
                <p>
                  <strong>7. Termination</strong>
                  <br />
                  We reserve the right to terminate or suspend your account and
                  access to our services at our sole discretion, without notice,
                  for conduct that we believe violates these terms or is harmful
                  to other users, us, or third parties, or for any other reason.
                </p>
                <p>
                  <strong>8. Changes to Terms</strong>
                  <br />
                  We reserve the right to modify these terms at any time. Your
                  continued use of our services after such changes constitutes
                  your acceptance of the new terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="student_terms_and_conditions.accept"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the terms and conditions*
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By checking this box, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
