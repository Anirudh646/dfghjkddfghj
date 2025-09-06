'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Brain, 
  FileText, 
  Bell,
  ArrowRight,
  Star,
  Users,
  Award,
  MessageCircle
} from 'lucide-react'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: GraduationCap,
      title: "Smart College Matching",
      description: "AI-powered recommendations based on your profile, preferences, and academic achievements.",
      color: "text-primary-600"
    },
    {
      icon: FileText,
      title: "Essay Review & Feedback",
      description: "Get detailed feedback on your college essays from our advanced AI writing assistant.",
      color: "text-success-600"
    },
    {
      icon: Brain,
      title: "Personalized Guidance",
      description: "Receive tailored advice and insights to maximize your admission chances.",
      color: "text-warning-600"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss important deadlines with our intelligent notification system.",
      color: "text-error-600"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Students Helped" },
    { number: "500+", label: "Partner Colleges" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-display font-bold text-xl text-gradient">
                AI Admission Counsellor
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/qa" className="text-secondary-600 hover:text-primary-600 transition-colors">
                Q&A Center
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-display font-bold text-secondary-900 mb-6"
            >
              Your AI-Powered Path to{' '}
              <span className="text-gradient">College Success</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto"
            >
              Get personalized college recommendations, essay feedback, and admission guidance 
              powered by advanced AI technology. Your journey to the perfect college starts here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/qa" className="btn-outline text-lg px-8 py-3">
                Explore Q&A
                <MessageCircle className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Everything You Need for College Success
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and guidance you need 
              to navigate the college admission process with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setActiveFeature(index)}
                className="card hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Your College Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who have already discovered their perfect college match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-white text-primary-600 hover:bg-secondary-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Create Your Profile
              </Link>
              <Link href="/qa" className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Browse Q&A
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary-400" />
                <span className="font-display font-bold text-xl">
                  AI Admission Counsellor
                </span>
              </div>
              <p className="text-secondary-400">
                Empowering students with AI-driven college admission guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-secondary-400">
                <li>College Matching</li>
                <li>Essay Review</li>
                <li>Profile Management</li>
                <li>Notifications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-secondary-400">
                <li>Q&A Center</li>
                <li>College Database</li>
                <li>Admission Tips</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-12 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 AI Admission Counsellor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
