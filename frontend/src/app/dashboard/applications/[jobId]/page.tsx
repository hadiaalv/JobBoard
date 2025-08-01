"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { getFileUrl, getDownloadUrl } from "@/lib/utils";
import { Application, Job } from "@/types";
import { 
  Building, 
  MapPin, 
  Calendar, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  ArrowLeft,
  Download,
  Mail
} from "lucide-react";
import Link from "next/link";

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "employer") {
      router.push("/dashboard");
      return;
    }

    if (params.jobId) {
      fetchJobAndApplications();
    }
  }, [params.jobId, isAuthenticated, user, router]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      const [jobResponse, applicationsResponse] = await Promise.all([
        api.get(`/jobs/${params.jobId}`),
        api.get(`/applications/job/${params.jobId}`),
      ]);
      
      setJob(jobResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status,
        notes,
      });
      alert("Application status updated");
      fetchJobAndApplications();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update application status");
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
          <p className="mt-4 text-gray-600">Loading applications...</p>
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
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications for {job.title}</h1>
        <p className="text-gray-600">
          Review and manage applications for this position
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <div className="flex items-center text-gray-600 mb-1">
                <Building className="h-4 w-4 mr-2" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{job.location || "Remote"}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <Badge variant="outline">{job.type?.replace('_', ' ')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortlisted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "shortlisted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("shortlisted")}
          >
            Shortlisted ({stats.shortlisted})
          </Button>
          <Button
            variant={filter === "hired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("hired")}
          >
            Hired ({stats.hired})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </Button>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all" ? "No applications yet" : `No ${filter} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" 
                ? "Applications will appear here once candidates apply to this job."
                : `You don't have any ${filter} applications at the moment.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.applicant.firstName} {application.applicant.lastName}
                        </h3>
                        <p className="text-gray-600">{application.applicant.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
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
                        <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                    
                    {application.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Notes</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                          {application.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    {application.resumeUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (!application.resumeUrl) {
                            alert('Resume file not available');
                            return;
                          }
                          
                          const url = getDownloadUrl(application.resumeUrl);
                          
                          if (!url) {
                            alert('Resume file not available');
                            return;
                          }
                          
                          fetch(url, { method: 'HEAD' })
                            .then(response => {
                              if (response.ok) {
                                window.open(url, '_blank');
                              } else {
                                alert(`Resume file not found (${response.status})`);
                              }
                            })
                            .catch(error => {
                              console.error('Error accessing file:', error);
                              alert(`Error accessing resume file: ${error.message}`);
                            });
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Resume
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${application.applicant.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </a>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/profile/${application.applicant.id}`}>
                        <User className="h-4 w-4 mr-1" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={application.status === "reviewed" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus(application.id, "reviewed")}
                    >
                      Mark as Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "shortlisted" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus(application.id, "shortlisted")}
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "hired" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus(application.id, "hired")}
                    >
                      Hire
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "rejected" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus(application.id, "rejected")}
                    >
                      Reject
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