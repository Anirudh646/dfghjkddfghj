'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  DollarSign, 
  GraduationCap,
  Star,
  TrendingUp,
  Award,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Mock college data with comprehensive information
const mockColleges = [
  {
    id: 1,
    name: 'Stanford University',
    location: 'Stanford, CA',
    type: 'Private',
    enrollment: 17249,
    acceptanceRate: 4.3,
    tuitionInState: 57693,
    tuitionOutState: 57693,
    avgSAT: 1520,
    avgACT: 34,
    avgGPA: 4.18,
    ranking: 6,
    matchScore: 92,
    matchReasons: [
      'Strong Computer Science program',
      'Excellent research opportunities',
      'Great entrepreneurship ecosystem',
      'Your SAT score is competitive'
    ],
    majors: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    highlights: ['Top-tier research', 'Silicon Valley location', 'Strong alumni network'],
    image: '/placeholder-college.jpg',
    website: 'https://stanford.edu',
    admissionProbability: 15,
    deadlines: {
      earlyAction: 'November 1',
      regularDecision: 'January 2'
    },
    financialAid: {
      averageAid: 58000,
      needMet: 100,
      needBased: true
    }
  },
  {
    id: 2,
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    type: 'Public',
    enrollment: 45057,
    acceptanceRate: 17.5,
    tuitionInState: 14226,
    tuitionOutState: 44007,
    avgSAT: 1430,
    avgACT: 32,
    avgGPA: 3.89,
    ranking: 22,
    matchScore: 88,
    matchReasons: [
      'Strong academic reputation',
      'Diverse student body',
      'Excellent engineering programs',
      'In-state tuition advantage'
    ],
    majors: ['Engineering', 'Computer Science', 'Economics', 'Psychology'],
    highlights: ['Public Ivy', 'Research powerhouse', 'Bay Area location'],
    image: '/placeholder-college.jpg',
    website: 'https://berkeley.edu',
    admissionProbability: 28,
    deadlines: {
      earlyAction: null,
      regularDecision: 'November 30'
    },
    financialAid: {
      averageAid: 22000,
      needMet: 85,
      needBased: true
    }
  },
  {
    id: 3,
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    type: 'Private',
    enrollment: 11934,
    acceptanceRate: 7.3,
    tuitionInState: 57986,
    tuitionOutState: 57986,
    avgSAT: 1550,
    avgACT: 35,
    avgGPA: 4.17,
    ranking: 2,
    matchScore: 85,
    matchReasons: [
      'World-class STEM programs',
      'Innovation and entrepreneurship focus',
      'Cutting-edge research facilities',
      'Strong industry connections'
    ],
    majors: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    highlights: ['STEM excellence', 'Innovation hub', 'Nobel laureate faculty'],
    image: '/placeholder-college.jpg',
    website: 'https://mit.edu',
    admissionProbability: 12,
    deadlines: {
      earlyAction: 'November 1',
      regularDecision: 'January 1'
    },
    financialAid: {
      averageAid: 53000,
      needMet: 100,
      needBased: true
    }
  },
  {
    id: 4,
    name: 'University of Michigan - Ann Arbor',
    location: 'Ann Arbor, MI',
    type: 'Public',
    enrollment: 48090,
    acceptanceRate: 23.0,
    tuitionInState: 15948,
    tuitionOutState: 52266,
    avgSAT: 1420,
    avgACT: 32,
    avgGPA: 3.88,
    ranking: 23,
    matchScore: 82,
    matchReasons: [
      'Strong across multiple disciplines',
      'Great school spirit and athletics',
      'Excellent alumni network',
      'Good financial aid for out-of-state'
    ],
    majors: ['Business', 'Engineering', 'Psychology', 'Economics'],
    highlights: ['Big Ten athletics', 'Research university', 'Vibrant campus life'],
    image: '/placeholder-college.jpg',
    website: 'https://umich.edu',
    admissionProbability: 35,
    deadlines: {
      earlyAction: 'November 1',
      regularDecision: 'February 1'
    },
    financialAid: {
      averageAid: 16000,
      needMet: 90,
      needBased: true
    }
  },
  {
    id: 5,
    name: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA',
    type: 'Private',
    enrollment: 14799,
    acceptanceRate: 17.1,
    tuitionInState: 59710,
    tuitionOutState: 59710,
    avgSAT: 1510,
    avgACT: 34,
    avgGPA: 3.95,
    ranking: 25,
    matchScore: 79,
    matchReasons: [
      'Top computer science program',
      'Strong engineering and arts programs',
      'Good industry connections',
      'Innovative curriculum'
    ],
    majors: ['Computer Science', 'Engineering', 'Drama', 'Business'],
    highlights: ['CS excellence', 'Interdisciplinary approach', 'Tech industry pipeline'],
    image: '/placeholder-college.jpg',
    website: 'https://cmu.edu',
    admissionProbability: 25,
    deadlines: {
      earlyDecision: 'November 1',
      regularDecision: 'January 3'
    },
    financialAid: {
      averageAid: 42000,
      needMet: 88,
      needBased: true
    }
  }
]

