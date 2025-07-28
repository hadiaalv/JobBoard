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
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your <span className="text-primary dark:text-primary-foreground">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with top companies and discover opportunities that match your skills. 
              Whether you're a job seeker or employer, we make the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Link href="/auth/register">
                  <Users className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5K+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose JobBoard?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the tools and platform you need to succeed in your career journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI-powered matching system connects you with the perfect opportunities based on your skills and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Top Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with leading companies and startups that are actively hiring and growing their teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-gray-900 dark:text-white">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Join a community of professionals, get career advice, and network with industry experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through JobBoard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">
                <Users className="mr-2 h-5 w-5" />
                Create Account
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Link href="/jobs">
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">JobBoard</h3>
                <p className="text-gray-400">
                  Connecting talent with opportunity. Find your next career move with us.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Job Seekers</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/jobs" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Create Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Employers</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/jobs/create" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Employer Signup
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Manage Jobs
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <Link href="/contact-us" className="text-white hover:text-blue-500 transition-colors duration-200">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-500 transition-colors duration-200">
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