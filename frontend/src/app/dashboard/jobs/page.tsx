"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Job } from "@/types";
import { Building, MapPin, DollarSign, Calendar, Users, Edit, Trash2, Plus, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function EmployerJobsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingJob, setDeletingJob] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "employer") {
      router.push("/dashboard");
      return;
    }

    fetchJobs();
  }, [isAuthenticated, user, router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/jobs/my-jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    setDeletingJob(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error: any) {
      console.error("Failed to delete job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setDeletingJob(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "employer") {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only employers can access this page.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
          <p className="text-gray-600 mt-2">
            Manage your job listings and track applications
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs/create">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter(job => job.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Applications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.length > 0 
                ? Math.round(jobs.reduce((total, job) => total + (job.applications?.length || 0), 0) / jobs.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">
              Start by posting your first job to attract talented candidates to your company.
            </p>
            <Button asChild>
              <Link href="/jobs/create">Post Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.isActive ? 'active' : 'inactive')}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{job.company}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center text-green-600 font-medium mb-2">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Users className="h-4 w-4 mr-2" />
                      <span>{job.applications?.length || 0} applications</span>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/edit/${job.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Link href={`/dashboard/applications/${job.id}`}>
                        <Users className="h-4 w-4 mr-1" />
                        Applications
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={deletingJob === job.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingJob === job.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
} 