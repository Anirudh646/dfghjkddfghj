'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  MessageCircle,
  Star,
  ThumbsUp,
  Filter,
  Tag,
  GraduationCap,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Award,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Comprehensive Q&A data with AI-generated responses
const qaData = [
  {
    id: 1,
    category: 'College Selection',
    question: 'How do I choose the right college for my major?',
    answer: `Choosing the right college for your major involves several key factors:

**Academic Reputation**: Research the program's ranking, faculty expertise, and curriculum. Look for programs with strong industry connections and recent curriculum updates.

**Resources & Facilities**: Consider labs, libraries, research opportunities, and technology available to students in your field.

**Career Outcomes**: Review employment rates, average starting salaries, and where graduates work. Many schools publish this data in their career services reports.

**Location & Culture**: Think about climate, urban vs. rural settings, and campus culture. These factors significantly impact your college experience.

**Financial Considerations**: Compare tuition, living costs, and available financial aid. Consider the return on investment for your specific major.

**Size & Class Format**: Decide between large research universities or smaller liberal arts colleges based on your learning preferences.

Pro tip: Attend virtual or in-person information sessions, connect with current students or alumni, and consider visiting campuses if possible.`,
    tags: ['college-selection', 'majors', 'research'],
    votes: 156,
    helpful: true,
    category_icon: GraduationCap
  },
  {
    id: 2,
    category: 'Applications',
    question: 'What makes a college application stand out?',
    answer: `A standout college application combines several elements that showcase your unique story:

**Authentic Personal Statement**: Write genuinely about experiences that shaped you. Avoid clichés and focus on specific moments that demonstrate growth, resilience, or passion.

**Strong Academic Record**: Maintain consistent grades and take challenging courses relevant to your intended major. Show an upward trend if you had early struggles.

**Meaningful Extracurriculars**: Quality over quantity. Deep involvement in 2-3 activities shows dedication and leadership potential more than superficial participation in many.

**Letters of Recommendation**: Choose recommenders who know you well and can speak to specific examples of your character, work ethic, and potential.

**Demonstrated Interest**: Research the school thoroughly and articulate why you're a good fit. Mention specific programs, professors, or opportunities that attract you.

**Unique Perspective**: Highlight what makes you different. This could be your background, experiences, perspective, or unusual combination of interests.

**Attention to Detail**: Ensure error-free applications with thoughtful responses to all prompts. Small mistakes can detract from an otherwise strong application.

Remember: Admissions officers want to see who you are beyond test scores and grades.`,
    tags: ['applications', 'essays', 'extracurriculars'],
    votes: 234,
    helpful: true,
    category_icon: FileText
  },
  {
    id: 3,
    category: 'Scholarships',
    question: 'How can I find and win scholarships?',
    answer: `Finding and winning scholarships requires a strategic approach:

**Start Early**: Begin searching in your junior year of high school. Many scholarships have early deadlines.

**Use Multiple Sources**:
- School counseling office
- College websites and financial aid offices
- Free scholarship search engines (Fastweb, Scholarships.com, College Board)
- Local community organizations, businesses, and foundations
- Professional associations in your field of interest

**Types of Scholarships**:
- Merit-based (academic achievement, test scores)
- Need-based (financial circumstances)
- Demographic-specific (ethnicity, gender, location)
- Talent-based (athletics, arts, specific skills)
- Essay contests and competitions

**Application Strategy**:
- Read requirements carefully and follow instructions exactly
- Start with local/smaller scholarships with fewer applicants
- Tailor each application to the specific scholarship
- Highlight relevant experiences and achievements
- Meet all deadlines and submit complete applications

**Essay Tips**:
- Answer the prompt directly
- Tell a compelling story with specific examples
- Show your personality and values
- Proofread carefully
- Have others review your essays

**Stay Organized**: Keep track of deadlines, requirements, and submission status using a spreadsheet or app.

**Don't Give Up**: Apply to multiple scholarships; even small amounts add up and can make a significant difference.`,
    tags: ['scholarships', 'financial-aid', 'applications'],
    votes: 189,
    helpful: true,
    category_icon: DollarSign
  },
  {
    id: 4,
    category: 'Test Prep',
    question: 'SAT vs ACT: Which test should I take?',
    answer: `Both tests are widely accepted, but they have different strengths:

**SAT Characteristics**:
- Sections: Evidence-Based Reading & Writing, Math (with/without calculator)
- Score: 400-1600 (200-800 per section)
- Length: 3 hours (3 hours 50 minutes with essay)
- Math: More algebra and data analysis, some advanced math
- Reading: More focus on evidence and reasoning

**ACT Characteristics**:
- Sections: English, Math, Reading, Science (plus optional Writing)
- Score: 1-36 composite score
- Length: 2 hours 55 minutes (3 hours 35 minutes with Writing)
- Math: More geometry and trigonometry
- Science: Tests scientific reasoning and interpretation

**Choose SAT if you**:
- Prefer more time per question
- Excel at vocabulary and reading comprehension
- Are stronger in algebra than geometry
- Like analyzing evidence and making inferences

**Choose ACT if you**:
- Work well under time pressure
- Prefer straightforward questions
- Are strong in science and math (including geometry/trig)
- Like the science reasoning section

**Preparation Strategy**:
- Take practice tests for both to see which feels more natural
- Consider your strengths and weaknesses
- Look at target schools' preferences (though most accept both)
- Factor in test dates and how much time you have to prepare

**Test Optional Note**: Many schools are now test-optional, so research each school's current policy.`,
    tags: ['sat', 'act', 'test-prep', 'standardized-tests'],
    votes: 203,
    helpful: true,
    category_icon: Award
  },
  {
    id: 5,
    category: 'Essays',
    question: 'How do I write a compelling personal statement?',
    answer: `A compelling personal statement tells your unique story and demonstrates fit:

**Before You Write**:
- Brainstorm significant experiences, challenges, or moments of growth
- Identify your core values and what drives you
- Research the school's values and programs
- Consider what aspect of yourself isn't evident elsewhere in your application

**Structure Approaches**:
1. **The Challenge**: Describe a problem you faced and how you overcame it
2. **The Passion**: Explore what you're genuinely excited about and why
3. **The Growth**: Show how you've evolved through specific experiences
4. **The Impact**: Discuss how you've made a difference in your community

**Writing Tips**:
- Start with a compelling hook (scene, question, surprising fact)
- Use specific details and concrete examples
- Show, don't just tell (use anecdotes and scenes)
- Connect experiences to your future goals and the school
- Maintain your authentic voice throughout

**What to Avoid**:
- Generic topics (sports injury, mission trip) unless you have a unique angle
- Trying to cover too much ground
- Complaining or making excuses
- Repeating information from other parts of your application
- Using overly complex vocabulary to sound smart

**Revision Process**:
- Write multiple drafts focusing on different aspects
- Read aloud to check flow and voice
- Get feedback from teachers, counselors, or trusted adults
- Ensure every sentence adds value
- Check grammar and spelling meticulously

**Final Check**: Ask yourself: Does this essay reveal something important about who I am and why I belong at this school?`,
    tags: ['essays', 'personal-statement', 'writing', 'applications'],
    votes: 267,
    helpful: true,
    category_icon: FileText
  },
  {
    id: 6,
    category: 'Deadlines',
    question: 'What are the different application deadlines and which should I choose?',
    answer: `Understanding application deadlines helps you plan strategically:

**Early Decision (ED)**:
- Deadline: Usually November 1 or 15
- Binding commitment (must attend if accepted)
- Higher acceptance rates at many schools
- Choose only if you have a clear first choice
- Can only apply ED to one school

**Early Action (EA)**:
- Deadline: Usually November 1 or 15
- Non-binding (you can choose whether to attend)
- Often higher acceptance rates
- Allows you to apply EA to multiple schools
- Some schools have Single Choice Early Action (SCEA) - only one school

**Regular Decision (RD)**:
- Deadline: Usually January 1-15
- Non-binding
- More time to strengthen your application
- Allows comparison of financial aid offers
- Some schools have rolling admissions

**Which to Choose**:

**Choose Early Decision if**:
- You have a clear first choice school
- Your application is strong and complete
- You don't need to compare financial aid offers
- You're comfortable with the binding commitment

**Choose Early Action if**:
- You want to know results early but keep options open
- Your application is ready by November
- You want to reduce regular decision workload
- The school offers EA (not all do)

**Choose Regular Decision if**:
- You need more time to improve grades or test scores
- You want to compare multiple acceptances and aid offers
- You're applying to highly competitive schools where ED might not help
- You need time to research schools thoroughly

**Timeline Tips**:
- Start applications in summer before senior year
- Have recommenders lined up early
- Don't rush just to meet early deadlines if your application isn't ready
- Keep track of each school's specific requirements and deadlines`,
    tags: ['deadlines', 'early-decision', 'early-action', 'applications'],
    votes: 145,
    helpful: true,
    category_icon: Calendar
  },
  {
    id: 7,
    category: 'Financial Aid',
    question: 'How does the financial aid process work?',
    answer: `Financial aid helps make college affordable through various forms of assistance:

**Types of Financial Aid**:

**Grants and Scholarships** (Free Money):
- Federal Pell Grants (need-based)
- State grants
- Institutional scholarships
- Private scholarships
- Merit-based awards

**Work-Study Programs**:
- Part-time jobs on campus
- Help pay for educational expenses
- Typically 10-15 hours per week

**Loans** (Must be repaid):
- Federal student loans (subsidized and unsubsidized)
- Parent PLUS loans
- Private loans (last resort)

**Application Process**:

1. **FAFSA (Free Application for Federal Student Aid)**:
   - Opens October 1 for the following school year
   - Submit as early as possible
   - Required for federal, state, and most institutional aid
   - Use IRS Data Retrieval Tool for accuracy

2. **CSS Profile** (for private schools):
   - More detailed financial information
   - Required by some private colleges
   - Has a fee (waivers available)

3. **School-Specific Forms**:
   - Some schools have additional requirements
   - Check each school's financial aid website

**Understanding Your Aid Package**:
- **Expected Family Contribution (EFC)**: What you're expected to pay
- **Cost of Attendance (COA)**: Total cost including tuition, room, board, books
- **Financial Need**: COA minus EFC
- **Gap**: Unmet need after aid package

**Maximizing Aid**:
- Submit applications early
- Apply to schools where you're academically strong
- Look for schools that meet full demonstrated need
- Consider schools with good merit aid programs
- Appeal aid decisions if circumstances change

**Important Notes**:
- Aid must be renewed annually
- Maintain academic progress requirements
- Report changes in financial circumstances`,
    tags: ['financial-aid', 'fafsa', 'scholarships', 'loans'],
    votes: 198,
    helpful: true,
    category_icon: DollarSign
  },
  {
    id: 8,
    category: 'Extracurriculars',
    question: 'What extracurricular activities look best on college applications?',
    answer: `Quality and depth matter more than quantity in extracurricular activities:

**What Colleges Look For**:
- **Leadership**: Positions where you influenced others or led initiatives
- **Commitment**: Long-term involvement showing dedication
- **Impact**: Measurable contributions to your school or community
- **Passion**: Genuine interest and enthusiasm
- **Initiative**: Starting new programs or taking on challenges

**Strong Activity Categories**:

**Academic/Intellectual**:
- Academic competitions (debate, math team, science olympiad)
- Research projects or internships
- Academic clubs related to intended major
- Writing for school publications

**Leadership & Service**:
- Student government
- Community service organizations
- Volunteer work with measurable impact
- Tutoring or mentoring
- Religious or cultural organization leadership

**Arts & Creativity**:
- Music (band, orchestra, choir)
- Visual arts (art shows, exhibitions)
- Theater and drama
- Creative writing and publications
- Dance and performance

**Athletics**:
- Varsity sports (especially with leadership roles)
- Individual achievements and records
- Coaching younger athletes
- Sports-related community service

**Work & Entrepreneurship**:
- Part-time jobs (especially with advancement)
- Starting a business or nonprofit
- Internships in your field of interest
- Developing apps or websites

**How to Stand Out**:
- **Document Your Impact**: Keep records of achievements, hours, and outcomes
- **Show Growth**: Demonstrate increasing responsibility over time
- **Connect to Goals**: Align activities with your intended major or career
- **Quality over Quantity**: Deep involvement in 3-5 activities is better than superficial participation in 10
- **Start Your Own**: Create new clubs or initiatives if existing options don't fit

**For Underclassmen**:
- Explore different areas to find your passions
- Look for opportunities to take on leadership roles
- Consider summer programs or camps in your areas of interest
- Build relationships with activity supervisors (potential recommenders)

Remember: Admissions officers can spot "résumé padding." Choose activities you genuinely care about and can discuss passionately.`,
    tags: ['extracurriculars', 'leadership', 'volunteering', 'applications'],
    votes: 221,
    helpful: true,
    category_icon: Users
  },
  {
    id: 9,
    category: 'College Life',
    question: 'How do I prepare for the transition to college life?',
    answer: `Preparing for college involves academic, social, and practical considerations:

**Academic Preparation**:
- **Study Skills**: Learn to manage time effectively and study independently
- **Course Planning**: Research general education requirements and major prerequisites
- **Technology**: Familiarize yourself with common college platforms (LMS, email, registration systems)
- **Writing Skills**: Practice academic writing and citation styles
- **Math Skills**: Review and strengthen math fundamentals if needed

**Life Skills**:
- **Budgeting**: Learn to manage money and understand college expenses
- **Laundry & Cooking**: Master basic life skills for independence
- **Healthcare**: Understand your health insurance and find campus health services
- **Communication**: Practice advocating for yourself with professors and administrators
- **Problem-Solving**: Develop skills to handle challenges independently

**Social Preparation**:
- **Roommate Communication**: Discuss expectations, habits, and boundaries
- **Campus Resources**: Research clubs, organizations, and activities that interest you
- **Diversity**: Prepare for increased diversity in backgrounds, beliefs, and experiences
- **Homesickness**: Develop coping strategies and maintain healthy connections to home
- **Social Skills**: Practice introducing yourself and making new friends

**Practical Steps**:
- **Orientation**: Attend all orientation activities to meet people and learn about resources
- **Schedule**: Plan your first semester carefully, considering course load and commitments
- **Housing**: Communicate with roommates about shared items and personal space
- **Transportation**: Understand how to get around campus and the surrounding area
- **Safety**: Learn about campus safety resources and procedures

**First Semester Success Tips**:
- **Get Involved**: Join at least one club or organization
- **Use Resources**: Take advantage of tutoring, counseling, and academic support
- **Build Relationships**: Attend office hours and get to know professors
- **Stay Healthy**: Maintain good sleep, exercise, and eating habits
- **Ask for Help**: Don't hesitate to seek support when you need it

**Red Flags to Watch For**:
- Persistent homesickness or depression
- Academic struggles or falling behind
- Social isolation or difficulty making friends
- Financial stress or overspending
- Substance use or risky behaviors

**Remember**: Everyone adjusts at their own pace. It's normal to feel overwhelmed initially, and most students find their rhythm by the end of the first semester.`,
    tags: ['college-life', 'transition', 'freshman', 'preparation'],
    votes: 167,
    helpful: true,
    category_icon: GraduationCap
  },
  {
    id: 10,
    category: 'Career Planning',
    question: 'How do I choose a major that leads to a good career?',
    answer: `Choosing a major involves balancing your interests, strengths, and career prospects:

**Self-Assessment First**:
- **Interests**: What subjects genuinely excite you?
- **Strengths**: What are your natural talents and developed skills?
- **Values**: What's important to you in a career (salary, work-life balance, helping others)?
- **Learning Style**: Do you prefer hands-on work, theoretical study, or collaborative projects?

**Research Career Outcomes**:
- **Employment Rates**: What percentage of graduates find jobs in their field?
- **Salary Data**: Research starting salaries and career progression
- **Job Growth**: Look at Bureau of Labor Statistics projections
- **Geographic Options**: Where are jobs in this field located?
- **Career Paths**: What jobs can you get with this major?

**Consider These High-Demand Fields**:

**STEM Fields**:
- Computer Science and Software Engineering
- Data Science and Analytics
- Healthcare (nursing, physical therapy, medical fields)
- Engineering (various specializations)
- Cybersecurity

**Business and Finance**:
- Business Administration
- Finance and Economics
- Marketing and Digital Marketing
- Supply Chain Management

**Growing Areas**:
- Environmental Science and Sustainability
- Mental Health and Counseling
- Education (especially STEM and special education)
- Biotechnology and Biomedical Sciences

**Strategies for Exploration**:
- **Informational Interviews**: Talk to professionals in fields that interest you
- **Job Shadowing**: Spend time observing people in different careers
- **Internships**: Get hands-on experience in potential career fields
- **Career Assessments**: Take validated tests to explore matches
- **Course Sampling**: Take introductory courses in different fields

**Flexible Majors**:
Some majors provide broad skills applicable to many careers:
- Liberal Arts (critical thinking, communication)
- Psychology (understanding human behavior)
- Business (applicable to most industries)
- Communications (valuable in any field)

**Double Majors and Minors**:
- Combine a practical major with a passion
- Add technical skills to a liberal arts major
- Gain competitive advantage in specialized fields

**Important Considerations**:
- **Passion vs. Practicality**: Find a balance between what you love and what pays
- **Transferable Skills**: Focus on developing skills that apply across industries
- **Lifelong Learning**: Most careers require continuous skill development
- **Network Building**: Relationships often matter as much as credentials

**Don't Panic If You're Undecided**:
- Many successful people changed majors or careers
- Focus on developing strong foundational skills
- Use college career services and advisors
- Remember that your major doesn't always determine your career

The key is finding something you can be passionate about that also provides the lifestyle and opportunities you want.`,
    tags: ['career-planning', 'majors', 'job-market', 'career-choice'],
    votes: 245,
    helpful: true,
    category_icon: TrendingUp
  }
]

