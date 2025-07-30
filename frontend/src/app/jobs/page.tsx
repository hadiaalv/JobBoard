"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth";
import FavoriteButton from "@/components/favorite-button";
import api from "@/lib/api";
import { Job, JobFilters } from "@/types";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Building, 
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Star,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    location: "",
    type: "",
    experienceLevel: "",
    salaryMin: undefined,
    salaryMax: undefined,
    company: "",
    skills: [],
    remote: false,
    urgent: false,
    sortBy: "createdAt",
    sortOrder: "DESC",
    page: 1,
    limit: 10,
  });
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== false) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
      
      params.set('page', currentPage.toString());
      
      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs || response.data);
      setTotalJobs(response.data.total || response.data.length);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      experienceLevel: "",
      salaryMin: undefined,
      salaryMax: undefined,
      company: "",
      skills: [],
      remote: false,
      urgent: false,
      sortBy: "createdAt",
      sortOrder: "DESC",
      page: 1,
      limit: 10,
    });
    setCurrentPage(1);
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !filters.skills?.includes(skill.trim())) {
      setFilters(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  if (loading) {
    return (
      <div className="responsive-container py-8 sm:py-12">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 sm:h-12 sm:w-12 mx-auto"></div>
          <p className="mt-4 responsive-text text-gray-600 dark:text-gray-300">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-container py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="responsive-text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Find Your Next Job</h1>
        <p className="responsive-text text-gray-600 dark:text-gray-300">Browse through our latest job opportunities</p>
      </div>

      {/* Search and Basic Filters */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="responsive-grid-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
              />
            </div>
            
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
            />
            
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 responsive-text-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <Button 
                onClick={clearFilters}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 responsive-text-sm"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="responsive-grid-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin || ""}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax || ""}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="createdAt">Date Posted</option>
                    <option value="title">Job Title</option>
                    <option value="company">Company</option>
                    <option value="salaryMin">Salary</option>
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filters.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                    <Button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add skill..."]') as HTMLInputElement;
                        if (input?.value) {
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(e) => handleFilterChange('remote', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remote Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.urgent}
                        onChange={(e) => handleFilterChange('urgent', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Urgent (Last 7 days)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <p className="responsive-text text-gray-600 dark:text-gray-300">
          Showing {jobs.length} of {totalJobs} jobs
        </p>
        {isAuthenticated && user?.role === "job_seeker" && (
          <Button asChild variant="outline" size="sm">
            <Link href="/job-favorites" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              My Favorites
            </Link>
          </Button>
        )}
      </div>

      {/* Job Listings */}
      {jobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No jobs found</CardTitle>
            <CardDescription className="mb-6">
              Try adjusting your search criteria or filters.
            </CardDescription>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="responsive-grid-2 gap-4 sm:gap-6">
            {jobs.map(job => (
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
                    <FavoriteButton jobId={job.id} />
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
                      {new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <Badge variant="destructive" className="responsive-text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          New
                        </Badge>
                      )}
                    </div>
                    <Button asChild size="sm" className="responsive-text-sm">
                      <Link href={`/jobs/${job.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 