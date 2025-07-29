"use client";

import { useAuthStore } from "@/stores/auth";
import { getFileUrl, getAvatarUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string>("");

  useEffect(() => {
    if (user?.avatar) {
      const url = getAvatarUrl(user.avatar);
      setAvatarUrl(url);
      console.log("Debug: Avatar URL generated:", url);
    }
  }, [user?.avatar]);

  const testAvatarLoad = () => {
    if (!user?.avatar) return;
    
    const img = new Image();
    img.onload = () => {
      console.log("Debug: Avatar loaded successfully");
      setAvatarError("");
    };
    img.onerror = () => {
      console.error("Debug: Avatar failed to load");
      setAvatarError("Failed to load avatar");
    };
    img.src = avatarUrl;
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Avatar Debug</h2>
        <p><strong>Original avatar path:</strong> {user?.avatar || "None"}</p>
        <p><strong>Generated URL:</strong> {avatarUrl || "None"}</p>
        {avatarError && <p className="text-red-500"><strong>Error:</strong> {avatarError}</p>}
        
        <button 
          onClick={testAvatarLoad}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Avatar Load
        </button>
        
        {avatarUrl && (
          <div className="mt-4">
            <h3 className="font-semibold">Avatar Preview:</h3>
            <img 
              src={avatarUrl} 
              alt="Avatar preview" 
              className="w-32 h-32 object-cover border rounded"
              onError={(e) => {
                console.error("Debug: Avatar preview failed");
                setAvatarError("Preview failed to load");
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Role-Based Access</h2>
        <p><strong>User Role:</strong> {user?.role || "None"}</p>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
        
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Available Routes:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><a href="/dashboard" className="text-blue-500 hover:underline">Dashboard</a></li>
            <li><a href="/profile" className="text-blue-500 hover:underline">Profile</a></li>
            {user?.role === 'employer' && (
              <>
                <li><a href="/dashboard/jobs" className="text-blue-500 hover:underline">My Jobs</a></li>
                <li><a href="/jobs/create" className="text-blue-500 hover:underline">Post Job</a></li>
              </>
            )}
            {user?.role === 'job_seeker' && (
              <li><a href="/dashboard/applications" className="text-blue-500 hover:underline">My Applications</a></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 