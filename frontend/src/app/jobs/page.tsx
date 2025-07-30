"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import { Job } from "@/types";
import { Search, MapPin, DollarSign, Building } from "lucide-react";
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

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

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-responsive border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="responsive-grid-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
            />
          </div>
          
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
          />
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
          >
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          
          <Button 
            onClick={() => {
              setSearchTerm("");
              setLocationFilter("");
              setTypeFilter("");
            }}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 responsive-text-sm"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6">
        <p className="responsive-text text-gray-600 dark:text-gray-300">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="responsive-text text-gray-600 dark:text-gray-300 mb-4">No jobs found matching your criteria.</p>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setLocationFilter("");
              setTypeFilter("");
            }}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="responsive-grid-2 gap-4 sm:gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-responsive border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-hover-responsive transition-shadow interactive-card">
              <div className="responsive-flex-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="responsive-text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{job.title}</h2>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2 responsive-text-sm">
                    <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2 responsive-text-sm">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{job.location || 'Remote'}</span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center text-green-600 dark:text-green-400 font-medium mb-2 responsive-text-sm">
                      <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 ml-2 flex-shrink-0">
                  {job.type?.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 responsive-text-sm">
                {job.description}
              </p>
              
              <div className="responsive-flex-between items-center">
                <div className="responsive-text-sm text-gray-500 dark:text-gray-400">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <Button asChild className="responsive-text-sm">
                  <Link href={`/jobs/${job.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 