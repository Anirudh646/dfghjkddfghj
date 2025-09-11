import type { Course, Contact, FaqItem, GeneralInfo } from '@/lib/types';

export const courses: Course[] = [
  // Arts / Humanities
  {
    id: 'ba-gen',
    title: 'B.A. (Bachelor of Arts)',
    department: 'Arts / Humanities',
    code: 'BA101',
    description: 'A foundational undergraduate degree offering a broad education in the humanities and social sciences.',
    eligibility: '10+2 or equivalent examination from a recognized board.',
    duration: '3 Years',
    credits: 120,
    feeStructure: {
      'Annual Fee': 50000,
    },
  },
  {
    id: 'bfa',
    title: 'BFA (Bachelor of Fine Arts)',
    department: 'Arts / Humanities',
    code: 'BFA101',
    description: 'A specialized degree for students aiming for a creative career in visual or performing arts.',
    eligibility: '10+2 or equivalent. Some universities may require a portfolio or entrance test.',
    duration: '4 Years',
    credits: 160,
    feeStructure: {
      'Annual Fee': 75000,
    },
  },
  {
    id: 'bjmc',
    title: 'BJMC (Journalism & Mass Communication)',
    department: 'Arts / Humanities',
    code: 'BJMC101',
    description: 'A program designed to equip students with the skills for a career in media, journalism, and public relations.',
    eligibility: '10+2 with a minimum of 50% marks. Entrance exam may be required.',
    duration: '3 Years',
    credits: 130,
    feeStructure: {
      'Annual Fee': 90000,
    },
  },
  {
    id: 'ba-llb',
    title: 'BA LLB (Integrated Law)',
    department: 'Arts / Humanities',
    code: 'LAW101',
    description: 'An integrated five-year program combining arts and law subjects, leading to a professional law degree.',
    eligibility: '10+2 or equivalent. Admission is typically through a national-level law entrance exam (e.g., CLAT).',
    duration: '5 Years',
    credits: 200,
    feeStructure: {
      'Annual Fee': 150000,
    },
  },
  // Science
  {
    id: 'bsc-gen',
    title: 'B.Sc. (Bachelor of Science)',
    department: 'Science',
    code: 'BSC101',
    description: 'A fundamental science degree with options to specialize in various scientific disciplines.',
    eligibility: '10+2 with a science stream (Physics, Chemistry, Biology/Maths) from a recognized board.',
    duration: '3 Years',
    credits: 120,
    feeStructure: {
      'Annual Fee': 60000,
    },
  },
  {
    id: 'btech-be',
    title: 'B.Tech / BE (Engineering)',
    department: 'Science',
    code: 'ENG101',
    description: 'A professional engineering degree with specializations like Computer Science, Mechanical, Civil, and Electrical.',
    eligibility: '10+2 with Physics, Chemistry, and Mathematics (PCM). Admission is based on entrance exams like JEE Main.',
    duration: '4 Years',
    credits: 180,
    feeStructure: {
      'Annual Fee': 180000,
    },
  },
  {
    id: 'bca',
    title: 'BCA (Computer Applications)',
    department: 'Science',
    code: 'BCA101',
    description: 'A three-year undergraduate program focused on computer science and its applications.',
    eligibility: '10+2 with Mathematics as a subject. Some universities may admit students from other streams.',
    duration: '3 Years',
    credits: 140,
    feeStructure: {
      'Annual Fee': 85000,
    },
  },
  {
    id: 'mbbs',
    title: 'MBBS (Medicine)',
    department: 'Science',
    code: 'MED101',
    description: 'An undergraduate medical degree required to become a doctor of medicine.',
    eligibility: '10+2 with Physics, Chemistry, Biology (PCB). Admission is through the NEET UG entrance exam.',
    duration: '5.5 Years (including internship)',
    credits: 250,
    feeStructure: {
      'Annual Fee': 500000,
    },
  },
  {
    id: 'bds',
    title: 'BDS (Dentistry)',
    department: 'Science',
    code: 'DEN101',
    description: 'An undergraduate degree for students who want to pursue a career in dentistry.',
    eligibility: '10+2 with PCB. Admission is through the NEET UG entrance exam.',
    duration: '5 Years (including internship)',
    credits: 220,
    feeStructure: {
      'Annual Fee': 350000,
    },
  },
  {
    id: 'bpharm',
    title: 'B.Pharm (Pharmacy)',
    department: 'Science',
    code: 'PHM101',
    description: 'A four-year program that prepares students for roles in the pharmaceutical industry, drug research, and medical dispensing.',
    eligibility: '10+2 with PCB or PCM stream. Pharmacy entrance exams may be required.',
    duration: '4 Years',
    credits: 170,
    feeStructure: {
      'Annual Fee': 120000,
    },
  },
  // Commerce / Management
  {
    id: 'bcom',
    title: 'B.Com (Bachelor of Commerce)',
    department: 'Commerce / Management',
    code: 'BCOM101',
    description: 'An undergraduate degree in commerce and related subjects, providing a strong foundation in business and finance.',
    eligibility: '10+2 with commerce stream or equivalent.',
    duration: '3 Years',
    credits: 120,
    feeStructure: {
      'Annual Fee': 55000,
    },
  },
  {
    id: 'bba',
    title: 'BBA (Business Administration)',
    department: 'Commerce / Management',
    code: 'BBA101',
    description: 'A bachelor’s degree that provides a broad understanding of business principles and management functions.',
    eligibility: '10+2 from any stream. Some universities conduct entrance tests.',
    duration: '3 Years',
    credits: 130,
    feeStructure: {
      'Annual Fee': 95000,
    },
  },
  // Professional Courses
  {
    id: 'bhm',
    title: 'BHM (Hotel Management)',
    department: 'General / Professional',
    code: 'BHM101',
    description: 'A degree program that prepares students for a career in the hospitality industry, including hotels, resorts, and restaurants.',
    eligibility: '10+2 from any stream. Admission often based on entrance exams like NCHMCT JEE.',
    duration: '4 Years',
    credits: 160,
    feeStructure: {
      'Annual Fee': 130000,
    },
  },
  {
    id: 'bdes',
    title: 'B.Des (Fashion Designing)',
    department: 'General / Professional',
    code: 'BDES101',
    description: 'A creative degree focusing on the art and business of fashion design, from concept to production.',
    eligibility: '10+2 from any stream. A portfolio and entrance exam (like NID/NIFT) are typically required.',
    duration: '4 Years',
    credits: 160,
    feeStructure: {
      'Annual Fee': 160000,
    },
  },
];


