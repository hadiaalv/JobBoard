"use client";

import { useState } from "react";

interface PortfolioSectionProps {
  form: {
    skills?: string | string[];
    experience?: string;
    education?: string;
    interests?: string;
    languages?: string;
    certifications?: string;
    projects?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    yearsOfExperience?: number;
    preferredWorkType?: string;
    salaryExpectation?: string;
    availability?: string;
    location?: string;
    phone?: string;
    website?: string;
  };
  editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSkillsChange: (skills: string[]) => void;
}

export default function PortfolioSection({ form, editing, onChange, onSkillsChange }: PortfolioSectionProps) {
  const [skillInput, setSkillInput] = useState("");

  
  const getSkillsArray = () => {
    if (Array.isArray(form.skills)) {
      return form.skills;
    } else if (typeof form.skills === "string") {
      return form.skills.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getSkillsArray();
      if (!currentSkills.includes(skillInput.trim())) {
        const newSkills = [...currentSkills, skillInput.trim()];
        onSkillsChange(newSkills);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = getSkillsArray();
    const newSkills = currentSkills.filter(skill => skill !== skillToRemove);
    onSkillsChange(newSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const workTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="responsive-text-lg font-semibold text-gray-800 border-b pb-2">Portfolio & Professional Details</h3>
      
      {/* Contact Information */}
      <div className="responsive-grid-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Location</label>
          <input
            type="text"
            name="location"
            value={form.location || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="City, Country"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="+1 (555) 123-4567"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1 responsive-text-sm">Website</label>
        <input
          type="url"
          name="website"
          value={form.website || ""}
          onChange={onChange}
          disabled={!editing}
          placeholder="https://yourwebsite.com"
          className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
            editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Skills Section */}
      <div>
        <label className="block text-gray-700 mb-2 responsive-text-sm">Skills</label>
        {editing ? (
          <div className="space-y-2">
            <div className="responsive-flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill (e.g., JavaScript, React, Python)"
                className="flex-1 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary responsive-text-sm"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-primary text-white px-3 sm:px-4 py-2 rounded hover:bg-primary/90 transition-colors responsive-text-sm"
              >
                Add
              </button>
            </div>
            {getSkillsArray().map((skill, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full responsive-text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-primary hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {getSkillsArray().length > 0 ? (
              getSkillsArray().map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full responsive-text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="responsive-text-sm text-gray-500">No skills added yet</p>
            )}
          </div>
        )}
      </div>

      {/* Experience & Education */}
      <div className="responsive-grid-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={form.yearsOfExperience || ""}
            onChange={onChange}
            disabled={!editing}
            min="0"
            max="50"
            placeholder="5"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Preferred Work Type</label>
          <select
            name="preferredWorkType"
            value={form.preferredWorkType || ""}
            onChange={onChange}
            disabled={!editing}
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          >
            <option value="">Select work type</option>
            {workTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1 responsive-text-sm">Work Experience</label>
        <textarea
          name="experience"
          value={form.experience || ""}
          onChange={onChange}
          disabled={!editing}
          placeholder="Describe your work experience, roles, and achievements..."
          rows={3}
          className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
            editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
          }`}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1 responsive-text-sm">Education</label>
        <textarea
          name="education"
          value={form.education || ""}
          onChange={onChange}
          disabled={!editing}
          placeholder="Your educational background, degrees, institutions..."
          rows={2}
          className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
            editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Professional Links */}
      <div className="responsive-grid-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={form.linkedin || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="https://linkedin.com/in/yourprofile"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">GitHub</label>
          <input
            type="url"
            name="github"
            value={form.github || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="https://github.com/yourusername"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Portfolio</label>
          <input
            type="url"
            name="portfolio"
            value={form.portfolio || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="https://yourportfolio.com"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="responsive-grid-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Languages</label>
          <textarea
            name="languages"
            value={form.languages || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="Languages you speak (e.g., English, Spanish, French)"
            rows={2}
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Certifications</label>
          <textarea
            name="certifications"
            value={form.certifications || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="Professional certifications and licenses"
            rows={2}
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1 responsive-text-sm">Projects</label>
        <textarea
          name="projects"
          value={form.projects || ""}
          onChange={onChange}
          disabled={!editing}
          placeholder="Notable projects you've worked on, technologies used, outcomes..."
          rows={3}
          className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
            editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
          }`}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1 responsive-text-sm">Interests & Hobbies</label>
        <textarea
          name="interests"
          value={form.interests || ""}
          onChange={onChange}
          disabled={!editing}
          placeholder="Your interests, hobbies, and activities outside of work..."
          rows={2}
          className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
            editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Career Preferences */}
      <div className="responsive-grid-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Salary Expectation</label>
          <input
            type="text"
            name="salaryExpectation"
            value={form.salaryExpectation || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="e.g., $60,000 - $80,000"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 responsive-text-sm">Availability</label>
          <input
            type="text"
            name="availability"
            value={form.availability || ""}
            onChange={onChange}
            disabled={!editing}
            placeholder="e.g., Available immediately, 2 weeks notice"
            className={`w-full border border-gray-300 rounded px-3 sm:px-4 py-2 responsive-text-sm ${
              editing ? "bg-white focus:ring-2 focus:ring-primary focus:border-primary" : "bg-gray-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
