'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Upload,
  Download,
  Star,
  TrendingUp,
  BookOpen,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Mock essay data
const mockEssays = [
  {
    id: '1',
    title: 'Common Application Personal Statement',
    type: 'Personal Statement',
    status: 'reviewed',
    wordCount: 649,
    wordLimit: 650,
    lastModified: '2 hours ago',
    college: 'Common Application',
    prompt: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.',
    overallScore: 8.5,
    feedback: {
      structure: 'Strong opening and conclusion, good flow between paragraphs',
      content: 'Compelling personal narrative that shows growth and reflection',
      grammar: 'Minor grammatical errors, overall well-written',
      impact: 'Memorable story that effectively demonstrates character'
    },
    strengths: [
      'Authentic voice and personal perspective',
      'Clear narrative arc showing growth',
      'Specific examples and details'
    ],
    improvements: [
      'Strengthen transition between paragraphs 2 and 3',
      'Consider adding more reflection in the conclusion',
      'Fix minor grammar issues in paragraph 4'
    ]
  },
  {
    id: '2',
    title: 'Why Stanford Engineering Essay',
    type: 'Supplemental',
    status: 'draft',
    wordCount: 245,
    wordLimit: 250,
    lastModified: '1 day ago',
    college: 'Stanford University',
    prompt: 'Why are you interested in studying engineering at Stanford?',
    overallScore: null,
    feedback: null,
    strengths: [],
    improvements: []
  },
  {
    id: '3',
    title: 'MIT Research Interest Essay',
    type: 'Supplemental',
    status: 'in-progress',
    wordCount: 156,
    wordLimit: 200,
    lastModified: '3 days ago',
    college: 'Massachusetts Institute of Technology',
    prompt: 'Describe your research interests and how they align with MIT.',
    overallScore: null,
    feedback: null,
    strengths: [],
    improvements: []
  }
]

const essayTypes = [
  { value: 'personal-statement', label: 'Personal Statement', description: 'Common App and similar essays' },
  { value: 'supplemental', label: 'Supplemental Essay', description: 'School-specific essays' },
  { value: 'scholarship', label: 'Scholarship Essay', description: 'Scholarship application essays' },
  { value: 'honors', label: 'Honors Program', description: 'Honors college applications' }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'reviewed': return <CheckCircle className="h-5 w-5 text-success-600" />
    case 'in-progress': return <Clock className="h-5 w-5 text-warning-600" />
    case 'draft': return <Edit3 className="h-5 w-5 text-secondary-400" />
    default: return <FileText className="h-5 w-5 text-secondary-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'reviewed': return 'badge-success'
    case 'in-progress': return 'badge-warning'
    case 'draft': return 'badge badge-info'
    default: return 'badge'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 8.5) return 'text-success-600'
  if (score >= 7.0) return 'text-primary-600'
  if (score >= 5.5) return 'text-warning-600'
  return 'text-error-600'
}

