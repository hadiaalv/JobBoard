"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import { Job } from "@/types";
import { MapPin, DollarSign, Building, Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchJob();
      if (isAuthenticated && user?.role === 'job_seeker') {
        checkApplicationStatus();
      }
    }
  }, [params.id, isAuthenticated, user]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Failed to fetch job:', error);
      toast.error('Failed to load job details');
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
      console.error('Failed to check application status:', error);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'job_seeker') {
      toast.error('Only job seekers can apply to jobs');
    }

    router.push(`/jobs/${params.id}/apply`);
  };

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

  return (
    <>
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{job.title}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <Building className="h-5 w-5 mr-2 animated-icon" />
                <span className="text-lg">{job.company}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <MapPin className="h-5 w-5 mr-2 animated-icon" />
                <span>{job.location || 'Remote'}</span>
              </div>
              {job.salaryMin && job.salaryMax && (
                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold text-lg mb-2">
                  <DollarSign className="h-5 w-5 mr-2 animated-icon" />
                  <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm mb-2">
                {job.type?.replace('_', ' ')}
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm transition-all duration-300 transform hover:scale-105"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="leading-relaxed">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 sticky top-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 animated-icon" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Job Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{job.type?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 animated-icon" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{job.location || 'Remote'}</p>
                    </div>
                  </div>

                  {job.experienceLevel && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3 animated-icon" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                        <p className="font-medium text-gray-900 dark:text-white">{job.experienceLevel}</p>
                      </div>
                    </div>
                  )}

                  {job.applicationDeadline && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 animated-icon" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="mt-6">
                  {!isAuthenticated ? (
                    <Button className="w-full interactive-button" asChild>
                      <Link href="/auth/login">Login to Apply</Link>
                    </Button>
                  ) : user?.role === 'job_seeker' ? (
                    hasApplied ? (
                      <Button className="w-full" variant="outline" disabled>
                        Already Applied
                      </Button>
                    ) : (
                      <Button 
                        className="w-full interactive-button" 
                        onClick={handleApply}
                        disabled={applying}
                      >
                        {applying ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Employers cannot apply
                    </Button>
                  )}
                </div>

                {/* Employer Actions */}
                {isAuthenticated && user?.role === 'employer' && job.postedBy?.id === user.id && (
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full interactive-button" asChild>
                      <Link href={`/jobs/edit/${job.id}`}>Edit Job</Link>
                    </Button>
                    <Button variant="outline" className="w-full interactive-button" asChild>
                      <Link href={`/dashboard/applications/${job.id}`}>View Applications</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 