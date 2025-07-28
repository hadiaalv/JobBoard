"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Job, Application } from "@/types";
import { Building, MapPin, DollarSign, Calendar, Users, Briefcase, FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user && user.role) {
      fetchDashboardData();
    } else if (user && !user.role) {
      console.warn("User exists but no role found:", user);
    }
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data for user role:", user?.role);
      
      if (user?.role === "employer") {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get("/jobs/my-jobs"),
          api.get("/applications/employer"),
        ]);
        
        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data || []);
        
        setStats({
          totalJobs: jobsResponse.data.length,
          totalApplications: applicationsResponse.data?.length || 0,
          activeJobs: jobsResponse.data.filter((job: Job) => job.isActive).length,
          pendingApplications: applicationsResponse.data?.filter((app: Application) => app.status === "pending").length || 0,
        });
      } else if (user?.role === "job_seeker") {
        const applicationsResponse = await api.get("/applications/me");
        setApplications(applicationsResponse.data);
        
        setStats({
          totalJobs: 0,
          totalApplications: applicationsResponse.data.length,
          activeJobs: 0,
          pendingApplications: applicationsResponse.data.filter((app: Application) => app.status === "pending").length,
        });
      } else {
        console.warn("Unknown user role:", user?.role);
        setStats({
          totalJobs: 0,
          totalApplications: 0,
          activeJobs: 0,
          pendingApplications: 0,
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      
      if (error.response?.status === 403) {
        console.warn("Access forbidden - user may not have the correct role");
        setStats({
          totalJobs: 0,
          totalApplications: 0,
          activeJobs: 0,
          pendingApplications: 0,
        });
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  console.log("Dashboard - User:", user);
  console.log("Dashboard - User role:", user?.role);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back, {user?.firstName}! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Building className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.role === "employer" ? (
        <>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Applications</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Latest applications for your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-center py-8">No applications yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{application.applicant.firstName} {application.applicant.lastName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{application.job.title}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800' :
                          application.status === 'shortlisted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800' :
                          application.status === 'hired' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
                      <Link href="/dashboard/applications">View All Applications</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Post a New Job</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Create a new job posting to attract candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/jobs/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job Posting
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Manage Jobs</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  View and edit your existing job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
                  <Link href="/dashboard/jobs">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Jobs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Your Applications</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Track the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't applied to any jobs yet.</p>
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{application.job.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{application.job.company}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800' :
                          application.status === 'shortlisted' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800' :
                          application.status === 'hired' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
                      <Link href="/dashboard/applications">View All Applications</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Browse Jobs</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Find your next career opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/jobs">
                    <Search className="mr-2 h-4 w-4" />
                    Search Jobs
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Update Profile</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Keep your profile and resume up to date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
                  <Link href="/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
} 