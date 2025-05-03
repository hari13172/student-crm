import { group } from "console";

type RouteGenerator = {
  download?: string;
  get: string;
  post: string;
  getOne: (id: string) => string;
  update: string;
  delete: string;
};
const createRoutes = (base: string): RouteGenerator => ({
  download: `${base}/download`,
  get: base,
  post: base,
  getOne: (id: string) => `${base}/${id}`,
  update: base,
  delete: base,
});

export const routes = {
  files: {
    get: "/api/storage/object",
    upload: "/api/storage/upload",
    delete: "/api/storage/object",
  },
  auth: {
    me: `/api/auth/me`,
    changePassword: `/api/auth/change-password`,
    logout: `/api/auth/logout`,
    accountSetup: "/api/auth/account-setup",
    profileSetup: "/api/auth/profile-setup",
    entitySetup: "/api/auth/entity-setup",
    checkUsername: (username: string) => `/api/auth/check-username/${username}`,
  },
  colleges: {
    add_entity: `/api/colleges/add-entity`,
    get: `/api/colleges`,
    student: `/api/colleges/college_students`,
    group: {
      get: `/api/colleges/college_groups`,
    },
    college_placement: `/api/colleges/college_placements`,
    college_training: `/api/colleges/college_trainings`,
        // College Academic API Path
        academic: {
          batches: {
            get: (college_id: string) => `/api/colleges/get_batches/${college_id}`,
            post: "/api/colleges/add_batch",
          },
          degrees: {
            get: (college_batch_id: string) =>
              `/api/colleges/get_degrees/${college_batch_id}`,
            post: "/api/colleges/add_degree",
          },
          departments: {
            get: (college_degree_id: string) =>
              `/api/colleges/get_departments/${college_degree_id}`,
            post: "/api/colleges/add_department",
          },
        },    

  },
  students: {
    get: `/api/students`,
    add_entity: `/api/students/add-entity`,
    form: {
      get: `/api/students/forms`,
      put: `/api/students/forms`,
    },
  
    // training: `api//training`,
  },
  dropdown: {
    group_12th: createRoutes(`/api/dropdown_12th_groups`),
    diploma_departments: createRoutes(`/api/dropdown_diploma_departments`),
    religion: createRoutes(`/api/dropdown_religion`),
    caste: createRoutes(`/api/dropdown_caste`),
    gender: createRoutes(`/api/dropdown_genders`),
    board: createRoutes(`/api/dropdown_boards`),
    university: createRoutes(`/api/dropdown_universities`),
    experience_field: createRoutes(`/api/dropdown_experience_fields`),
    tools: createRoutes(`/api/dropdown_tools`),
    technical_skill: createRoutes(`/api/dropdown_technical_skills`),
    proficiency: createRoutes(`/api/dropdown_proficiencies`),
    language: createRoutes(`/api/dropdown_languages`),
    branch: createRoutes(`/api/dropdown_branches`),
    group: createRoutes(`/api/dropdown_groups`),


    // college related dropdown endpoints
    colleges: createRoutes(`/api/dropdown_colleges`),
    college: {
      type: createRoutes(`/api/dropdown_college_type`),
      affiliation: createRoutes(`/api/dropdown_college_affiliation`),
      designation: createRoutes(`/api/dropdown_college_designation`),
      accreditation: createRoutes(`/api/dropdown_college_accreditation`),
      area_of_interest: createRoutes(`/api/dropdown_college_area_of_interest`),
      training_type: createRoutes(`/api/dropdown_college_training_type`),
      batches: createRoutes(`/api/dropdown_college_batches`),
      degrees: createRoutes(`/api/dropdown_college_degrees`),
      departments: createRoutes(`/api/dropdown_college_departments`),
    },

    // location related dropdown endpoints
    country: createRoutes(`/api/dropdown_country`),
    state: createRoutes(`/api/dropdown_state`),
    district: createRoutes(`/api/dropdown_district`),
  },
};
