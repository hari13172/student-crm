"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiSearchableSelect } from "@/components/custom-ui/searchSelect/apiSearchSelection";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Briefcase } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { experienceSkillSchema } from "../schema";
import { isFieldRequired } from "@/components/zod/checkFieldRequired";
import { routes } from "@/components/api/route";

export function ExperienceSkillForm() {
  const form = useFormContext();
  const [experienceCount, setExperienceCount] = useState(1);
  const [internshipCount, setInternshipCount] = useState(1);
  const [languageCount, setLanguageCount] = useState(1);

  const addExperience = () => setExperienceCount((prev) => prev + 1);
  const addInternship = () => setInternshipCount((prev) => prev + 1);
  const addLanguage = () => setLanguageCount((prev) => prev + 1);

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
            Please provide details about your experience, skills, internships,
            and languages.
          </p>
          <Separator />

          {/* Experience Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Experience</h3>
            {Array.from({ length: experienceCount }, (_, index) => (
              <div key={`experience-${index}`} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience[${index}].has_experience`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Do you have any Experience?
                          {isFieldRequired(
                            experienceSkillSchema,
                            `experience.has_experience`
                          ) && <span className="text-destructive">*</span>}
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <label>
                              <input
                                type="radio"

                                {...field}
                                checked={field.value === "yes"}
                                onChange={() => field.onChange("yes")}
                              />{" "}
                              Yes
                            </label>
                            <label>
                              <input
                                type="radio"

                                {...field}
                                checked={field.value === "no"}
                                onChange={() => field.onChange("no")}
                              />{" "}
                              No
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch(`experience.has_experience`) === "yes" && (
                    <>
                      <ApiSearchableSelect
                        control={form.control}
                        name={`experience.field_of_experience`}
                        label="Field of Experience"
                        placeholder="Select..."
                        apiUrl={routes.dropdown.experience_field.get}
                        required={isFieldRequired(
                          experienceSkillSchema,
                          `experience.field_of_experience`
                        )}
                        disabled={false}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.total_years`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Total years of Experience
                              {isFieldRequired(
                                experienceSkillSchema,
                                `experience.total_years`
                              ) && <span className="text-destructive">*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Type here" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.start_date`}
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
                        control={form.control}
                        name={`experience.end_date`}
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

                      <ApiSearchableSelect
                        control={form.control}
                        name={`experience.tools_used`}
                        label="Tools used"
                        placeholder="Select..."
                        apiUrl={routes.dropdown.tools.get}
                        required={isFieldRequired(
                          experienceSkillSchema,
                          `experience.tools_used`
                        )}
                        disabled={false}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description about experience
                              {isFieldRequired(
                                experienceSkillSchema,
                                `experience.description`
                              ) && <span className="text-destructive">*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Type here" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                {index === experienceCount - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addExperience}
                    className="mt-2"
                  >
                    + Add More Experience
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Internship Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Internship</h3>
            {Array.from({ length: internshipCount }, (_, index) => (
              <div key={`internship-${index}`} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`internship[${index}].company_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name
                          {isFieldRequired(
                            experienceSkillSchema,
                            `internship.company_name`
                          ) && <span className="text-destructive">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Type here" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`internship.duration_days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Duration in Days
                          {isFieldRequired(
                            experienceSkillSchema,
                            `internship.duration_days`
                          ) && <span className="text-destructive">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Type here" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`internship.start_date`}
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
                    control={form.control}
                    name={`internship.end_date`}
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
                    control={form.control}
                    name={`internship.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description about experience
                          {isFieldRequired(
                            experienceSkillSchema,
                            `internship.description`
                          ) && <span className="text-destructive">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Type here" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {index === internshipCount - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInternship}
                    className="mt-2"
                  >
                    + Add More Internship
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Skill Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Skill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ApiSearchableSelect
                control={form.control}
                name="skill.technical_skill"
                label="Select your technical skill"
                placeholder="Select..."
                apiUrl={routes.dropdown.technical_skill.get}
                required={isFieldRequired(
                  experienceSkillSchema,
                  "skill.technical_skill"
                )}
                disabled={false}
              />

              <ApiSearchableSelect
                control={form.control}
                name="skill.proficiency"
                label="Select Proficiency"
                placeholder="Select..."
                apiUrl={routes.dropdown.proficiency.get}
                required={isFieldRequired(
                  experienceSkillSchema,
                  "skill.proficiency"
                )}
                disabled={false}
              />
            </div>
          </div>

          {/* Language Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Language</h3>
            {Array.from({ length: languageCount }, (_, index) => (
              <div key={`language-${index}`} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ApiSearchableSelect
                    control={form.control}
                    name={`language.language_known`}
                    label="Language Known"
                    placeholder="Select..."
                    apiUrl={routes.dropdown.language.get}
                    required={isFieldRequired(
                      experienceSkillSchema,
                      `language.language_known`
                    )}
                    disabled={false}
                  />

                  <FormField
                    control={form.control}
                    name={`language[${index}].read`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value || false}
                            onChange={(e) =>
                              field.onChange(e.target.checked)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`language[${index}].write`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Write</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value || false}
                            onChange={(e) =>
                              field.onChange(e.target.checked)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`language[${index}].speak`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speak</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value || false}
                            onChange={(e) =>
                              field.onChange(e.target.checked)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {index === languageCount - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLanguage}
                    className="mt-2"
                  >
                    + Add More Language
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}