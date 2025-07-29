"use client";

interface PortfolioDisplayProps {
  user: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    skills?: string[];
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
  };
}

export default function PortfolioDisplay({ user }: PortfolioDisplayProps) {
  const hasPortfolioData = 
    user.skills?.length || 
    user.experience || 
    user.education || 
    user.interests || 
    user.languages || 
    user.certifications || 
    user.projects || 
    user.linkedin || 
    user.github || 
    user.portfolio || 
    user.yearsOfExperience || 
    user.preferredWorkType || 
    user.salaryExpectation || 
    user.availability;

  if (!hasPortfolioData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No portfolio information available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Portfolio & Professional Details</h3>
      
      {/* Contact Information */}
      {(user.location || user.phone || user.website) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {user.location && (
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{user.location}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            {user.website && (
              <div>
                <span className="text-gray-600">Website:</span>
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.yearsOfExperience && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Years of Experience</h4>
            <p className="text-gray-700">{user.yearsOfExperience} years</p>
          </div>
        )}
        {user.preferredWorkType && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Preferred Work Type</h4>
            <p className="text-gray-700 capitalize">{user.preferredWorkType.replace('_', ' ')}</p>
          </div>
        )}
      </div>

      {/* Work Experience */}
      {user.experience && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Work Experience</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{user.experience}</p>
        </div>
      )}

      {/* Education */}
      {user.education && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Education</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{user.education}</p>
        </div>
      )}

      {/* Professional Links */}
      {(user.linkedin || user.github || user.portfolio) && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Professional Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {user.linkedin && (
              <a 
                href={user.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {user.github && (
              <a 
                href={user.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {user.portfolio && (
              <a 
                href={user.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Portfolio
              </a>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.languages && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Languages</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{user.languages}</p>
          </div>
        )}
        {user.certifications && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Certifications</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{user.certifications}</p>
          </div>
        )}
      </div>

      {/* Projects */}
      {user.projects && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Projects</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{user.projects}</p>
        </div>
      )}

      {/* Interests */}
      {user.interests && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Interests & Hobbies</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{user.interests}</p>
        </div>
      )}

      {/* Career Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.salaryExpectation && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Salary Expectation</h4>
            <p className="text-gray-700">{user.salaryExpectation}</p>
          </div>
        )}
        {user.availability && (
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Availability</h4>
            <p className="text-gray-700">{user.availability}</p>
          </div>
        )}
      </div>
    </div>
  );
}