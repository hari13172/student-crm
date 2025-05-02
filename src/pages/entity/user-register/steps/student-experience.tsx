"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Plus, X } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function ExperienceSkillForm() {
  const { control } = useFormContext();

  // State to manage visibility of each section
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  const [isInternshipVisible, setIsInternshipVisible] = useState(false);
  const [isSkillVisible, setIsSkillVisible] = useState(false);
  const [isLanguageVisible, setIsLanguageVisible] = useState(false);

  // Manage the experiences array dynamically
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "student_experience_skill.experiences",
  });

  // Manage the internships array dynamically
  const {
    fields: internshipFields,
    append: appendInternship,
    remove: removeInternship,
  } = useFieldArray({
    control,
    name: "student_experience_skill.internships",
  });

  // Manage the skills array dynamically
  const { fields: skillFields, append: appendSkill, remove: removeSkill } =
    useFieldArray({
      control,
      name: "student_experience_skill.skills",
    });

  // Manage the languages array dynamically
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "student_experience_skill.languages",
  });

  // Add a new experience entry and show the section
  const handleAddExperience = () => {
    appendExperience({
      has_experience: "yes", // Set to "yes" when opening the section
      field: "",
      years: 0,
      start_date: "",
      end_date: "",
      tools_used: "",
      description: "",
    });
    setIsExperienceVisible(true);
  };

  // Close the experience section
  const handleCloseExperience = () => {
    removeExperience(); // Remove all experience entries
    setIsExperienceVisible(false);
  };

  // Add a new internship entry and show the section
  const handleAddInternship = () => {
    appendInternship({
      company_name: "",
      duration_days: 0,
      start_date: "",
      end_date: "",
      description: "",
    });
    setIsInternshipVisible(true);
  };

  // Close the internship section
  const handleCloseInternship = () => {
    removeInternship(); // Remove all internship entries
    setIsInternshipVisible(false);
  };

  // Add a new skill entry and show the section
  const handleAddSkill = () => {
    appendSkill({
      name: "",
      proficiency: "",
    });
    setIsSkillVisible(true);
  };

  // Close the skill section
  const handleCloseSkill = () => {
    removeSkill(); // Remove all skill entries
    setIsSkillVisible(false);
  };

  // Add a new language entry and show the section
  const handleAddLanguage = () => {
    appendLanguage({
      name: "",
      can_read: false,
      can_write: false,
      can_speak: false,
    });
    setIsLanguageVisible(true);
  };

  // Close the language section
  const handleCloseLanguage = () => {
    removeLanguage(); // Remove all language entries
    setIsLanguageVisible(false);
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">
              Experience/Skill/Internship/Language
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Please provide details about your experience, skills, internships, and
            languages.
          </p>
          <Separator />

          {/* Experience Section */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium mb-2">Experience</h3>
              {isExperienceVisible && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseExperience}
                  className="mb-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
            {isExperienceVisible &&
              experienceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 mb-4 border p-4 rounded-md bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.field`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.years`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Type here"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.start_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.end_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.tools_used`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tools Used</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description About Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index === experienceFields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddExperience}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Experience
                    </Button>
                  )}
                </div>
              ))}
            {!isExperienceVisible && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddExperience}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>

          {/* Internship Section */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium mb-2">Internship</h3>
              {isInternshipVisible && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseInternship}
                  className="mb-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
            {isInternshipVisible &&
              internshipFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 mb-4 border p-4 rounded-md bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`student_experience_skill.internships.${index}.company_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.internships.${index}.duration_days`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration in Days</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Type here"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.internships.${index}.start_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.internships.${index}.end_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.internships.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index === internshipFields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddInternship}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Internship
                    </Button>
                  )}
                </div>
              ))}
            {!isInternshipVisible && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddInternship}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Internship
              </Button>
            )}
          </div>

          {/* Skill Section */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium mb-2">Skill</h3>
              {isSkillVisible && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseSkill}
                  className="mb-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
            {isSkillVisible &&
              skillFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 mb-4 border p-4 rounded-md bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`student_experience_skill.skills.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Skill</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.skills.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proficiency</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index === skillFields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSkill}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Skill
                    </Button>
                  )}
                </div>
              ))}
            {!isSkillVisible && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            )}
          </div>

          {/* Language Section */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium mb-2">Language</h3>
              {isLanguageVisible && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseLanguage}
                  className="mb-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
            {isLanguageVisible &&
              languageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 mb-4 border p-4 rounded-md bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`student_experience_skill.languages.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language Known</FormLabel>
                          <FormControl>
                            <Input placeholder="Type here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.languages.${index}.can_read`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Read</FormLabel>
                          <FormControl>
                            <input
                              type="checkbox"
                              {...field}
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.languages.${index}.can_write`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Write</FormLabel>
                          <FormControl>
                            <input
                              type="checkbox"
                              {...field}
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`student_experience_skill.languages.${index}.can_speak`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Speak</FormLabel>
                          <FormControl>
                            <input
                              type="checkbox"
                              {...field}
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index === languageFields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddLanguage}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add More Language
                    </Button>
                  )}
                </div>
              ))}
            {!isLanguageVisible && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLanguage}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}