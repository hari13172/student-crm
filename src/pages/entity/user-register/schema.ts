import { Form } from "react-router";
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
  religion: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  caste:  z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  college:  z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  degree:  z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  department:  z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  year_of_passing:  z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
});




// Contact Persons Schema (for address details)
export const contactPersonsSchema = z.object({
  communication_address_line1: z.string().optional(),
  communication_address_line2: z.string().optional(),
  communication_district: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  communication_state: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  communication_country: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  communication_pin_code: z.string().optional(),
  permanent_address_line1: z.string().optional(),
  permanent_address_line2: z.string().optional(),
  permanent_district: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  permanent_state: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  permanent_country: z.object({
    id: z.string(),
    value: z.string(),
  }).optional(),
  permanent_pin_code: z.string().optional(),
});


export const studentSizeSchema = z.object({
  education_details: z.object({
    // Class 10
    class10_year: z.number().optional(),
    class10_marks: z.number().optional(),
    class10_percentage: z.number().optional(),
    class10_school: z.string().optional(),
    class10_board: z.enum(["CBSE", "ICSE", "State", "Other"]).default("CBSE"),
    class10_education_type: z.enum(["FullTime", "PartTime"]).default("FullTime"),
    class10_marksheet_path: z.string().optional(),

    // Class 12
    class12_studied: z.boolean().default(false),
    class12_year: z.number().optional(),
    class12_marks: z.number().optional(),
    class12_percentage: z.number().optional(),
    class12_group: z.string().optional(), // UUID or string ID
    class12_school: z.string().optional(),
    class12_board: z.enum(["CBSE", "ICSE", "State", "Other"]).default("CBSE"),
    class12_education_type: z.enum(["FullTime", "PartTime"]).default("FullTime"),
    class12_marksheet_path: z.string().optional(),

    // Diploma
    diploma_studied: z.boolean().default(false),
    diploma_year: z.number().optional(),
    diploma_percentage: z.number().optional(),
    diploma_department: z.string().optional(), // UUID or string ID
    diploma_college: z.string().optional(),
    diploma_board: z.enum(["CBSE", "ICSE", "State", "Other"]).default("CBSE"),
    diploma_education_type: z.enum(["FullTime", "PartTime"]).default("FullTime"),
    diploma_marksheet_path: z.string().optional(),

    // Undergraduate
    ug_year: z.number().optional(),
    ug_percentage_cgpa: z.number().optional(),
    ug_program: z.string().optional(), // UUID or string ID
    ug_branch: z.string().optional(), // UUID or string ID
    ug_college: z.string().optional(),
    ug_university: z.string().optional(), // UUID or string ID
    ug_arrear_history: z.string().optional(),
    ug_current_arrear: z.string().optional(),
    ug_education_type: z.enum(["FullTime", "PartTime"]).default("FullTime"),
    ug_marksheet_path: z.string().optional(),

    // Postgraduate
    pg_studied: z.boolean().default(false),
    pg_year: z.number().optional(),
    pg_percentage: z.number().optional(),
    pg_program: z.string().optional(), // UUID or string ID
    pg_branch: z.string().optional(), // UUID or string ID
    pg_college: z.string().optional(),
    pg_university: z.string().optional(), // UUID or string ID
    pg_arrear_history: z.string().optional(),
    pg_current_arrear: z.string().optional(),
    pg_education_type: z.enum(["FullTime", "PartTime"]).default("FullTime"),
    pg_marksheet_path: z.string().optional(),
  }),
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
  experiences: z
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
  internships: z
    .array(
      z.object({
        company_name: z.string().optional(),
        duration_days: z.number().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().optional(),
        proficiency: z.string().optional(),
      })
    )
    .optional(),
  languages: z
    .array(
      z.object({
        name: z.string().optional(),
        can_read: z.boolean().optional(),
        can_write: z.boolean().optional(),
        can_speak: z.boolean().optional(),
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
  student_experience_skill: experienceSkillSchema, // New field
  student_photos_signature: photosSignatureSchema, // New field
  student_terms_and_conditions: termsAndConditionsSchema,
})


type FormData = z.infer<typeof studentRegistrationSchema>;

export const generatePayload = (formData: FormData) => {
return {
  first_name: formData.student.first_name,
  middle_name: formData.student.middle_name,
  last_name: formData.student.last_name,
  registration_number: formData.student.registration_number,
  aadhar_number: formData.student.aadhar_number,
  father_name: formData.student.father_name,
  mother_name: formData.student.mother_name,
  religion: formData.student.religion?.id || "",
  caste: formData.student.caste?.id || "",
  email: formData.student.email,
  phone_number: formData.student.phone_number,
  date_of_birth: formData.student.date_of_birth,
  gender: formData.student.gender,
  batch_id: formData.student.year_of_passing?.id || "",
  degree_id: formData.student.degree?.id || "",
  department_id: formData.student.department?.id || "",

  contact_details: {
    comm_address_line1: formData.student_contact_persons.communication_address_line1,
    comm_address_line2: formData.student_contact_persons.communication_address_line2,
    comm_district: formData.student_contact_persons.communication_district?.id || "",
    comm_state: formData.student_contact_persons.communication_state?.id || "" ,
    comm_country: formData.student_contact_persons.communication_country?.id || "",
    comm_pin_code: formData.student_contact_persons.communication_pin_code,
    perm_address_line1: formData.student_contact_persons.permanent_address_line1,
    perm_address_line2: formData.student_contact_persons.permanent_address_line2,
    perm_district: formData.student_contact_persons.permanent_district?.id || "",
    perm_state: formData.student_contact_persons.permanent_state?.id || "",
    perm_country: formData.student_contact_persons.permanent_country?.id || "",
    perm_pin_code: formData.student_contact_persons.permanent_pin_code,
  },

  education_details: {
    class10_year: String(formData.student_size.education_details.class10_year),
    class10_marks: formData.student_size.education_details.class10_marks,
    class10_percentage: formData.student_size.education_details.class10_percentage,
    class10_school: formData.student_size.education_details.class10_school,
    class10_board: formData.student_size.education_details.class10_board,
    class10_education_type: formData.student_size.education_details.class10_education_type,
    class10_marksheet_path: formData.student_size.education_details.class10_marksheet_path,

    class12_studied: formData.student_size.education_details.class12_studied,
    class12_year: String(formData.student_size.education_details.class12_year),
    class12_marks: formData.student_size.education_details.class12_marks,
    class12_percentage: formData.student_size.education_details.class12_percentage,
    class12_group: formData.student_size.education_details.class12_group,
    class12_school: formData.student_size.education_details.class12_school,
    class12_board: formData.student_size.education_details.class12_board,
    class12_education_type: formData.student_size.education_details.class12_education_type,
    class12_marksheet_path: formData.student_size.education_details.class12_marksheet_path,

    diploma_studied: formData.student_size.education_details.diploma_studied,
    diploma_year: String(formData.student_size.education_details.diploma_year),
    diploma_percentage: formData.student_size.education_details.diploma_percentage,
    diploma_department: formData.student_size.education_details.diploma_department,
    diploma_college: formData.student_size.education_details.diploma_college,
    diploma_board: formData.student_size.education_details.diploma_board,
    diploma_education_type: formData.student_size.education_details.diploma_education_type,
    diploma_marksheet_path: formData.student_size.education_details.diploma_marksheet_path,

    ug_year: String(formData.student_size.education_details.ug_year),
    ug_percentage_cgpa: formData.student_size.education_details.ug_percentage_cgpa,
    ug_program: formData.student_size.education_details.ug_program,
    ug_branch: formData.student_size.education_details.ug_branch,
    ug_college: formData.student_size.education_details.ug_college,
    ug_university: formData.student_size.education_details.ug_university,
    ug_arrear_history: formData.student_size.education_details.ug_arrear_history,
    ug_current_arrear: formData.student_size.education_details.ug_current_arrear,
    ug_education_type: formData.student_size.education_details.ug_education_type,
    ug_marksheet_path: formData.student_size.education_details.ug_marksheet_path,

    pg_studied: formData.student_size.education_details.pg_studied,
    pg_year: String(formData.student_size.education_details.pg_year),
    pg_percentage: formData.student_size.education_details.pg_percentage,
    pg_program: formData.student_size.education_details.pg_program,
    pg_branch: formData.student_size.education_details.pg_branch,
    pg_college: formData.student_size.education_details.pg_college,
    pg_university: formData.student_size.education_details.pg_university,
    pg_arrear_history: formData.student_size.education_details.pg_arrear_history,
    pg_current_arrear: formData.student_size.education_details.pg_current_arrear,
    pg_education_type: formData.student_size.education_details.pg_education_type,
    pg_marksheet_path: formData.student_size.education_details.pg_marksheet_path,
  },

  experiences: formData.student_experience_skill.experiences?.map((exp) => ({
    experience_status: exp.has_experience === "yes",
    field: exp.field_of_experience || "",
    years: exp.total_years ? parseInt(exp.total_years, 10) : 0,
    start_date: exp.start_date || null,
    end_date: exp.end_date || null,
    tools_used: exp.tools_used || null,
    description: exp.description || null,
  })) || [],

  internships: formData.student_experience_skill.internships?.map((internship) => ({
    company_name: internship.company_name || "",
    duration_days: internship.duration_days || 0,
    start_date: internship.start_date || null,
    end_date: internship.end_date || null,
    description: internship.description || null,
  })) || [],

  skills: formData.student_experience_skill.skills
    ? formData.student_experience_skill.skills.map((skill) => ({
        name: String(skill.name),
        proficiency: String(skill.proficiency),
      }))
    : [],
  languages: formData.student_experience_skill.languages?.map((lang) => ({
    name: lang.name || "",
    can_read: lang.can_read || false,
    can_write: lang.can_speak || false,
    can_speak: lang.can_write || false,
  })) || [],

  photos_signature: {
    photo: formData.student_photos_signature.photo,
    signature: formData.student_photos_signature.signature,
  },

  student_terms_and_conditions: {
    accept: formData.student_terms_and_conditions.accept,
  },
};


}