"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Job } from "@/types";
import { MapPin, DollarSign, Building, Calendar, ArrowLeft, Upload, FileText } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
const applicationSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(2000, "Cover letter must be less than 2000 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "job_seeker") {
      router.push("/dashboard");
      return;
    }

    if (params.id) {
      fetchJob();
      checkApplicationStatus();
    }
  }, [params.id, isAuthenticated, user, router]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get(`/applications/me`);
      const applications = response.data;
      const hasAppliedToThisJob = applications.some(
        (app: any) => app.job.id === params.id
      );
      setHasApplied(hasAppliedToThisJob);
    } catch (error) {
      console.error("Failed to check application status:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jobId", params.id as string);
      formData.append("coverLetter", data.coverLetter);
      formData.append("resume", resumeFile);

      // Debug: Log what we're sending
      console.log("Submitting application with:", {
        jobId: params.id,
        coverLetter: data.coverLetter,
        resumeFile: resumeFile.name,
        resumeSize: resumeFile.size
      });

      await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");
      router.push("/dashboard/applications");
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "job_seeker") {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only job seekers can apply to jobs.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Applied</h2>
          <p className="text-gray-600 mb-6">You have already applied to this job.</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard/applications">View My Applications</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/jobs">Browse More Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/jobs/${params.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Job Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Review the job before applying</CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">{job.title}</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location || "Remote"}</span>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center text-green-600 font-medium">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Submit Application</CardTitle>
              <CardDescription>
                Complete your application for {job.title} at {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF only, max 5MB)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {resumeFile ? (
                          <span className="text-green-600">
                            <FileText className="h-4 w-4 inline mr-1" />
                            {resumeFile.name}
                          </span>
                        ) : (
                          "Click to upload your resume"
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF files only, maximum 5MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
                    {...register("coverLetter")}
                    className={errors.coverLetter ? "border-red-500" : ""}
                    rows={8}
                  />
                  {errors.coverLetter && (
                    <p className="text-sm text-red-500">{errors.coverLetter.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Minimum 50 characters, maximum 2000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={submitting || !resumeFile}>
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 