export default function EssaysPage() {
  const [essays, setEssays] = useState(mockEssays)
  const [showNewEssayModal, setShowNewEssayModal] = useState(false)
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null)
  const [newEssay, setNewEssay] = useState({
    title: '',
    type: 'personal-statement',
    college: '',
    prompt: '',
    wordLimit: 650
  })

  const handleCreateEssay = () => {
    // In real app, this would call the API
    console.log('Creating essay:', newEssay)
    setShowNewEssayModal(false)
    setNewEssay({ title: '', type: 'personal-statement', college: '', prompt: '', wordLimit: 650 })
  }

  const handleDeleteEssay = (essayId: string) => {
    setEssays(prev => prev.filter(essay => essay.id !== essayId))
  }

  const totalEssays = essays.length
  const reviewedEssays = essays.filter(e => e.status === 'reviewed').length
  const averageScore = essays
    .filter(e => e.overallScore)
    .reduce((acc, e) => acc + (e.overallScore || 0), 0) / 
    essays.filter(e => e.overallScore).length || 0

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
              <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                Essay Center
              </h1>
              <p className="text-secondary-600">
                Write, review, and perfect your college application essays
              </p>
            </motion.div>
            <Button onClick={() => setShowNewEssayModal(true)}>
              <Plus className="h-5 w-5 mr-2" />
              New Essay
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-900">{totalEssays}</div>
            <div className="text-sm text-secondary-600">Total Essays</div>
          </div>
          <div className="card text-center">
            <CheckCircle className="h-8 w-8 text-success-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-900">{reviewedEssays}</div>
            <div className="text-sm text-secondary-600">Reviewed</div>
          </div>
          <div className="card text-center">
            <Star className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-900">
              {averageScore ? averageScore.toFixed(1) : '--'}
            </div>
            <div className="text-sm text-secondary-600">Average Score</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-error-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-900">
              {totalEssays - reviewedEssays}
            </div>
            <div className="text-sm text-secondary-600">In Progress</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Essays List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Your Essays</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {essays.map((essay, index) => (
                  <motion.div
                    key={essay.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${
                      selectedEssay === essay.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedEssay(essay.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(essay.status)}
                        <div>
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            {essay.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-secondary-600">
                            <span className={getStatusColor(essay.status)}>
                              {essay.status.replace('-', ' ')}
                            </span>
                            <span>{essay.college}</span>
                            <span>•</span>
                            <span>{essay.lastModified}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {essay.overallScore && (
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(essay.overallScore)}`}>
                              {essay.overallScore}/10
                            </div>
                            <div className="text-xs text-secondary-500">Score</div>
                          </div>
                        )}
                        <div className="flex space-x-1">
                          <button className="p-2 text-secondary-400 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-secondary-400 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEssay(essay.id)
                            }}
                            className="p-2 text-secondary-400 hover:text-error-600 rounded-lg hover:bg-error-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-secondary-600 mb-2">
                        <span>Word Count</span>
                        <span className={essay.wordCount > essay.wordLimit ? 'text-error-600' : 'text-secondary-600'}>
                          {essay.wordCount} / {essay.wordLimit}
                        </span>
                      </div>
                      <div className="bg-secondary-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            essay.wordCount > essay.wordLimit ? 'bg-error-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${Math.min((essay.wordCount / essay.wordLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-secondary-700 line-clamp-2">
                      {essay.prompt}
                    </div>

                    {essay.status === 'reviewed' && (
                      <div className="mt-4 pt-4 border-t border-secondary-200">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-success-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>AI Review Complete</span>
                          </div>
                          <Button variant="outline" size="sm">
                            View Feedback
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {essays.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">No essays yet</h3>
                    <p className="text-secondary-600 mb-6">
                      Start writing your first college application essay.
                    </p>
                    <Button onClick={() => setShowNewEssayModal(true)}>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Essay
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Essay Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-secondary-900">Writing Tips</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <div className="font-medium text-primary-900 mb-1">Show, Don't Tell</div>
                  <div className="text-primary-700">Use specific examples and anecdotes to illustrate your points.</div>
                </div>
                <div className="p-3 bg-success-50 rounded-lg">
                  <div className="font-medium text-success-900 mb-1">Be Authentic</div>
                  <div className="text-success-700">Write in your own voice and share genuine experiences.</div>
                </div>
                <div className="p-3 bg-warning-50 rounded-lg">
                  <div className="font-medium text-warning-900 mb-1">Stay Focused</div>
                  <div className="text-warning-700">Answer the prompt directly and avoid going off-topic.</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="font-semibold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Writing Help
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Examples
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Google Docs
                </Button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="font-semibold text-secondary-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-success-600 mt-0.5" />
                  <div>
                    <div className="text-secondary-900">Essay review completed</div>
                    <div className="text-secondary-500">Common App essay - 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Edit3 className="h-4 w-4 text-warning-600 mt-0.5" />
                  <div>
                    <div className="text-secondary-900">Draft saved</div>
                    <div className="text-secondary-500">Stanford essay - 1 day ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Plus className="h-4 w-4 text-primary-600 mt-0.5" />
                  <div>
                    <div className="text-secondary-900">New essay created</div>
                    <div className="text-secondary-500">MIT essay - 3 days ago</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* New Essay Modal */}
      {showNewEssayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">Create New Essay</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Essay Title
                </label>
                <input
                  type="text"
                  value={newEssay.title}
                  onChange={(e) => setNewEssay(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., Common App Personal Statement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Essay Type
                </label>
                <select
                  value={newEssay.type}
                  onChange={(e) => setNewEssay(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  {essayTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  College/Application
                </label>
                <input
                  type="text"
                  value={newEssay.college}
                  onChange={(e) => setNewEssay(prev => ({ ...prev, college: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., Stanford University"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Word Limit
                </label>
                <input
                  type="number"
                  value={newEssay.wordLimit}
                  onChange={(e) => setNewEssay(prev => ({ ...prev, wordLimit: parseInt(e.target.value) }))}
                  className="input-field"
                  min="50"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Essay Prompt
                </label>
                <textarea
                  value={newEssay.prompt}
                  onChange={(e) => setNewEssay(prev => ({ ...prev, prompt: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Paste the essay prompt here..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewEssayModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCreateEssay}
                disabled={!newEssay.title || !newEssay.college}
              >
                Create Essay
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
