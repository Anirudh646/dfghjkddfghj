'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  GraduationCap, 
  FileText, 
  Bell, 
  TrendingUp,
  Award,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Mock data - in real app, this would come from API
const mockStudent = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@email.com',
  gpa: 3.85,
  satScore: 1450,
  actScore: 32,
  highSchool: 'Lincoln High School',
  graduationYear: 2024,
  profileCompletion: 85,
  collegeMatches: 12,
  essaysInProgress: 3,
  notificationsCount: 5
}

const mockRecentActivity = [
  {
    id: 1,
    type: 'essay',
    title: 'Common App Essay reviewed',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-success-600'
  },
  {
    id: 2,
    type: 'match',
    title: 'New college matches found',
    time: '1 day ago',
    icon: GraduationCap,
    color: 'text-primary-600'
  },
  {
    id: 3,
    type: 'deadline',
    title: 'Harvard application due in 15 days',
    time: '2 days ago',
    icon: Calendar,
    color: 'text-warning-600'
  }
]

const quickActions = [
  {
    title: 'Complete Profile',
    description: 'Add missing information to get better matches',
    href: '/dashboard/profile',
    icon: User,
    color: 'bg-primary-600',
    progress: mockStudent.profileCompletion
  },
  {
    title: 'Find Colleges',
    description: 'Discover colleges that match your profile',
    href: '/dashboard/colleges',
    icon: GraduationCap,
    color: 'bg-success-600'
  },
  {
    title: 'Write Essays',
    description: 'Get AI-powered feedback on your essays',
    href: '/dashboard/essays',
    icon: FileText,
    color: 'bg-warning-600'
  },
  {
    title: 'Check Notifications',
    description: 'Stay updated with important deadlines',
    href: '/dashboard/notifications',
    icon: Bell,
    color: 'bg-error-600',
    badge: mockStudent.notificationsCount
  }
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-display font-bold text-xl text-gradient">
                AI Admission Counsellor
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-secondary-600" />
                {mockStudent.notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {mockStudent.notificationsCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {mockStudent.firstName.charAt(0)}{mockStudent.lastName.charAt(0)}
                </div>
                <span className="font-medium text-secondary-900">
                  {mockStudent.firstName} {mockStudent.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-secondary-900">
            {getGreeting()}, {mockStudent.firstName}! 👋
          </h1>
          <p className="text-secondary-600 mt-2">
            Let's continue building your path to college success.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Profile Completion</p>
                <p className="text-2xl font-bold text-secondary-900">{mockStudent.profileCompletion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="mt-3 bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${mockStudent.profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">GPA</p>
                <p className="text-2xl font-bold text-secondary-900">{mockStudent.gpa}</p>
              </div>
              <Award className="h-8 w-8 text-success-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">Out of 4.0</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">SAT Score</p>
                <p className="text-2xl font-bold text-secondary-900">{mockStudent.satScore}</p>
              </div>
              <Target className="h-8 w-8 text-warning-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">Out of 1600</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">College Matches</p>
                <p className="text-2xl font-bold text-secondary-900">{mockStudent.collegeMatches}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-error-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">Strong matches found</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card hover:shadow-lg transition-all duration-200 cursor-pointer relative"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${action.color} p-3 rounded-lg`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {action.description}
                        </p>
                        {action.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-secondary-600 mb-1">
                              <span>Progress</span>
                              <span>{action.progress}%</span>
                            </div>
                            <div className="bg-secondary-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${action.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {action.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-error-500 text-white text-xs rounded-full px-2 py-1">
                          {action.badge}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Recent Activity</h2>
            <div className="card">
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.color} p-2 rounded-lg`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-secondary-200">
                <Button variant="ghost" className="w-full">
                  View All Activity
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card mt-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Helpful Resources</h3>
              <div className="space-y-3">
                <Link href="/qa" className="block text-sm text-primary-600 hover:text-primary-700">
                  📚 Browse Q&A Center
                </Link>
                <Link href="/dashboard/colleges" className="block text-sm text-primary-600 hover:text-primary-700">
                  🎓 Explore Colleges
                </Link>
                <Link href="/dashboard/essays" className="block text-sm text-primary-600 hover:text-primary-700">
                  ✍️ Essay Writing Tips
                </Link>
                <Link href="/dashboard/deadlines" className="block text-sm text-primary-600 hover:text-primary-700">
                  ⏰ Important Deadlines
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
