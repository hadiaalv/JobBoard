"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  jobId: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export default function FavoriteButton({ jobId, className = "", size = "sm" }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "job_seeker") {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, user, jobId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get(`/job-favorites/${jobId}/check`);
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save jobs to favorites");
      return;
    }

    if (user?.role !== "job_seeker") {
      toast.error("Only job seekers can save favorites");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isFavorited) {
        await api.delete(`/job-favorites/${jobId}`);
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/job-favorites/${jobId}`);
        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error);
      toast.error(error.response?.data?.message || "Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== "job_seeker") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`${
        isFavorited 
          ? "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" 
          : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      } ${className}`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} 
      />
    </Button>
  );
} 