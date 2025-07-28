"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Application } from "@/types";
import { Building, MapPin, DollarSign, Calendar, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    fetchApplications();
  }, [isAuthenticated, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/me");
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800";
      case "reviewed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800";
      case "shortlisted":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800";
      case "hired":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />;
      case "hired":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === "pending").length;
    const shortlisted = applications.filter(app => app.status === "shortlisted").length;
    const hired = applications.filter(app => app.status === "hired").length;
    const rejected = applications.filter(app => app.status === "rejected").length;

    return { total, pending, shortlisted, hired, rejected };
  };

  const stats = getStats();

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track the status of your job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.shortlisted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Shortlisted</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.hired}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Hired</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "shortlisted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("shortlisted")}
            className={filter === "shortlisted" ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}
          >
            Shortlisted ({stats.shortlisted})
          </Button>
          <Button
            variant={filter === "hired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("hired")}
            className={filter === "hired" ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}
          >
            Hired ({stats.hired})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
            className={filter === "rejected" ? "bg-red-600 hover:bg-red-700 text-white" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}
          >
            Rejected ({stats.rejected})
          </Button>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {filter === "all" 
                ? "You haven't applied to any jobs yet." 
                : `No ${filter} applications found.`
              }
            </p>
            {filter === "all" && (
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {application.job.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{application.job.company}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{application.job.location || 'Remote'}</span>
                    </div>
                    
                    {application.job.salaryMin && application.job.salaryMax && (
                      <div className="flex items-center text-green-600 dark:text-green-400 font-medium mb-2">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>${application.job.salaryMin.toLocaleString()} - ${application.job.salaryMax.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                      {application.updatedAt !== application.createdAt && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Updated {new Date(application.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    
                    {application.coverLetter && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cover Letter</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                    
                    {application.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Employer Notes</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          {application.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm" asChild className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Link href={`/jobs/${application.job.id}`}>
                        View Job
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 