export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Head of Admissions',
    department: 'Admissions Office',
    email: 'p.sharma@university.ac.in',
    phone: '+91 98765 43210',
    avatarId: 'contact-1',
  },
  {
    id: '2',
    name: 'Mr. Rajesh Kumar',
    title: 'Financial Aid Advisor',
    department: 'Financial Aid Office',
    email: 'r.kumar@university.ac.in',
    phone: '+91 98765 43211',
    avatarId: 'contact-2',
  },
  {
    id: '3',
    name: 'Dr. Anjali Singh',
    title: 'Dean of Engineering',
    department: 'Engineering Department',
    email: 'a.singh@university.ac.in',
    phone: '+91 98765 43212',
    avatarId: 'contact-3',
  },
  {
    id: '4',
    name: 'Prof. Vikram Mehta',
    title: 'Head of Management Studies',
    department: 'Management Department',
    email: 'v.mehta@university.ac.in',
    phone: '+91 98765 43213',
    avatarId: 'contact-4',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'faq1',
    question: 'What are the application deadlines?',
    answer: 'The application deadline for the main session is typically in April. Please check the official websites for JEE, NEET, or the university for exact dates.',
  },
  {
    id: 'faq2',
    question: 'What documents are required for admission?',
    answer: 'You will need to submit your Class 10th and 12th mark sheets, a valid photo ID (like Aadhar), passport-sized photographs, and category certificate (if applicable).',
  },
  {
    id: 'faq3',
    question: 'Is there an application fee?',
    answer: 'Yes, application fees vary by examination and university. Fee waivers are often available for reserved categories as per government norms.',
  },
  {
    id: 'faq4',
    question: 'Can I apply for scholarships?',
    answer: 'Absolutely. We offer merit-based and need-based scholarships. Additionally, students can apply for various government scholarships through the National Scholarship Portal.',
  },
  {
    id: 'faq5',
    question: 'What are the on-campus housing options?',
    answer: 'We offer separate hostel facilities for boys and girls with options for AC and non-AC rooms. Mess facilities provide a variety of Indian cuisine.',
  },
];

export const generalInfo: GeneralInfo = {
  applicationDeadlines: {
    fall: 'April 30th',
    spring: 'November 30th',
  },
  requiredDocuments: [
    'Class 10th Marksheet',
    'Class 12th Marksheet',
    'Aadhar Card',
    'Passport-sized photographs',
    'Category Certificate (if applicable)',
  ],
  applicationSteps: [
    'Register online on the official portal.',
    'Fill out the application form with correct details.',
    'Upload scanned copies of required documents.',
    'Pay the application fee online.',
    'Download and print the confirmation page.',
  ],
  fees: 'Tuition fees vary by course. Please ask about a specific course for detailed fee information. Hostel fees are ₹60,000 per year, and bus fees are ₹20,000 per year. These fees are subject to revision.',
  eligibility: 'Eligibility criteria vary by course. Generally, applicants must have passed the Class 12 (or equivalent) examination. Specific stream requirements (like PCM for Engineering or PCB for Medical) and minimum percentage criteria apply for most programs. Admission may also be based on national-level entrance exams.',
  facilities: 'Our campus boasts state-of-the-art facilities, including modern laboratories, a 24/7 library, a sports complex with cricket and football grounds, multiple canteens, and student common rooms. High-speed Wi-Fi is available across the entire campus.',
};