const categories = [
  { name: 'All', icon: BookOpen, count: qaData.length },
  { name: 'College Selection', icon: GraduationCap, count: qaData.filter(q => q.category === 'College Selection').length },
  { name: 'Applications', icon: FileText, count: qaData.filter(q => q.category === 'Applications').length },
  { name: 'Essays', icon: FileText, count: qaData.filter(q => q.category === 'Essays').length },
  { name: 'Scholarships', icon: DollarSign, count: qaData.filter(q => q.category === 'Scholarships').length },
  { name: 'Test Prep', icon: Award, count: qaData.filter(q => q.category === 'Test Prep').length },
  { name: 'Financial Aid', icon: DollarSign, count: qaData.filter(q => q.category === 'Financial Aid').length },
  { name: 'Extracurriculars', icon: Users, count: qaData.filter(q => q.category === 'Extracurriculars').length },
  { name: 'College Life', icon: MapPin, count: qaData.filter(q => q.category === 'College Life').length },
  { name: 'Career Planning', icon: TrendingUp, count: qaData.filter(q => q.category === 'Career Planning').length },
]

export default function QAPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('votes') // votes, recent, helpful

  const filteredQuestions = useMemo(() => {
    let filtered = qaData

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort
    switch (sortBy) {
      case 'votes':
        return filtered.sort((a, b) => b.votes - a.votes)
      case 'helpful':
        return filtered.sort((a, b) => (b.helpful ? 1 : 0) - (a.helpful ? 1 : 0))
      default:
        return filtered
    }
  }, [searchTerm, selectedCategory, sortBy])

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-display font-bold text-xl text-gradient">
                AI Admission Counsellor
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            Q&A Knowledge Center
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Find answers to common college admission questions, backed by AI expertise and proven strategies.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions, answers, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-40"
              >
                <option value="votes">Most Helpful</option>
                <option value="helpful">Recommended</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-700 hover:bg-primary-50'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">No questions found</h3>
              <p className="text-secondary-600">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredQuestions.map((qa, index) => (
                <motion.div
                  key={qa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <qa.category_icon className="h-6 w-6 text-primary-600" />
                      <span className="badge badge-info">{qa.category}</span>
                      {qa.helpful && <Star className="h-4 w-4 text-warning-500 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{qa.votes}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(qa.id)}
                    className="w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                      {qa.question}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {qa.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center space-x-1 text-xs text-secondary-500">
                            <Tag className="h-3 w-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                      {expandedItems.includes(qa.id) ? (
                        <ChevronUp className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-secondary-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(qa.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-secondary-200"
                      >
                        <div className="prose prose-secondary max-w-none">
                          {qa.answer.split('\n\n').map((paragraph, idx) => {
                            if (paragraph.startsWith('**') && paragraph.endsWith('**:')) {
                              return (
                                <h4 key={idx} className="font-semibold text-secondary-900 mt-4 mb-2">
                                  {paragraph.replace(/\*\*/g, '')}
                                </h4>
                              )
                            }
                            return (
                              <p key={idx} className="text-secondary-700 mb-3 whitespace-pre-line">
                                {paragraph}
                              </p>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-secondary-900 mb-4">
              Need Personalized Guidance?
            </h3>
            <p className="text-secondary-600 mb-6">
              Get AI-powered recommendations tailored to your specific profile and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto">
                  Create Your Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto">
                Ask a Question
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
