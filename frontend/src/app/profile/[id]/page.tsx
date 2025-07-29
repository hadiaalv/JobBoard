"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { getFileUrl, getAvatarUrl } from "@/lib/utils";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Linkedin, 
  Github, 
  Building,
  Calendar,
  Award,
  BookOpen,
  Languages,
  Briefcase,
  DollarSign,
  Clock
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (params.id) {
      fetchUserProfile();
    }
  }, [params.id, isAuthenticated, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${params.id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load user profile");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getSkillsArray = (skills: string | string[] | undefined) => {
    if (Array.isArray(skills)) {
      return skills;
    } else if (typeof skills === "string") {
      return skills.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const skills = getSkillsArray(user.skills);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-2 border-primary flex items-center justify-center text-4xl font-bold text-primary overflow-hidden">
              {user.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load avatar:', user.avatar);
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
                    }
                  }}
                />
              ) : (
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {user.role?.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${user.email}`}>
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </a>
                </Button>
                {user.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${user.phone}`}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.bio && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {skills.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {user.experience && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{user.experience}</p>
            </CardContent>
          </Card>
        )}

        {user.education && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{user.education}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.yearsOfExperience && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Years of Experience</p>
                  <p className="text-gray-600">{user.yearsOfExperience} years</p>
                </div>
              </div>
            )}
            
            {user.preferredWorkType && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Preferred Work Type</p>
                  <p className="text-gray-600 capitalize">{user.preferredWorkType.replace('_', ' ')}</p>
                </div>
              </div>
            )}
            
            {user.salaryExpectation && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Salary Expectation</p>
                  <p className="text-gray-600">{user.salaryExpectation}</p>
                </div>
              </div>
            )}
            
            {user.availability && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-gray-600">{user.availability}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.interests && (
              <div>
                <p className="font-medium mb-1">Interests</p>
                <p className="text-gray-600">{user.interests}</p>
              </div>
            )}
            
            {user.languages && (
              <div className="flex items-center">
                <Languages className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Languages</p>
                  <p className="text-gray-600">{user.languages}</p>
                </div>
              </div>
            )}
            
            {user.certifications && (
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Certifications</p>
                  <p className="text-gray-600">{user.certifications}</p>
                </div>
              </div>
            )}
            
            {user.projects && (
              <div>
                <p className="font-medium mb-1">Projects</p>
                <p className="text-gray-600">{user.projects}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(user.linkedin || user.github || user.portfolio || user.website) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                </Button>
              )}
              
              {user.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={user.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                </Button>
              )}
              
              {user.portfolio && (
                <Button variant="outline" size="sm" asChild>
                  <a href={user.portfolio} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" />
                    Portfolio
                  </a>
                </Button>
              )}
              
              {user.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}