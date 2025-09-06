import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Types
export interface StudentProfile {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  gpa?: number
  sat_score?: number
  act_score?: number
  high_school?: string
  graduation_year?: number
  date_of_birth?: string
  state?: string
  country?: string
  intended_major?: string
  extracurriculars?: string[]
  achievements?: string[]
  is_active: boolean
  profile_completed: boolean
  created_at: string
  updated_at?: string
}

export interface CreateStudentProfile {
  email: string
  first_name: string
  last_name: string
  phone?: string
  gpa?: number
  sat_score?: number
  act_score?: number
  high_school?: string
  graduation_year?: number
  date_of_birth?: string
  state?: string
  country?: string
  intended_major?: string
  extracurriculars?: string[]
  achievements?: string[]
}

export interface CollegeMatch {
  college_id: number
  college_name: string
  match_score: number
  match_reasons: string[]
}

export interface Essay {
  id: string
  student_id: number
  title: string
  content: string
  essay_type: string
  status: string
  college_id?: number
  prompt?: string
  word_limit?: number
  word_count: number
  created_at: string
  updated_at: string
}

export interface CreateEssay {
  student_id: number
  title: string
  content: string
  essay_type: string
  college_id?: number
  prompt?: string
  word_limit?: number
}

export interface EssayReview {
  essay_id: string
  overall_score: number
  feedback: Record<string, string>
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  grammar_issues: Array<{ issue: string; location: string }>
  reviewed_at: string
  reviewer: string
}

export interface Notification {
  id: number
  student_id: number
  title: string
  message: string
  notification_type: string
  channel: string
  status: string
  scheduled_at?: string
  sent_at?: string
  read_at?: string
  retry_count: number
  created_at: string
  updated_at?: string
}

// Student API
export const studentApi = {
  create: async (data: CreateStudentProfile): Promise<StudentProfile> => {
    const response = await api.post('/api/v1/students/', data)
    return response.data
  },

  get: async (id: number): Promise<StudentProfile> => {
    const response = await api.get(`/api/v1/students/${id}`)
    return response.data
  },

  update: async (id: number, data: Partial<CreateStudentProfile>): Promise<StudentProfile> => {
    const response = await api.put(`/api/v1/students/${id}`, data)
    return response.data
  },

  getByEmail: async (email: string): Promise<StudentProfile> => {
    const response = await api.get(`/api/v1/students/email/${email}`)
    return response.data
  },

  search: async (query: string, skip = 0, limit = 50): Promise<StudentProfile[]> => {
    const response = await api.get('/api/v1/students/search/', {
      params: { q: query, skip, limit }
    })
    return response.data
  },
}

// College Matching API
export const collegeApi = {
  match: async (studentId: number, preferences?: any): Promise<CollegeMatch[]> => {
    const response = await api.post('/api/v1/matching/match', {
      student_id: studentId,
      preferences
    })
    return response.data
  },

  getRecommendations: async (studentId: number, limit = 10): Promise<CollegeMatch[]> => {
    const response = await api.get(`/api/v1/matching/recommendations/${studentId}`, {
      params: { limit }
    })
    return response.data
  },

  getAdmissionProbability: async (studentId: number, collegeId: number): Promise<{ probability: number }> => {
    const response = await api.get(`/api/v1/matching/probability/${studentId}/${collegeId}`)
    return response.data
  },
}

// Essay API
export const essayApi = {
  create: async (data: CreateEssay): Promise<Essay> => {
    const response = await api.post('/api/v1/essays/', data)
    return response.data
  },

  get: async (id: string): Promise<Essay> => {
    const response = await api.get(`/api/v1/essays/${id}`)
    return response.data
  },

  update: async (id: string, data: Partial<CreateEssay>): Promise<Essay> => {
    const response = await api.put(`/api/v1/essays/${id}`, data)
    return response.data
  },

  getByStudent: async (studentId: number): Promise<Essay[]> => {
    const response = await api.get(`/api/v1/essays/student/${studentId}`)
    return response.data
  },

  review: async (essayId: string, reviewType = 'comprehensive'): Promise<EssayReview> => {
    const response = await api.post('/api/v1/essays/review', {
      essay_id: essayId,
      review_type: reviewType
    })
    return response.data
  },

  getAnalytics: async (essayId: string): Promise<any> => {
    const response = await api.get(`/api/v1/essays/${essayId}/analytics`)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/essays/${id}`)
  },
}

// Notification API
export const notificationApi = {
  create: async (data: any): Promise<Notification> => {
    const response = await api.post('/api/v1/notifications/', data)
    return response.data
  },

  get: async (id: number): Promise<Notification> => {
    const response = await api.get(`/api/v1/notifications/${id}`)
    return response.data
  },

  getByStudent: async (studentId: number, status?: string, limit = 50): Promise<Notification[]> => {
    const response = await api.get(`/api/v1/notifications/student/${studentId}`, {
      params: { status, limit }
    })
    return response.data
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await api.post(`/api/v1/notifications/${id}/read`)
    return response.data
  },

  send: async (id: number): Promise<void> => {
    await api.post(`/api/v1/notifications/${id}/send`)
  },
}
