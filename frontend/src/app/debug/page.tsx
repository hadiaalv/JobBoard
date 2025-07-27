"use client";

import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function DebugPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    setLoading(true);
    try {
      const response = method === 'POST' 
        ? await api.post(endpoint, data)
        : await api.get(endpoint);
      setApiResponse({ endpoint, success: true, data: response.data });
      toast.success(`Success: ${endpoint}`);
    } catch (error: any) {
      setApiResponse({ 
        endpoint, 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      });
      toast.error(`Error: ${endpoint} - ${error.response?.status || 'Network Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    logout();
    toast.success("Auth cleared");
  };

  const showToken = () => {
    const token = Cookies.get('auth-token');
    alert(`Token: ${token || 'No token found'}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      {/* Auth State */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            <p><strong>User Email:</strong> {user?.email || 'None'}</p>
            <p><strong>User Role:</strong> {user?.role || 'None'}</p>
            <p><strong>User Name:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Token Present:</strong> {Cookies.get('auth-token') ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="mt-4 space-x-2">
            <Button onClick={showToken} variant="outline">Show Token</Button>
            <Button onClick={clearAuth} variant="outline">Clear Auth</Button>
          </div>
        </CardContent>
      </Card>

      {/* API Tests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Endpoint Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button 
              onClick={() => testEndpoint('/users/me')} 
              disabled={loading}
              className="w-full"
            >
              Test /users/me
            </Button>
            
            <Button 
              onClick={() => testEndpoint('/applications/me')} 
              disabled={loading}
              className="w-full"
            >
              Test /applications/me (Job Seeker)
            </Button>
            
            <Button 
              onClick={() => testEndpoint('/applications/employer')} 
              disabled={loading}
              className="w-full"
            >
              Test /applications/employer (Employer)
            </Button>
            
            <Button 
              onClick={() => testEndpoint('/jobs/my-jobs')} 
              disabled={loading}
              className="w-full"
            >
              Test /jobs/my-jobs (Employer)
            </Button>
            
            <Button 
              onClick={() => testEndpoint('/applications/test', 'POST', { jobId: 'test-job-id', coverLetter: 'Test cover letter' })} 
              disabled={loading}
              className="w-full"
            >
              Test /applications/test (Job Seeker)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Response */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Last API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Endpoint:</strong> {apiResponse.endpoint}</p>
              <p><strong>Success:</strong> {apiResponse.success ? 'Yes' : 'No'}</p>
              {apiResponse.status && (
                <p><strong>Status:</strong> {apiResponse.status}</p>
              )}
              <p><strong>Response:</strong></p>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 