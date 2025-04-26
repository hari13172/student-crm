"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/custom-ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/components/api/fetcher";
import { cn } from "@/lib/utils";
import moment from "moment"
import { motion } from "framer-motion";
import { routes } from "@/components/api/route";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  first_name: z.string().min(3, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be at least 2 characters.",
  }),
  bio: z.string().max(300, {
    message: "Bio must not exceed 300 characters.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  phone_number: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  date_of_birth: z.date({
    required_error: "Please select a date of birth.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormValues>>({});
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      bio: "",
      address: "",
      phone_number: "",
      gender: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = form;

  // Api mutaion to save the form data
  const profileSetup = api.post(routes.auth.profileSetup);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    profileSetup.mutate(data, {
      onSuccess: (data: any) => {
        toast.success(data.detail, {
          description: `${new Date().toLocaleTimeString()}`,
        });
        // Redirect to the dashboard or another page
        queryClient.invalidateQueries({ queryKey: [routes.auth.me] });
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message || "Profile setup failed", {
          description: `${new Date().toLocaleTimeString()}`,
        });
      },
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["first_name", "last_name"];
        break;
      case 2:
        fieldsToValidate = ["phone_number", "address"];
        break;
      case 3:
        fieldsToValidate = ["bio", "date_of_birth", "gender"];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      // Save current step data
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          fieldsToValidate.map((field) => [field, watch(field)])
        ),
      }));

      if (step < 4) {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Step icons and titles
  const stepInfo = [
    { icon: <UserIcon className="h-5 w-5" />, title: "Personal" },
    { icon: <PhoneIcon className="h-5 w-5" />, title: "Contact" },
    { icon: <InfoIcon className="h-5 w-5" />, title: "Additional" },
    { icon: <CheckIcon className="h-5 w-5" />, title: "Review" },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="Enter your first name"
                {...register("first_name")}
                className="focus-visible:ring-primary"
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Enter your last name"
                {...register("last_name")}
                className="focus-visible:ring-primary"
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="Enter your phone number"
                {...register("phone_number")}
                className="focus-visible:ring-primary"
              />
              {errors.phone_number && (
                <p className="text-sm text-destructive">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                {...register("address")}
                className="focus-visible:ring-primary"
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="min-h-[80px] focus-visible:ring-primary"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 w-full">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <DatePicker
                  date={watch("date_of_birth")}
                  onDateChange={(date) =>
                    date && setValue("date_of_birth", date)
                  }
                  placeholder="Select your DOB"
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-destructive">
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 w-full">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  defaultValue={watch("gender")}
                >
                  <SelectTrigger className="w-full focus-visible:ring-primary">
                    <SelectValue
                      className="w-full"
                      placeholder="Select your gender"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        // Review step
        const allFormData = {
          ...formData,
          ...Object.fromEntries(
            Object.keys(formSchema.shape).map((key) => [
              key,
              watch(key as keyof FormValues),
            ])
          ),
        };

        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <p className="text-sm text-muted-foreground">
                Please review your information before submitting.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-muted/40 shadow-sm gap-2">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 pt-2 text-sm">
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      First Name
                    </h4>
                    <p className="capitalize">{allFormData.first_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Last Name
                    </h4>
                    <p>{allFormData.last_name}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted/40 shadow-sm gap-2">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 pt-2 text-sm">
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Phone Number
                    </h4>
                    <p>{allFormData.phone_number}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Address
                    </h4>
                    <p className="capitalize">{allFormData.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted/40 shadow-sm gap-2">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 text-sm">
                  <div className="mb-3">
                    <h4 className="font-medium text-muted-foreground">Bio</h4>
                    <p className="whitespace-pre-wrap">{allFormData.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-medium text-muted-foreground">
                        Date of Birth
                      </h4>
                      <p>
                        {allFormData.date_of_birth
                          ? `${moment(allFormData.date_of_birth).format("MMM Do YYYY")} (${moment(allFormData.date_of_birth).fromNow()})`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">
                        Gender
                      </h4>
                      <p className="capitalize">{allFormData.gender}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate progress percentage based on current step
  const progressPercentage = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-3xl p-4">
        <div className="mb-6 flex flex-col items-center justify-center  gap-2">
          <div className="h-10 w-10">
            <img src="/logo-dark.svg" alt="Logo" className="h-full w-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Setup</h1>
          <p className="text-muted-foreground">
            Complete your profile in a few simple steps
          </p>
        </div>

        <Card className="border-muted/40 shadow-md gap-4">
          <CardHeader>
            <CardTitle>
              {step === 4
                ? "Review Your Profile"
                : `Step ${step}: ${stepInfo[step - 1].title} Information`}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's start with your basic information"}
              {step === 2 && "How can we reach you?"}
              {step === 3 && "Tell us more about yourself"}
              {step === 4 &&
                "Make sure everything is correct before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {/* Stepper indicator */}
            <div className="relative">
              {/* Animated progress line - positioned behind and centered */}
              <div
                className="absolute top-[27%] md:top-1/3 left-0 right-0 -translate-y-1/2 h-0.5 w-[85%] md:w-[90%] mx-auto bg-muted"
                style={{ zIndex: 0 }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary origin-left rounded-full"
                  initial={{ width: `${((step - 1) / 3) * 100}%` }}
                  animate={{
                    width: `${progressPercentage}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                />
              </div>

              <div
                className="flex justify-between relative px-4"
                style={{ zIndex: 1 }}
              >
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={cn(
                      "flex flex-col items-center",
                      stepNumber < step
                        ? "text-primary"
                        : stepNumber === step
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full border-2 bg-background shadow-sm transition-all duration-200",
                        stepNumber < step
                          ? "border-primary bg-primary text-primary-foreground"
                          : stepNumber === step
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-muted"
                      )}
                    >
                      {stepNumber < step ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        stepInfo[stepNumber - 1].icon
                      )}
                    </div>
                    <span className="mt-2 font-medium text-xs">
                      {stepInfo[stepNumber - 1].title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mt-4 bg-muted" />

            <div className="p-4">
              <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>
            </div>
          </CardContent>

          <Separator className="bg-muted m-0" />

          {/* Navigation buttons */}
          <CardFooter className="flex justify-between m-0 px-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="w-28"
            >
              <ChevronLeftIcon />
              Previous
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="w-28">
                Next
                <ChevronRightIcon />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-28 bg-green-600 hover:bg-green-700"
              >
                Complete
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
