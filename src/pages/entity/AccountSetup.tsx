"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/components/api/fetcher";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { routes } from "@/components/api/route";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod
const formSchema = z
  .object({
    username: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type InviteStatus = "loading" | "valid" | "invalid" | "expired" | "malformed";

// Define JWT payload type
type JwtPayload = {
  email?: string;
  exp?: number;
  [key: string]: any;
};

// Calculate password strength
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;

  // Character type checks
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;

  return strength;
};

// Get strength label and color
const getStrengthInfo = (
  strength: number
): { label: string; color: string } => {
  if (strength === 0) return { label: "None", color: "#94a3b8" };
  if (strength <= 25) return { label: "Weak", color: "#ef4444" };
  if (strength <= 50) return { label: "Fair", color: "#f97316" };
  if (strength <= 75) return { label: "Good", color: "#3b82f6" };
  return { label: "Strong", color: "#22c55e" };
};

export default function AccountSetupPage() {
  // Use window.location for navigation instead of react-router
  const navigate = (path: string) => {
    window.location.href = path;
  };

  // Get token from URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>("loading");
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize the form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Validate the JWT token when the component mounts
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setInviteStatus("invalid");
        setErrorMessage("No invitation token provided");
        return;
      }

      try {
        // Decode the JWT locally to check format
        let payload: JwtPayload;
        try {
          payload = jwtDecode<JwtPayload>(token);
        } catch (e) {
          setInviteStatus("malformed");
          setErrorMessage("The invitation token is not in a valid format");
          return;
        }

        // Check if token is expired based on exp claim
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          setInviteStatus("expired");
          setErrorMessage("This invitation has expired");
          return;
        }

        // Extract email from payload if available
        if (payload.email) {
          setInviteEmail(payload.email);
        }

        setInviteStatus("valid");
      } catch (error) {
        console.error("Error validating token:", error);
        setInviteStatus("invalid");
        setErrorMessage("Failed to validate the invitation token");
      }
    }

    // Simulate token validation after a short delay
    setTimeout(validateToken, 1000);
  }, [token]);

  // Handle Api Call Mutation
  const AccountSetup = api.post(routes.auth.accountSetup);

  // Check the username availability
  const checkUsername: any = api.get(
    routes.auth.checkUsername(form.watch("username")),
    {},
    {},
    {
      enabled: !!form.watch("username") && form.watch("username").length >= 5,
    }
  );

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (inviteStatus !== "valid") {
      toast.error("Invalid invitation", {
        description:
          errorMessage || "This invitation link is invalid or has expired.",
      });
      return;
    }

    try {
      const data = {
        username: values.username,
        password: values.password,
        token,
      };
      AccountSetup.mutate(data, {
        onSuccess(data: any) {
          toast.success(data.detail, {
            description:
              "Your account has been set up successfully. You can now log in.",
          });
          setIsLoading(false);
          // Redirect to login page after successful setup
          setTimeout(() => {
            window.location.href = import.meta.env.VITE_APP_AUTH_URL;
          }, 1000);
        },
        onError(error: any) {
          toast.error("Account setup failed", {
            description:
              error instanceof Error
                ? error.message
                : "There was a problem setting up your account. Please try again.",
          });
          setIsLoading(false);
        },
      });
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "There was a problem setting up your account. Please try again.",
      });
      setIsLoading(false);
    }
  }

  // Render different content based on invite status
  if (inviteStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Validating Invitation</CardTitle>
            <CardDescription>
              Please wait while we validate your invitation...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    inviteStatus === "invalid" ||
    inviteStatus === "expired" ||
    inviteStatus === "malformed"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              {inviteStatus === "invalid" && "Invalid Invitation"}
              {inviteStatus === "expired" && "Expired Invitation"}
              {inviteStatus === "malformed" && "Invalid Token Format"}
            </CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please contact your administrator to request a new invitation
                link.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="mb-4 flex flex-col items-center justify-center  gap-2">
          <div className="h-10 w-10">
            <img src="/logo-dark.svg" alt="Logo" className="h-full w-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Account Setup</h1>
        </div>
        <Card className="w-full max-w-md">
          <CardContent>
            {inviteEmail && (
              <Alert className="mb-6" variant={"success"}>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Valid Invitation</AlertTitle>
                <AlertDescription>
                  <strong>{inviteEmail}</strong>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>
                        {checkUsername.data ? (
                          <span
                            style={{
                              color: checkUsername.data?.status
                                ? "green"
                                : "red",
                            }}
                          >
                            {checkUsername.data?.detail}
                          </span>
                        ) : (
                          "Choose a username for your account."
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const strength = calculatePasswordStrength(field.value);
                    const { label, color } = getStrengthInfo(strength);

                    // Check individual password requirements
                    const hasLength = field.value.length >= 8;
                    const hasUppercase = /[A-Z]/.test(field.value);
                    const hasLowercase = /[a-z]/.test(field.value);
                    const hasNumber = /[0-9]/.test(field.value);
                    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(
                      field.value
                    );

                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Password strength:
                            </span>
                            <span
                              className="text-xs font-medium"
                              style={{ color }}
                            >
                              {label}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${strength}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <div className="flex justify-between">
                            {[25, 50, 75, 100].map((segment, i) => (
                              <motion.div
                                key={i}
                                className="h-1 w-1 rounded-full"
                                initial={{ opacity: 0.3 }}
                                animate={{
                                  opacity: strength >= segment ? 1 : 0.3,
                                  scale: strength >= segment ? 1.2 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  backgroundColor:
                                    strength >= segment ? color : "#94a3b8",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-xs">
                          <p className="font-medium">Password requirements:</p>
                          <div className="grid grid-cols-1 gap-1">
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  color: hasLength ? "#22c55e" : "inherit",
                                }}
                              >
                                {hasLength ? "✓" : "○"} At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  color: hasUppercase ? "#22c55e" : "inherit",
                                }}
                              >
                                {hasUppercase ? "✓" : "○"} At least one
                                uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  color: hasLowercase ? "#22c55e" : "inherit",
                                }}
                              >
                                {hasLowercase ? "✓" : "○"} At least one
                                lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  color: hasNumber ? "#22c55e" : "inherit",
                                }}
                              >
                                {hasNumber ? "✓" : "○"} At least one number
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  color: hasSymbol ? "#22c55e" : "inherit",
                                }}
                              >
                                {hasSymbol ? "✓" : "○"} At least one symbol
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="confirm password"
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    !form.formState.isValid ||
                    checkUsername.data?.status === false ||
                    !(
                      form.watch("password").length >= 8 &&
                      /[A-Z]/.test(form.watch("password")) &&
                      /[a-z]/.test(form.watch("password")) &&
                      /[0-9]/.test(form.watch("password")) &&
                      /[!@#$%^&*(),.?":{}|<>]/.test(form.watch("password"))
                    )
                  }
                >
                  {isLoading ? "Setting up account..." : "Complete Setup"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
