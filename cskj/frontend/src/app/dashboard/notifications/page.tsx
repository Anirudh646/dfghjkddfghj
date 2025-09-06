'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell,
  Calendar,
  Mail,
  Smartphone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  X,
  Settings,
  Filter,
  Archive,
  Star,
  School,
  FileText,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'Harvard Application Deadline Approaching',
    message: 'Your Harvard University application is due in 5 days. Make sure to submit all required documents.',
    type: 'deadline',
    priority: 'high',
    status: 'unread',
    timestamp: '2 hours ago',
    actionUrl: '/dashboard/applications/harvard',
    category: 'Applications',
    icon: Calendar,
    color: 'text-error-600',
    bgColor: 'bg-error-50'
  },
  {
    id: 2,
    title: 'Essay Review Completed',
    message: 'Your Common Application personal statement has been reviewed. Overall score: 8.5/10. View detailed feedback and suggestions.',
    type: 'essay_review',
    priority: 'medium',
    status: 'unread',
    timestamp: '4 hours ago',
    actionUrl: '/dashboard/essays/1',
    category: 'Essays',
    icon: FileText,
    color: 'text-success-600',
    bgColor: 'bg-success-50'
  },
  {
    id: 3,
    title: 'New College Matches Found',
    message: 'Based on your updated profile, we found 3 new colleges that match your preferences. Explore these recommendations.',
    type: 'college_match',
    priority: 'medium',
    status: 'read',
    timestamp: '1 day ago',
    actionUrl: '/dashboard/colleges',
    category: 'College Matching',
    icon: School,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  },
  {
    id: 4,
    title: 'FAFSA Reminder',
    message: 'Don\'t forget to submit your FAFSA application. The priority deadline is approaching.',
    type: 'reminder',
    priority: 'high',
    status: 'read',
    timestamp: '2 days ago',
    actionUrl: '/dashboard/financial-aid',
    category: 'Financial Aid',
    icon: DollarSign,
    color: 'text-warning-600',
    bgColor: 'bg-warning-50'
  },
  {
    id: 5,
    title: 'Profile Completion Milestone',
    message: 'Congratulations! Your profile is now 95% complete. Add SAT Subject Test scores to reach 100%.',
    type: 'update',
    priority: 'low',
    status: 'read',
    timestamp: '3 days ago',
    actionUrl: '/dashboard/profile',
    category: 'Profile',
    icon: CheckCircle,
    color: 'text-success-600',
    bgColor: 'bg-success-50'
  },
  {
    id: 6,
    title: 'Scholarship Opportunity',
    message: 'You qualify for the Merit Scholarship at University of Michigan. Application deadline: December 1st.',
    type: 'scholarship',
    priority: 'medium',
    status: 'archived',
    timestamp: '1 week ago',
    actionUrl: '/dashboard/scholarships',
    category: 'Scholarships',
    icon: Star,
    color: 'text-warning-600',
    bgColor: 'bg-warning-50'
  }
]

const notificationTypes = [
  { value: 'all', label: 'All Notifications', count: mockNotifications.length },
  { value: 'deadline', label: 'Deadlines', count: mockNotifications.filter(n => n.type === 'deadline').length },
  { value: 'essay_review', label: 'Essay Reviews', count: mockNotifications.filter(n => n.type === 'essay_review').length },
  { value: 'college_match', label: 'College Matches', count: mockNotifications.filter(n => n.type === 'college_match').length },
  { value: 'reminder', label: 'Reminders', count: mockNotifications.filter(n => n.type === 'reminder').length }
]

const priorityFilters = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
]

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  const filteredNotifications = notifications.filter(notification => {
    if (selectedType !== 'all' && notification.type !== selectedType) return false
    if (selectedPriority !== 'all' && notification.priority !== selectedPriority) return false
    if (selectedStatus !== 'all' && notification.status !== selectedStatus) return false
    return true
  })

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'read' } : n
    ))
  }

  const handleMarkAsUnread = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'unread' } : n
    ))
  }

  const handleArchive = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'archived' } : n
    ))
  }

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-error-600" />
      case 'medium': return <Info className="h-4 w-4 text-warning-600" />
      case 'low': return <Clock className="h-4 w-4 text-secondary-400" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3">
                <Bell className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Notifications
                  </h1>
                  <p className="text-secondary-600">
                    Stay updated with important deadlines and updates
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  Mark All as Read ({unreadCount})
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Notification Types */}
              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {notificationTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedType === type.value
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-secondary-50 text-secondary-700'
                      }`}
                    >
                      <span>{type.label}</span>
                      <span className="text-sm">{type.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Priority</h3>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="input-field"
                >
                  {priorityFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Status</h3>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  {statusFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600">Unread</span>
                    <span className="font-medium text-secondary-900">{unreadCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600">High Priority</span>
                    <span className="font-medium text-error-600">
                      {notifications.filter(n => n.priority === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600">This Week</span>
                    <span className="font-medium text-secondary-900">
                      {notifications.filter(n => 
                        ['2 hours ago', '4 hours ago', '1 day ago', '2 days ago', '3 days ago'].includes(n.timestamp)
                      ).length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  {selectedType === 'all' ? 'All Notifications' : 
                   notificationTypes.find(t => t.value === selectedType)?.label}
                  <span className="text-secondary-500 ml-2">({filteredNotifications.length})</span>
                </h2>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Selected
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-secondary-600">
                      {selectedType === 'all' 
                        ? "You're all caught up! No new notifications."
                        : "No notifications match the selected filters."
                      }
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`card hover:shadow-lg transition-all duration-200 ${
                        notification.status === 'unread' ? 'bg-white ring-2 ring-primary-100' : 'bg-secondary-50'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${notification.bgColor}`}>
                          <notification.icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h3 className={`font-semibold ${
                                notification.status === 'unread' ? 'text-secondary-900' : 'text-secondary-700'
                              }`}>
                                {notification.title}
                              </h3>
                              {getPriorityIcon(notification.priority)}
                              {notification.status === 'unread' && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-secondary-500">{notification.timestamp}</span>
                              <div className="flex space-x-1">
                                {notification.status === 'unread' ? (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="p-1 text-secondary-400 hover:text-primary-600 rounded"
                                    title="Mark as read"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleMarkAsUnread(notification.id)}
                                    className="p-1 text-secondary-400 hover:text-primary-600 rounded"
                                    title="Mark as unread"
                                  >
                                    <Mail className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleArchive(notification.id)}
                                  className="p-1 text-secondary-400 hover:text-warning-600 rounded"
                                  title="Archive"
                                >
                                  <Archive className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="p-1 text-secondary-400 hover:text-error-600 rounded"
                                  title="Delete"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-secondary-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="badge badge-info">{notification.category}</span>
                              <span className={`badge ${
                                notification.priority === 'high' ? 'badge-error' :
                                notification.priority === 'medium' ? 'badge-warning' : 'badge'
                              }`}>
                                {notification.priority} priority
                              </span>
                            </div>
                            
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">Notification Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Mail className="h-5 w-5 text-secondary-400" />
                    <span>Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Smartphone className="h-5 w-5 text-secondary-400" />
                    <span>Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>Application deadlines</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Essay reviews completed</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>New college matches</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Scholarship opportunities</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Profile reminders</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Frequency</h4>
                <select className="input-field">
                  <option>Immediately</option>
                  <option>Daily digest</option>
                  <option>Weekly digest</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-6 border-t border-secondary-200">
              <Button variant="outline" className="flex-1" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => setShowSettings(false)}>
                Save Settings
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
