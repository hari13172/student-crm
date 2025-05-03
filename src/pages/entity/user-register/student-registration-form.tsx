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
import { generatePayload, studentRegistrationSchema } from "./schema";
import { motion } from "motion/react";
import { routes } from "@/components/api/route";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Router, useNavigate } from "react-router";

type FormData = z.infer<typeof studentRegistrationSchema>;



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
  const navigate = useNavigate();


  const { data } = api.get<any>(routes.students.form.get);
  // console.log("Form data", data);


  const form = useForm<FormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      college_id: data?.form_data?.college_id,
      student: {
        first_name: "",
        middle_name: "",
        last_name: "",
        registration_number: "",
        aadhar_number: "",
        father_name: "",
        mother_name: "",
        religion: { id: "", value: "" },
        caste: { id: "", value: "" },
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        college: { id: "", value: "" },
        degree: { id: "", value: "" },
        department: { id: "", value: "" },
        year_of_passing: { id: "", value: undefined },
      },
      student_contact_persons: {
        communication_address_line1: "",
        communication_address_line2: "",
        communication_district: { id: "", value: "" },
        communication_state: { id: "", value: "" },
        communication_country: { id: "", value: "" },
        communication_pin_code: "",
        permanent_address_line1: "",
        permanent_address_line2: "",
        permanent_district: { id: "", value: "" },
        permanent_state: { id: "", value: "" },
        permanent_country: { id: "", value: "" },
        permanent_pin_code: "",
      },
      student_size: {
        education_details: {
          class10_year: 0,
          class10_marks: 0,
          class10_percentage: 0,
          class10_school: "",
          class10_board: undefined,
          class10_education_type: undefined,
          class10_marksheet_path: "",
          class12_studied: undefined,
          class12_year: 0,
          class12_marks: 0,
          class12_percentage: 0,
          class12_group: "",
          class12_school: "",
          class12_board: undefined,
          class12_education_type: undefined,
          class12_marksheet_path: "",
          diploma_studied: undefined,
          diploma_year: 0,
          diploma_percentage: 0,
          diploma_department: "",
          diploma_college: "",
          diploma_board: undefined,
          diploma_education_type: undefined,
          diploma_marksheet_path: "",
          ug_year: 0,
          ug_percentage_cgpa: 0,
          ug_program: "",
          ug_branch: "",
          ug_college: "",
          ug_university: "",
          ug_arrear_history: "",
          ug_current_arrear: "",
          ug_education_type: undefined,
          ug_marksheet_path: "",
          pg_studied: undefined,
          pg_year: 0,
          pg_percentage: 0,
          pg_program: "",
          pg_branch: "",
          pg_college: "",
          pg_university: "",
          pg_arrear_history: "",
          pg_current_arrear: "",
          pg_education_type: undefined,
          pg_marksheet_path: "",
        },
      },
      student_experience_skill: {
        experiences: [

        ],
        internships: [

        ],
        skills: [
        ],
        languages: [

        ],
      },
      student_photos_signature: {
        photo: "",
        signature: "",
      },
      student_terms_and_conditions: {
        accept: undefined,
      },
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.form_data) {
      form.setValue("college_id", data.form_data.college_id);
      form.setValue("student", {
        first_name: data.form_data.first_name || "",
        middle_name: data.form_data.middle_name || "",
        last_name: data.form_data.last_name || "",
        registration_number: data.form_data.registration_number || "",
        aadhar_number: data.form_data.aadhar_number || "",
        father_name: data.form_data.father_name || "",
        mother_name: data.form_data.mother_name || "",
        religion: { id: data.form_data.religion, value: data.form_data.religion || "" },
        caste: { id: data.form_data.caste.id, value: data.form_data.caste || "" },
        email: data.form_data.email || "",
        phone_number: data.form_data.phone_number || "",
        date_of_birth: data.form_data.date_of_birth || "",
        gender: data.form_data.gender || "",
        college: { id: data.form_data.college_id || "", value: "" },
        degree: { id: data.form_data.degree_id || "", value: "" },
        department: { id: data.form_data.department_id || "", value: "" },
        year_of_passing: { id: data.form_data.batch_id, value: data.form_data.batch_id || undefined },
      });
      form.setValue("student_contact_persons", {
        communication_address_line1: data.form_data.contact_details.comm_address_line1 || "",
        communication_address_line2: data.form_data.contact_details.comm_address_line2 || "",
        communication_district: { id: data.form_data.contact_details.comm_district, value: data.form_data.contact_details.comm_district || "" },
        communication_state: { id: data.form_data.contact_details.comm_state, value: data.form_data.contact_details.comm_state || "" },
        communication_country: { id: data.form_data.contact_details.comm_country, value: data.form_data.contact_details.comm_country || "" },
        communication_pin_code: data.form_data.contact_details.comm_pin_code || "",
        permanent_address_line1: data.form_data.contact_details.perm_address_line1 || "",
        permanent_address_line2: data.form_data.contact_details.perm_address_line2 || "",
        permanent_district: { id: "", value: data.form_data.contact_details.perm_district || "" },
        permanent_state: { id: "", value: data.form_data.contact_details.perm_state || "" },
        permanent_country: { id: "", value: data.form_data.contact_details.perm_country || "" },
        permanent_pin_code: data.form_data.contact_details.perm_pin_code || "",
      });
      form.setValue("student_size", {
        education_details: {
          class10_year: parseInt(data.form_data.education_details.class10_year) || 0,
          class10_marks: data.form_data.education_details.class10_marks || 0,
          class10_percentage: data.form_data.education_details.class10_percentage || 0,
          class10_school: data.form_data.education_details.class10_school || "",
          class10_board: data.form_data.education_details.class10_board || "",
          class10_education_type: data.form_data.education_details.class10_education_type || "",
          class10_marksheet_path: data.form_data.education_details.class10_marksheet_path || "",
          class12_studied: data.form_data.education_details.class12_studied || undefined,

          class12_year: parseInt(data.form_data.education_details.class12_year) || 0,
          class12_marks: data.form_data.education_details.class12_marks || 0,
          class12_percentage: data.form_data.education_details.class12_percentage || 0,
          class12_group: data.form_data.education_details.class12_group || "",
          class12_school: data.form_data.education_details.class12_school || "",
          class12_board: data.form_data.education_details.class12_board || "",
          class12_education_type: data.form_data.education_details.class12_education_type || "",
          class12_marksheet_path: data.form_data.education_details.class12_marksheet_path || "",
          diploma_studied: data.form_data.education_details.diploma_studied || undefined,
          diploma_year: parseInt(data.form_data.education_details.diploma_year) || 0,
          diploma_percentage: data.form_data.education_details.diploma_percentage || 0,
          diploma_department: data.form_data.education_details.diploma_department || "",
          diploma_college: data.form_data.education_details.diploma_college || "",
          diploma_board: data.form_data.education_details.diploma_board || "",
          diploma_education_type: data.form_data.education_details.diploma_education_type || "",
          diploma_marksheet_path: data.form_data.education_details.diploma_marksheet_path || "",

          ug_year: parseInt(data.form_data.education_details.ug_year) || 0,
          ug_percentage_cgpa: data.form_data.education_details.ug_percentage_cgpa || 0,
          ug_program: data.form_data.education_details.ug_program || "",
          ug_branch: data.form_data.education_details.ug_branch || "",
          ug_college: data.form_data.education_details.ug_college || "",
          ug_university: data.form_data.education_details.ug_university || "",
          ug_arrear_history: data.form_data.education_details.ug_arrear_history || "",
          ug_current_arrear: data.form_data.education_details.ug_current_arrear || "",
          ug_education_type: data.form_data.education_details.ug_education_type || "",
          ug_marksheet_path: data.form_data.education_details.ug_marksheet_path || "",


          pg_studied: data.form_data.education_details.pg_studied || "",
          pg_year: parseInt(data.form_data.education_details.pg_year) || 0,
          pg_percentage: data.form_data.education_details.pg_percentage || 0,
          pg_program: data.form_data.education_details.pg_program || "",
          pg_branch: data.form_data.education_details.pg_branch || "",
          pg_college: data.form_data.education_details.pg_college || "",
          pg_university: data.form_data.education_details.pg_university || "",
          pg_arrear_history: data.form_data.education_details.pg_arrear_history || "",
          pg_current_arrear: data.form_data.education_details.pg_current_arrear || "",
          pg_education_type: data.form_data.education_details.pg_education_type || undefined,
          pg_marksheet_path: data.form_data.education_details.pg_marksheet_path || "",
        },
      });
      form.setValue("student_experience_skill", {
        experiences: data.form_data.experiences || [],
        internships: data.form_data.internships || [],
        skills: data.form_data.skills || [],
        languages: data.form_data.languages || [],
      });
      form.setValue("student_photos_signature", {
        photo: data.form_data.photos_signature.photo || "",
        signature: data.form_data.photos_signature.signature || "",
      });
      form.setValue("student_terms_and_conditions", {
        accept: data.form_data.student_terms_and_conditions.accept || undefined,
      });
      setCurrentStep(data.step == 5 ? 5 : data.step + 1);
      if (data.step >= 0) {
        setCompletedSteps(Array.from({ length: data.step == 5 ? 5 : data.step + 1 }, (_, i) => i));
      }
    }
  }, [data]);


  console.log(data)


  const response = api.put(`${routes.students.form.put}?step=${currentStep}`);
  const saveStepData = async (formData: FormData) => {
    try {
      const payloadData = generatePayload(formData);
      response.mutate(payloadData, {
        onSuccess: () => {
          console.log("Step data saved successfully");
          toast.success("Step data saved successfully");
        },
        onError: (error: any) => {
          console.error("Error saving step data:", error);
          toast.error(
            `Failed to save step data: ${error?.message || "Unknown error"}`
          );
        },
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error saving step data:", error);
      return {
        success: false,
        error: error?.message || "Failed to save step data",
      };
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const result = await form.trigger(fieldsToValidate as any);

    if (result) {
      console.log("Step", currentStep, "is valid");

      // Save the current step's data
      const formData = form.getValues();
      const saveResult = await saveStepData(formData);

      if (!saveResult.success) {
        toast.error(`Failed to save step data: ${saveResult.error}`);
        return;
      }

      if (currentStep < steps.length - 1) {
        console.log("Moving to next step");
        setCompletedSteps((prev) =>
          prev.includes(currentStep) ? prev : [...prev, currentStep]
        );
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        await handleSubmit();
        console.log("Submitting form");
      }
    } else {
      console.log("Step", currentStep, "is invalid");
      console.log(form.formState.errors);
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


  const StudentPost = api.post(routes.students.add_entity);

  const handleSubmit = async () => {
    console.log(form.formState.errors);
    const isValid = await form.trigger();
    if (!isValid) return;
    console.log("Form is valid, submitting...");

    setIsSubmitting(true);
    try {
      // Get all form data
      const formData = form.getValues();

      const payloadData = generatePayload(formData);

      toast.promise(
        StudentPost.mutateAsync(payloadData), // Assuming `mutateAsync` is available and returns a promise
        {
          loading: "Submitting form...",
          success: (data: any) => {
            form.reset();
            setCurrentStep(0);
            setCompletedSteps([]);
            navigate("/");
            return `${data.detail || "Form submitted successfully"
              } - ${new Date().toLocaleTimeString()}`;
          },
          error: (error: any) =>
            `${error?.message || "Please try again later."
            } - ${new Date().toLocaleTimeString()}`,
        }
      );

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
                {steps[currentStep]?.label || "Invalid Step"}
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
