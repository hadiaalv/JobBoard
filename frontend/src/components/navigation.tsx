'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { 
  User, 
  Briefcase, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Plus,
  Moon,
  Sun
} from 'lucide-react'

import RealTimeNotifications from './real-time-notifications'
import { useState, useEffect } from 'react'

function useThemeFallback() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = storedTheme || systemTheme
    
    setTheme(initialTheme)
    setMounted(true)
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(initialTheme)
  }, [])
  
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }

  return { theme, toggleTheme, mounted }
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useThemeFallback()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    ...(isAuthenticated 
      ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
      : []
    ),
    ...(isAuthenticated && user?.role === 'employer' 
      ? [
          { href: '/dashboard/jobs', label: 'My Jobs', icon: FileText },
          { href: '/jobs/create', label: 'Post Job', icon: Plus }
        ]
      : []
    ),
    ...(isAuthenticated && user?.role === 'job_seeker' 
      ? [{ href: '/dashboard/applications', label: 'Applications', icon: FileText }]
      : []
    ),
  ]

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-800 dark:group-hover:from-blue-300 dark:group-hover:to-blue-400 transition-all duration-300 transform group-hover:scale-105">
                JobBoard
              </h1>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800 shadow-sm'
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 animated-icon" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? <Sun className="h-5 w-5 animated-icon" /> : <Moon className="h-5 w-5 animated-icon" />}
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <RealTimeNotifications />
                <div className="text-sm text-gray-700 dark:text-gray-200 font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-3 py-1 rounded-full">
                  Welcome, {user?.firstName}!
                </div>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 transform hover:scale-105">
                    <User className="h-4 w-4 mr-2 animated-icon" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-300 transform hover:scale-105">
                  <LogOut className="h-4 w-4 mr-2 animated-icon" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 transform hover:scale-105">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? <Sun className="h-5 w-5 animated-icon" /> : <Moon className="h-5 w-5 animated-icon" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 transform hover:scale-105"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 animated-icon" />
              ) : (
                <Menu className="h-6 w-6 animated-icon" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-b-lg">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 border border-transparent'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-5 w-5 mr-3 animated-icon" />
                    {item.label}
                  </Link>
                )
              })}
              
              {isAuthenticated ? (
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  Welcome, {user?.firstName}!
                </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 rounded-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 animated-icon" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="h-5 w-5 mr-3 animated-icon" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 rounded-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 text-base font-medium text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}