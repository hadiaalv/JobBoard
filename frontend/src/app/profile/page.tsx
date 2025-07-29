"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { getFileUrl, getDownloadUrl, getAvatarUrl } from "@/lib/utils";
import PortfolioSection from "@/components/portfolio-section";

export default function ProfilePage() {
  const { user, updateUser, initializeAuth, isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    skills: [] as string[],
    experience: "",
    education: "",
    interests: "",
    languages: "",
    certifications: "",
    projects: "",
    linkedin: "",
    github: "",
    portfolio: "",
    yearsOfExperience: undefined as number | undefined,
    preferredWorkType: "",
    salaryExpectation: "",
    availability: "",
  });
  const [editing, setEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    skills: [] as string[],
    experience: "",
    education: "",
    interests: "",
    languages: "",
    certifications: "",
    projects: "",
    linkedin: "",
    github: "",
    portfolio: "",
    yearsOfExperience: undefined as number | undefined,
    preferredWorkType: "",
    salaryExpectation: "",
    availability: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);                                                                                                                                  
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Profile page: Initializing auth...");
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    console.log("Profile page: Auth state changed", { isAuthenticated, user });
    
    if (!isAuthenticated) {
      setLoading(false);
      router.replace("/auth/login");
      return;
    }

    if (user) {
      console.log("Profile page: Setting form data from user", user);
      const updated = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        website: user.website || "",
        skills: user.skills || [],
        experience: user.experience || "",
        education: user.education || "",
        interests: user.interests || "",
        languages: user.languages || "",
        certifications: user.certifications || "",
        projects: user.projects || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        yearsOfExperience: user.yearsOfExperience,
        preferredWorkType: user.preferredWorkType || "",
        salaryExpectation: user.salaryExpectation || "",
        availability: user.availability || "",
      };
      setForm(updated);
      setOriginalForm(updated);
      setLoading(false);
    }
  }, [user, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editing) return;
    
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    console.log("Profile page: Form field changed", name, value);
  };

  const handleSkillsChange = (skills: string[]) => {
    if (!editing) return;
    setForm(prev => ({ ...prev, skills }));
    console.log("Profile page: Skills changed", skills);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      console.log("Profile page: Avatar selected", e.target.files[0].name);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      console.log("Profile page: Resume selected", e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editing) {
      console.log("Profile page: Form submitted but not in edit mode");
      return;
    }
    
    setError("");
    setSubmitting(true);

    console.log("Profile page: Submitting form", form);
    console.log("Profile page: Original form", originalForm);

    try {
      const hasChanges = 
        form.firstName !== originalForm.firstName ||
        form.lastName !== originalForm.lastName ||
        form.bio !== originalForm.bio ||
        form.location !== originalForm.location ||
        form.phone !== originalForm.phone ||
        form.website !== originalForm.website ||
        JSON.stringify(form.skills) !== JSON.stringify(originalForm.skills) ||
        form.experience !== originalForm.experience ||
        form.education !== originalForm.education ||
        form.interests !== originalForm.interests ||
        form.languages !== originalForm.languages ||
        form.certifications !== originalForm.certifications ||
        form.projects !== originalForm.projects ||
        form.linkedin !== originalForm.linkedin ||
        form.github !== originalForm.github ||
        form.portfolio !== originalForm.portfolio ||
        form.yearsOfExperience !== originalForm.yearsOfExperience ||
        form.preferredWorkType !== originalForm.preferredWorkType ||
        form.salaryExpectation !== originalForm.salaryExpectation ||
        form.availability !== originalForm.availability ||
        avatar !== null ||
        resume !== null;

      console.log("Profile page: Has changes?", hasChanges);

      if (!hasChanges) {
        console.log("Profile page: No changes detected, exiting edit mode");
        setEditing(false);
        setSubmitting(false);
        return;
      }

      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        website: form.website,
        skills: form.skills,
        experience: form.experience,
        education: form.education,
        interests: form.interests,
        languages: form.languages,
        certifications: form.certifications,
        projects: form.projects,
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
        yearsOfExperience: form.yearsOfExperience,
        preferredWorkType: form.preferredWorkType,
        salaryExpectation: form.salaryExpectation,
        availability: form.availability,
      };

      console.log("Profile page: Calling updateUser with", updateData);
      const updatedUser = await updateUser(updateData, avatar || undefined, resume || undefined);
      console.log("Profile page: Update successful", updatedUser);
      
      setOriginalForm({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        website: form.website,
        skills: form.skills,
        experience: form.experience,
        education: form.education,
        interests: form.interests,
        languages: form.languages,
        certifications: form.certifications,
        projects: form.projects,
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
        yearsOfExperience: form.yearsOfExperience,
        preferredWorkType: form.preferredWorkType,
        salaryExpectation: form.salaryExpectation,
        availability: form.availability,
      });
      
      setAvatar(null);
      setResume(null);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setEditing(false);
    } catch (err: any) {
      console.error('Profile page: Update error:', err);
      console.error('Profile page: Error response:', err.response?.data);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    console.log("Profile page: Edit button clicked");
    setError("");
    setSuccess(false);
    setEditing(true);
  };

  const handleCancelClick = () => {
    console.log("Profile page: Cancel button clicked");
    setForm(originalForm);
    setAvatar(null);
    setResume(null);
    setEditing(false);
    setError("");
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="bg-white p-8 rounded shadow space-y-8">
        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded text-center font-semibold mb-4">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded text-center font-semibold mb-4">
            {error}
          </div>
        )}

        {/* Basic Information Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-primary flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load avatar:', user.avatar);
                    console.error('Avatar URL attempted:', getAvatarUrl(user.avatar));
                    e.currentTarget.style.display = 'none';
                    // Show fallback initials instead
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`;
                    }
                  }}
                  onLoad={() => {
                    console.log('Avatar loaded successfully:', getAvatarUrl(user.avatar));
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
                    View Current Resume
                  </a>
                </div>
              )}
              {editing && (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:bg-primary file:text-white file:rounded file:px-3 file:py-1 file:border-0 hover:file:bg-primary/90 transition-colors"
                />
              )}
              {resume && (
                <p className="text-xs text-green-600 mt-1">✓ {resume.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Section - Only show for job seekers */}
        {user?.role === 'job_seeker' && (
          <PortfolioSection
            form={form}
            editing={editing}
            onChange={handleChange}
            onSkillsChange={handleSkillsChange}
          />
        )}

        <div className="flex justify-end gap-4">
          {!editing ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary/90 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={submitting}
                className="bg-gray-400 text-white px-6 py-2 rounded font-bold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
