"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { StudentInfoForm } from "./steps/student-info-form";
import { StudentSizeForm } from "./steps/student-size-form";
import { ContactPersonsForm } from "./steps/contact-persons-form";
import { ExperienceSkillForm } from "./steps/student-experience";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { PhotosSignatureForm } from "./steps/student-signature";
import { TermsAndConditionsForm } from "./steps/terms-and-conditions-form";
import { api } from "@/components/api/fetcher";
import { studentRegistrationSchema } from "./schema";
import { motion } from "motion/react";
import { routes } from "@/components/api/route";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof studentRegistrationSchema>;

// const steps = [
//   { id: 0, label: "Student Information" },
//   { id: 1, label: "Student Persons" },
//   { id: 2, label: "Student Size" },
//   { id: 3, label: "Documents" },
//   { id: 4, label: "Service Requirements" },
//   { id: 5, label: "Terms & Conditions" },
// ];

const steps = [
  { id: 0, label: "Student Information" },
  { id: 1, label: "Student Persons" },
  { id: 2, label: "Student Size" },
  { id: 3, label: "Experience/Skill/Internship/Language" },
  { id: 4, label: "Photos and Signature" },
  { id: 5, label: "Terms & Conditions" },
];

export function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      student: {
        first_name: "",
        middle_name: "",
        last_name: "",
        registration_number: "",
        aadhar_number: "",
        father_name: "",
        mother_name: "",
        religion: "",
        caste: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        college: "",
        degree: "",
        department: "",
        year_of_passing: "",
      },
      student_contact_persons: {
        communication_address_line1: "",
        communication_address_line2: "",
        communication_district: "",
        communication_state: "",
        communication_country: "",
        communication_pin_code: "",
        permanent_address_line1: "",
        permanent_address_line2: "",
        permanent_district: "",
        permanent_state: "",
        permanent_country: "",
        permanent_pin_code: "",
      },
      student_size: {
        education_levels: [
          {
            level: "class_10",
            year_of_passing: "",
            class_10_total_mark: "",
            percentage_or_cgpa: "",
            school_institution: "",
            board_university: "",
            education_type: "full_time",
            marksheet: null,
          },
          // Placeholder for Class 12th or Diploma
          {
            level: "class_12", // Default to Class 12th, will be updated based on user selection
            year_of_passing: "",
            percentage_or_cgpa: "",
            group: "",
            school_institution: "",
            board_university: "",
            education_type: "full_time",
            marksheet: null,
          },
          {
            level: "graduation",
            year_of_passing: "",
            percentage_or_cgpa: "",
            program_degree: "",
            branch: "",
            school_institution: "",
            board_university: "",
            history_of_arrear: "",
            current_arrear: "",
            education_type: "full_time",
            marksheet: null,
          },
          {
            level: "post_graduation",
            year_of_passing: "",
            percentage_or_cgpa: "",
            program_degree: "",
            branch: "",
            school_institution: "",
            board_university: "",
            history_of_arrear: "",
            current_arrear: "",
            education_type: "full_time",
            marksheet: null,
          },
        ],
        has_post_graduation: "no",
      },
      student_documents: {
        accreditation_certificate: "",
        affiliation_certificate: "",
        proof_of_address: "",
        logo: "",
      },
      student_experience_skill: {
        experience: [{ has_experience: "no" }],
        internship: [{ company_name: "", duration_days: "" }],
        skill: { technical_skill: "", proficiency: "" },
        language: [{ language_known: "", read: false, write: false, speak: false }],
      },
      student_photos_signature: {
        photo: "",
        signature: "",
      },
      student_terms_and_conditions: {
        accept: false,
      },
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const result = await form.trigger(fieldsToValidate as any);

    if (result) {
      console.log("Step", currentStep, "is valid");
      if (currentStep < steps.length - 1) {
        console.log("Moving to next step");
        setCompletedSteps((prev) =>
          prev.includes(currentStep) ? prev : [...prev, currentStep]
        ); // Mark current step as completed
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        await handleSubmit();
        console.log("Submitting form");
      }
    } else {
      console.log("Step--> else", currentStep, "is invalid");
      console.log(result);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsToValidate = (step: number) => {
    switch (step) {
      case 0:
        return ["student"];
      case 1:
        return ["student_contact_persons"];
      case 2:
        return ["student_size"];
      case 3:
        return ["student_experience_skill"]; // Updated for new step
      case 4:
        return ["student_photos_signature"];
      case 5:
        return ["student_terms_and_conditions"];
      default:
        return [];
    }
  };
  const CollegePost = api.post(routes.colleges.add_entity);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // Get all form data
      const formData = form.getValues();
      const { student, ...payload } = formData;
      const payloadData = {
        ...student,
        ...payload,
      };
      // Submit to your API
      console.log("Form submitted:", payloadData);
      CollegePost.mutate(payloadData, {
        onSuccess: (data: any) => {
          toast.success(data.detail || "Form submitted successfully", {
            description: `${new Date().toLocaleTimeString()}`,
          });
          window.location.href = "/dashboard"
        },
        onError: (error) => {
          toast.error(error.message, {
            description: `${error?.message || "Please try again later."}`,
          });
        },
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (index: number, event: React.MouseEvent) => {
    console.log(event);
    setCurrentStep(index);
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StudentInfoForm />;
      case 1:
        return <ContactPersonsForm />;
      case 2:
        return <StudentSizeForm />;
      case 3:
        return <ExperienceSkillForm />;
      case 4:
        return <PhotosSignatureForm />;
      case 5:
        return <TermsAndConditionsForm />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row">
        <div className="bg-primary md:p-4 text-white md:w-60 lg:w-75 sticky top-0 md:h-screen">
          <h2 className="hidden md:block text-2xl mb-4 font-bold text-white drop-shadow-sm">
            Registration
          </h2>
          <Separator className="hidden md:block" />
          {/* vertical stepper line */}
          <div className="hidden md:block mt-8 space-y-4 relative">
            <div
              className="absolute top-[8%] left-[26px] h-[85%] w-1 mx-auto bg-secondary/30"
              style={{ zIndex: 0 }}
            >
              <motion.div
                className="absolute top-0 left-0 w-1 bg-secondary origin-top rounded-full"
                initial={{ height: 0 }}
                animate={{
                  height: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              />
            </div>
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = completedSteps.includes(index);
              const isClickable =
                isCompleted || index <= Math.max(...completedSteps, 0);

              return (
                <div key={index} className="relative">
                  <div
                    className={`
                            relative flex items-center rounded-lg p-3 transition-all duration-200
                            ${isActive ? "bg-white/10 shadow-inner" : ""}
                            ${isClickable
                        ? "cursor-pointer hover:bg-white/5"
                        : "cursor-not-allowed"
                      }
                          `}
                    onClick={(e) => isClickable && handleStepClick(index, e)}
                    role="button"
                    tabIndex={isClickable ? 0 : -1}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {/* Step indicator */}
                    <div
                      className={`
                              flex items-center justify-center w-8 h-8 rounded-full mr-3 z-10
                              ${isCompleted
                          ? "bg-emerald-500 text-white ring-2"
                          : isActive
                            ? "bg-white text-primary ring-2 ring-white/30"
                            : "bg-white/80 text-primary font-extrabold"
                        }
                            `}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`
                                text-sm font-medium truncate
                                ${isCompleted
                            ? "text-white"
                            : isActive
                              ? "text-white"
                              : "text-white/80"
                          }
                              `}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* horizontal stepper line */}
          <div className="flex justify-center items-center relative w-full overflow-hidden py-4  md:hidden">
            <div className="relative flex justify-between items-center w-full mx-6">
              <div
                className="absolute top-1/2 -translate-y-1/2 left-0 w-[100%] h-1 mx-auto bg-secondary/30"
                style={{ zIndex: 0 }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-secondary origin-top rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                />
              </div>
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);
                const isClickable =
                  isCompleted || index <= Math.max(...completedSteps, 0);

                return (
                  <div key={index} className="relative">
                    <div
                      className={`
                            relative flex items-center justify-center rounded-lg transition-all duration-200
                            ${isClickable
                          ? "cursor-pointer hover:bg-white/5"
                          : "cursor-not-allowed"
                        }
                          `}
                      onClick={(e) => isClickable && handleStepClick(index, e)}
                      role="button"
                      tabIndex={isClickable ? 0 : -1}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {/* Step indicator */}
                      <div
                        className={`
                              flex items-center justify-center w-8 h-8 rounded-full z-10
                              ${isCompleted
                            ? "bg-emerald-500 text-white ring-2"
                            : isActive
                              ? "bg-white text-primary ring-2 ring-white/30"
                              : "bg-white/80 text-primary font-extrabold"
                          }
                            `}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">
                            {step.id + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div>
            <div className="border-b py-2 px-2 md:px-8 md:sticky md:top-0 bg-white z-50">
              <h3 className="text-sm font-bold text-primary">
                STEP - {currentStep + 1} / {steps.length}
              </h3>
              <h2 className="hidden md:block text-2xl font-bold text-gray-800">
                {steps[currentStep].label}
              </h2>
            </div>
            <div className="container p-2 md:py-4 md:px-6 mx-auto">
              <Form {...form}>
                <form>
                  {renderStep()}
                  <div className="flex justify-between my-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0 || isSubmitting}
                    >
                      Previous
                    </Button>

                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isSubmitting}
                    >
                      {currentStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