const filters = {
  type: ['All', 'Public', 'Private'],
  size: ['All', 'Small (<5k)', 'Medium (5k-15k)', 'Large (15k+)'],
  location: ['All', 'West Coast', 'East Coast', 'Midwest', 'South'],
  selectivity: ['All', 'Most Selective (<10%)', 'Selective (10-25%)', 'Moderate (25-50%)', 'Less Selective (50%+)']
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState(mockColleges)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'All',
    size: 'All',
    location: 'All',
    selectivity: 'All'
  })
  const [sortBy, setSortBy] = useState('matchScore')
  const [savedColleges, setSavedColleges] = useState<number[]>([])
  const [expandedCollege, setExpandedCollege] = useState<number | null>(null)

  const handleSaveCollege = (collegeId: number) => {
    setSavedColleges(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : [...prev, collegeId]
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600'
    if (score >= 80) return 'text-primary-600'
    if (score >= 70) return 'text-warning-600'
    return 'text-error-600'
  }

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success-100 text-success-800'
    if (score >= 80) return 'bg-primary-100 text-primary-800'
    if (score >= 70) return 'bg-warning-100 text-warning-800'
    return 'bg-error-100 text-error-800'
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 50) return 'text-success-600'
    if (probability >= 25) return 'text-warning-600'
    return 'text-error-600'
  }

  const filteredColleges = colleges
    .filter(college => {
      if (searchTerm && !college.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      if (selectedFilters.type !== 'All' && college.type !== selectedFilters.type) {
        return false
      }
      
      if (selectedFilters.selectivity !== 'All') {
        const rate = college.acceptanceRate
        switch (selectedFilters.selectivity) {
          case 'Most Selective (<10%)': return rate < 10
          case 'Selective (10-25%)': return rate >= 10 && rate < 25
          case 'Moderate (25-50%)': return rate >= 25 && rate < 50
          case 'Less Selective (50%+)': return rate >= 50
        }
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'matchScore': return b.matchScore - a.matchScore
        case 'ranking': return a.ranking - b.ranking
        case 'acceptance': return a.acceptanceRate - b.acceptanceRate
        case 'tuition': return a.tuitionOutState - b.tuitionOutState
        default: return 0
      }
    })

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
              College Matches & Recommendations
            </h1>
            <p className="text-secondary-600">
              Discover colleges that match your profile and preferences
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                className="input-field w-32"
              >
                {filters.type.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <select
                value={selectedFilters.selectivity}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, selectivity: e.target.value }))}
                className="input-field w-48"
              >
                {filters.selectivity.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-40"
              >
                <option value="matchScore">Best Match</option>
                <option value="ranking">Ranking</option>
                <option value="acceptance">Acceptance Rate</option>
                <option value="tuition">Tuition</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-secondary-600">
              Found {filteredColleges.length} colleges matching your criteria
            </p>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </motion.div>

        {/* College List */}
        <div className="space-y-6">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                      {college.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{college.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{college.enrollment.toLocaleString()} students</span>
                      </div>
                      <span className="badge badge-info">{college.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchScoreColor(college.matchScore)}`}>
                      {college.matchScore}%
                    </div>
                    <div className="text-xs text-secondary-500">Match Score</div>
                  </div>
                  <button
                    onClick={() => handleSaveCollege(college.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedColleges.includes(college.id)
                        ? 'bg-error-100 text-error-600'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-error-100 hover:text-error-600'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${savedColleges.includes(college.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="text-lg font-semibold text-secondary-900">#{college.ranking}</div>
                  <div className="text-xs text-secondary-600">National Ranking</div>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="text-lg font-semibold text-secondary-900">{college.acceptanceRate}%</div>
                  <div className="text-xs text-secondary-600">Acceptance Rate</div>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="text-lg font-semibold text-secondary-900">{college.avgSAT}</div>
                  <div className="text-xs text-secondary-600">Avg SAT</div>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="text-lg font-semibold text-secondary-900">
                    ${college.type === 'Public' ? college.tuitionInState.toLocaleString() : college.tuitionOutState.toLocaleString()}
                  </div>
                  <div className="text-xs text-secondary-600">Tuition</div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="mb-4">
                <h4 className="font-medium text-secondary-900 mb-2">Why this is a good match:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {college.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-secondary-700">
                      <Star className="h-4 w-4 text-warning-500 fill-current" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                <div className="flex items-center space-x-4">
                  <div className={`${getMatchScoreBg(college.matchScore)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {college.matchScore >= 90 ? 'Excellent Match' : 
                     college.matchScore >= 80 ? 'Good Match' : 
                     college.matchScore >= 70 ? 'Fair Match' : 'Reach School'}
                  </div>
                  <div className={`text-sm ${getProbabilityColor(college.admissionProbability)}`}>
                    {college.admissionProbability}% admission probability
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setExpandedCollege(expandedCollege === college.id ? null : college.id)}
                    className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <span>Details</span>
                    {expandedCollege === college.id ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Website
                  </Button>
                  <Button size="sm">
                    Add to List
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCollege === college.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-secondary-200"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold text-secondary-900 mb-3">Popular Majors</h5>
                      <div className="space-y-2">
                        {college.majors.map((major, idx) => (
                          <div key={idx} className="text-sm text-secondary-700">
                            • {major}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-secondary-900 mb-3">Application Deadlines</h5>
                      <div className="space-y-2 text-sm">
                        {college.deadlines.earlyAction && (
                          <div className="flex justify-between">
                            <span className="text-secondary-600">Early Action:</span>
                            <span className="text-secondary-900">{college.deadlines.earlyAction}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Regular Decision:</span>
                          <span className="text-secondary-900">{college.deadlines.regularDecision}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-secondary-900 mb-3">Financial Aid</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Average Aid:</span>
                          <span className="text-secondary-900">${college.financialAid.averageAid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Need Met:</span>
                          <span className="text-secondary-900">{college.financialAid.needMet}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-semibold text-secondary-900 mb-3">Key Highlights</h5>
                    <div className="flex flex-wrap gap-2">
                      {college.highlights.map((highlight, idx) => (
                        <span key={idx} className="badge badge-info">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              Want More Personalized Recommendations?
            </h3>
            <p className="text-secondary-600 mb-6">
              Complete your profile to get better matches and admission probability calculations.
            </p>
            <Button>Update Your Profile</Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
