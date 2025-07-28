import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Briefcase, 
  Users, 
  Building2, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
export default function HomePage() {
  return (
    <>
      <section className="gradient-bg py-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Find Your <span className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with top companies and discover opportunities that match your skills. 
              Whether you're a job seeker or employer, we make the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="interactive-button">
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5 animated-icon" />
                  Browse Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="interactive-button">
                <Link href="/auth/register">
                  <Users className="mr-2 h-5 w-5 animated-icon" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up stagger-1">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
            </div>
            <div className="animate-fade-in-up stagger-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5K+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div className="animate-fade-in-up stagger-3">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Job Seekers</div>
            </div>
            <div className="animate-fade-in-up stagger-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose JobBoard?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We provide the tools and platform you need to succeed in your career journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="gradient-card border-gray-200 dark:border-gray-700 transition-all duration-300 interactive-card animate-fade-in-up stagger-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400 animated-icon" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI-powered matching system connects you with the perfect opportunities based on your skills and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-gray-200 dark:border-gray-700 transition-all duration-300 interactive-card animate-fade-in-up stagger-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400 animated-icon" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Top Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Connect with leading companies and startups that are actively hiring and growing their teams.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-gray-200 dark:border-gray-700 transition-all duration-300 interactive-card animate-fade-in-up stagger-3">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400 animated-icon" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join a community of professionals, get career advice, and network with industry experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have found their dream jobs through JobBoard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="interactive-button">
              <Link href="/auth/register">
                <Users className="mr-2 h-5 w-5 animated-icon" />
                Create Account
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="interactive-button">
              <Link href="/jobs">
                <Briefcase className="mr-2 h-5 w-5 animated-icon" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white border-t border-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up stagger-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">JobBoard</h3>
              <p className="text-gray-400 leading-relaxed">
                Connecting talent with opportunity. Find your next career move with us.
              </p>
            </div>

            <div className="animate-fade-in-up stagger-2">
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/jobs" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up stagger-3">
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/jobs/create" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Employer Signup
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Manage Jobs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up stagger-4">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Help Center
                  </a>
                </li>
                <li>
                  <Link href="/contact-us" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105 inline-block">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 JobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}