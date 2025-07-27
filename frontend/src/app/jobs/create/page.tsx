"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  salaryMin: z.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.number().min(0, "Maximum salary must be positive"),
  type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead", "executive"]),
  applicationDeadline: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "full_time",
      experienceLevel: "mid",
    },
  });

  const salaryMin = watch("salaryMin");
  const salaryMax = watch("salaryMax");

  // Redirect if not authenticated or not an employer
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  if (user?.role !== "employer") {
    router.push("/jobs");
    return null;
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter(benefit => benefit !== benefitToRemove));
  };

  const onSubmit = async (data: JobFormData) => {
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      toast.error("Minimum salary cannot be greater than maximum salary");
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...data,
        skills,
        benefits,
        salaryMin: data.salaryMin || undefined,
        salaryMax: data.salaryMax || undefined,
        applicationDeadline: data.applicationDeadline || undefined,
      };

      await api.post("/jobs", jobData);
      toast.success("Job posted successfully!");
      router.push("/dashboard/jobs");
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
          <CardDescription>
            Create a job listing to attract talented candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Frontend Developer"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Tech Solutions Inc."
                  {...register("company")}
                  className={errors.company ? "border-red-500" : ""}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, NY or Remote"
                  {...register("location")}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  {...register("applicationDeadline")}
                />
              </div>
            </div>

            {/* Job Type and Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <select
                  id="experienceLevel"
                  {...register("experienceLevel")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary ($)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="e.g., 50000"
                  {...register("salaryMin", { valueAsNumber: true })}
                  className={errors.salaryMin ? "border-red-500" : ""}
                />
                {errors.salaryMin && (
                  <p className="text-sm text-red-500">{errors.salaryMin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary ($)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="e.g., 80000"
                  {...register("salaryMax", { valueAsNumber: true })}
                  className={errors.salaryMax ? "border-red-500" : ""}
                />
                {errors.salaryMax && (
                  <p className="text-sm text-red-500">{errors.salaryMax.message}</p>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={8}
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, TypeScript"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Health insurance, Remote work"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/jobs">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Post Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
} 