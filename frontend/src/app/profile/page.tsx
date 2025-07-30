"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { getFileUrl, getDownloadUrl, getAvatarUrl } from "@/lib/utils";
import PortfolioSection from "@/components/portfolio-section";
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
  Clock,
  Edit,
  Save,
  X,
  Trash2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, deleteUser, editing, setEditing } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    company: "",
    location: "",
    phone: "",
    website: "",
    education: "",
    interests: "",
    languages: "",
    certifications: "",
    projects: "",
    linkedin: "",
    github: "",
    portfolio: "",
    yearsOfExperience: "",
    preferredWorkType: "",
    salaryExpectation: "",
    availability: "",
    skills: [] as string[] | string,
    experience: "",
  });

  // Create a separate form object for PortfolioSection that matches its interface
  const portfolioForm = {
    skills: Array.isArray(form.skills) ? form.skills : (typeof form.skills === 'string' ? form.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
    experience: form.experience || "",
    education: form.education || "",
    interests: form.interests || "",
    languages: form.languages || "",
    certifications: form.certifications || "",
    projects: form.projects || "",
    linkedin: form.linkedin || "",
    github: form.github || "",
    portfolio: form.portfolio || "",
    yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
    preferredWorkType: form.preferredWorkType || "",
    salaryExpectation: form.salaryExpectation || "",
    availability: form.availability || "",
    location: form.location || "",
    phone: form.phone || "",
    website: form.website || "",
  };
  const [avatar, setAvatar] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        company: user.company || "",
        location: user.location || "",
        phone: user.phone || "",
        website: user.website || "",
        education: user.education || "",
        interests: user.interests || "",
        languages: user.languages || "",
        certifications: user.certifications || "",
        projects: user.projects || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        yearsOfExperience: user.yearsOfExperience?.toString() || "",
        preferredWorkType: user.preferredWorkType || "",
        salaryExpectation: user.salaryExpectation || "",
        availability: user.availability || "",
        skills: user.skills || [],
        experience: user.experience || "",
      });
    }
  }, [user, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setForm(prev => ({ ...prev, skills: skills }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: any = { ...form };
      
      if (form.yearsOfExperience) {
        updateData.yearsOfExperience = parseInt(form.yearsOfExperience);
      }
      
      await updateUser(updateData, avatar || undefined, resume || undefined);
      
      setAvatar(null);
      setResume(null);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setAvatar(null);
    setResume(null);
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        company: user.company || "",
        location: user.location || "",
        phone: user.phone || "",
        website: user.website || "",
        education: user.education || "",
        interests: user.interests || "",
        languages: user.languages || "",
        certifications: user.certifications || "",
        projects: user.projects || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        yearsOfExperience: user.yearsOfExperience?.toString() || "",
        preferredWorkType: user.preferredWorkType || "",
        salaryExpectation: user.salaryExpectation || "",
        availability: user.availability || "",
        skills: user.skills || [],
        experience: user.experience || "",
      });
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      toast.success("Profile deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to delete profile:", error);
      toast.error("Failed to delete profile");
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load avatar:', user.avatar);
                    console.error('Avatar URL attempted:', user.avatar ? getAvatarUrl(user.avatar) : 'No avatar');
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`;
                    }
                  }}
                  onLoad={() => {
                    console.log('Avatar loaded successfully:', user.avatar ? getAvatarUrl(user.avatar) : 'No avatar');
                  }}
                />
              ) : (
                `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`
              )}
            </div>
            {editing && (
              <label className="block text-gray-600 text-sm font-medium cursor-pointer">
                Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:bg-primary file:text-white file:rounded file:px-3 file:py-1 file:border-0 hover:file:bg-primary/90 transition-colors"
                />
              </label>
            )}
            {avatar && (
              <p className="text-xs text-green-600">✓ {avatar.name}</p>
            )}
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full border border-gray-300 rounded px-4 py-2 ${
                    editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
                  }`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full border border-gray-300 rounded px-4 py-2 ${
                    editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Tell us about yourself..."
                className={`w-full border border-gray-300 rounded px-4 py-2 min-h-[60px] ${
                  editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
                }`}
              />
            </div>

            {user.role === 'job_seeker' && (
              <div>
                <label className="block text-gray-700 mb-1">Resume</label>
                {user?.resume && !resume && (
                  <div className="mb-2 p-2 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">Current resume:</p>
                    <a 
                      href={getDownloadUrl(user.resume)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View current resume
                    </a>
                  </div>
                )}
                {editing && (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="mt-2 block w-full text-sm text-gray-500 file:bg-primary file:text-white file:rounded file:px-3 file:py-1 file:border-0 hover:file:bg-primary/90 transition-colors"
                  />
                )}
                {resume && (
                  <p className="text-xs text-green-600">✓ {resume.name}</p>
                )}
              </div>
            )}
          </div>


        </CardContent>
      </Card>

      {user.role === 'job_seeker' && (
        <PortfolioSection 
          form={portfolioForm} 
          onChange={handleChange} 
          onSkillsChange={handleSkillsChange}
          editing={editing}
        />
      )}

      {/* Profile Actions */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-end gap-2">
            {!editing ? (
              <Button onClick={handleEditClick} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelClick} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Profile</h3>
              <p className="text-red-600 mb-4">
                This action cannot be undone. This will permanently delete your profile, 
                all your data, applications, and remove you from the platform.
              </p>
              
              {!showDeleteConfirm ? (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Profile
                </Button>
              ) : (
                <div className="space-y-3 p-4 bg-red-100 rounded-lg border border-red-300">
                  <p className="text-red-800 font-medium">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <p className="text-red-700 text-sm">
                    Please type <span className="font-mono font-bold">DELETE</span> to confirm.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteProfile}
                      disabled={isDeleting}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Yes, Delete My Profile
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
