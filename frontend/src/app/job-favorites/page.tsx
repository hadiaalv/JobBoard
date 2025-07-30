"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Job } from "@/types";
import { 
  Heart, 
  MapPin, 
  DollarSign, 
  Building, 
  Calendar, 
  Trash2,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JobFavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "job_seeker") {
      router.push("/jobs");
      return;
    }

    fetchFavorites();
  }, [isAuthenticated, user, router]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get("/job-favorites");
      setFavorites(response.data);
    } catch (error: any) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorite jobs");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (jobId: string) => {
    try {
      setRemovingId(jobId);
      await api.delete(`/job-favorites/${jobId}`);
      setFavorites(favorites.filter(job => job.id !== jobId));
      toast.success("Job removed from favorites");
    } catch (error: any) {
      console.error("Failed to remove from favorites:", error);
      toast.error("Failed to remove job from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  const filteredFavorites = favorites.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="responsive-container py-8 sm:py-12">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 sm:h-12 sm:w-12 mx-auto"></div>
          <p className="mt-4 responsive-text text-gray-600 dark:text-gray-300">Loading favorite jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="responsive-text-xl font-bold text-gray-900 dark:text-white">
            My Favorite Jobs
          </h1>
        </div>
        <p className="responsive-text text-gray-600 dark:text-gray-300">
          {favorites.length} saved job{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      {favorites.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-responsive border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your favorite jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {filteredFavorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">
              {favorites.length === 0 ? "No favorite jobs yet" : "No jobs match your search"}
            </CardTitle>
            <CardDescription className="mb-6">
              {favorites.length === 0 
                ? "Start browsing jobs and save your favorites to see them here."
                : "Try adjusting your search terms."
              }
            </CardDescription>
            <Button asChild>
              <Link href="/jobs">
                Browse Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="responsive-grid-2 gap-4 sm:gap-6">
          {filteredFavorites.map(job => (
            <Card key={job.id} className="hover:shadow-hover-responsive transition-shadow interactive-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="responsive-text-lg line-clamp-1 mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1 responsive-text-sm">
                      <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2 responsive-text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{job.location || 'Remote'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromFavorites(job.id)}
                    disabled={removingId === job.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium mb-3 responsive-text-sm">
                    <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                  </div>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 responsive-text-sm">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="responsive-text-xs">
                      {job.type?.replace('_', ' ')}
                    </Badge>
                    {job.experienceLevel && (
                      <Badge variant="outline" className="responsive-text-xs">
                        {job.experienceLevel}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="responsive-text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <Button asChild size="sm" className="responsive-text-sm">
                      <Link href={`/jobs/${job.id}`}>
                        View Details
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