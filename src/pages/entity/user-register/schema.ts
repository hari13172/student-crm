import { z } from "zod"

// Student Information Schema
export const studentSchema = z.object({
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  registration_number: z.string().optional(),
  aadhar_number: z
    .string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  college: z.string().optional(),
  degree: z.string().optional(),
  department: z.string().optional(),
  year_of_passing: z.string().optional(),
});



// Contact Persons Schema (for address details)
export const contactPersonsSchema = z.object({
  communication_address_line1: z.string().optional(),
  communication_address_line2: z.string().optional(),
  communication_district: z.string().optional(),
  communication_state: z.string().optional(),
  communication_country: z.string().optional(),
  communication_pin_code: z.string().optional(),
  permanent_address_line1: z.string().optional(),
  permanent_address_line2: z.string().optional(),
  permanent_district: z.string().optional(),
  permanent_state: z.string().optional(),
  permanent_country: z.string().optional(),
  permanent_pin_code: z.string().optional(),
});


// Student Size Schema
// Student Size Schema
export const studentSizeSchema = z.object({
  education_levels: z.array(
    z.object({
      level: z.enum(["class_10", "class_12", "diploma", "graduation", "post_graduation"]),
      year_of_passing: z.string().optional(),
      percentage_or_cgpa: z.string().optional(),
      school_institution: z.string().optional(),
      board_university: z.string().optional(),
      education_type: z.enum(["full_time", "part_time"]).default("full_time"),
      marksheet: z.any().optional(), // File upload handled by FileUploadField
      // Class 10th specific fields
      class_10_total_mark: z.string().optional(),
      // Class 12th specific fields
      group: z.string().optional(),
      // Diploma-specific fields
      department: z.string().optional(),
      percentage_in_diploma: z.string().optional(),
      // Graduation/Post Graduation-specific fields
      program_degree: z.string().optional(),
      branch: z.string().optional(),
      history_of_arrear: z.string().optional(),
      current_arrear: z.string().optional(),
    })
  ).min(1, "At least one education level is required"),
  has_post_graduation: z.enum(["yes", "no"]).default("no"),
});

// Student Documents Schema
export const studentDocumentsSchema = z.object({
  accreditation_certificate: z.string().min(1, "Accreditation certificate is required").optional(),
  affiliation_certificate: z.string().min(1, "Affiliation certificate is required").optional(),
  proof_of_address: z.string().min(1, "Proof of address is required").optional(),
  logo: z.string().min(1, "Student logo is required").optional(),
})





// Experience Skill Schema
export const experienceSkillSchema = z.object({
  experience: z
    .array(
      z.object({
        has_experience: z
          .enum(["yes", "no"])
          .refine((val) => val !== undefined, {
            message: "Please select an option",
          }),
        field_of_experience: z.string().optional(),
        total_years: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        tools_used: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  internship: z
    .array(
      z.object({
        company_name: z.string().optional(),
        duration_days: z
          .string()
          .optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  skill: z
    .object({
      technical_skill: z.string(),
      proficiency: z.string(),
    })
    .optional(),
  language: z
    .array(
      z.object({
        language_known: z.string().optional(),
        read: z.boolean().optional(),
        write: z.boolean().optional(),
        speak: z.boolean().optional(),
      })
    )
    .optional(),
});

// Photos and Signature Schema
export const photosSignatureSchema = z.object({
  photo: z.string().optional(),
  signature: z.string().optional(),
});

// Terms and Conditions Schema
export const termsAndConditionsSchema = z.object({
  accept: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

// Complete Registration Schema
export const studentRegistrationSchema = z.object({
  student: studentSchema,
  student_contact_persons: contactPersonsSchema,
  student_size: studentSizeSchema,
  student_documents: studentDocumentsSchema,
  student_experience_skill: experienceSkillSchema, // New field
  student_photos_signature: photosSignatureSchema, // New field
  student_terms_and_conditions: termsAndConditionsSchema,
})
