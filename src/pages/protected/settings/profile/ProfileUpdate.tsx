"use client";

import { CalendarIcon, Camera, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
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
  avatar_pic: z.string().optional(),
  banner_pic: z.string().optional(),
});

export default function ProfileForm() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      bio: "",
      address: "",
      phone_number: "",
      gender: "",
      avatar_pic: "",
      banner_pic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all text fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "date_of_birth") {
          formData.append(key, value as string);
        } else {
          formData.append(
            key,
            value instanceof Date ? value.toISOString() : value
          );
        }
      });

      // Add files if they exist
      if (avatarInputRef.current?.files?.[0]) {
        formData.append("avatar_pic_file", avatarInputRef.current.files[0]);
      }

      if (bannerInputRef.current?.files?.[0]) {
        formData.append("banner_pic_file", bannerInputRef.current.files[0]);
      }

      // Send the POST request
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated", {
        description: "Your profile has been successfully updated."});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error", {
        description: "There was a problem updating your profile."});
    } finally {
      setIsSubmitting(false);
    }
  }

  // const uploadFile = api.post(routes.files.upload)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        form.setValue("avatar_pic", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
        form.setValue("banner_pic", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-background rounded-xl shadow-sm lg:py-8">
      <div className="relative mb-24">
        {/* Banner Section */}
        <div className="relative h-48 md:h-64 bg-muted rounded-t-xl overflow-hidden">
          {bannerPreview ? (
            <img
              src={bannerPreview || "/placeholder.svg"}
              alt="Banner preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300" />
          )}

          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="absolute right-4 bottom-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          >
            <Camera className="h-5 w-5" />
            <span className="sr-only">Change banner</span>
          </button>

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </div>

        {/* Avatar Section */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview || "/placeholder.svg"}
                alt="Avatar preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-200">
                <span className="text-4xl font-semibold text-slate-400">
                  {form.watch("first_name")?.[0]}
                  {form.watch("last_name")?.[0]}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute right-1 bottom-1 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md z-10 border-2 border-background"
          >
            <Pencil className="h-5 w-5" />
            <span className="sr-only">Change avatar</span>
          </button>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile Setup</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your bio will appear on your profile. Max 300 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St, City, Country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="hidden">
              <FormField
                control={form.control}
                name="avatar_pic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner_pic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
