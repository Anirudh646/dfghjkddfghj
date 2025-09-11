import type { Course, Contact, FaqItem, GeneralInfo } from '@/lib/types';

export const courses: Course[] = [
  {
    id: 'cs101',
    title: 'Computer Science & Engineering',
    department: 'Engineering',
    code: 'CSE101',
    description: 'An introductory course to computer science, aligned with the AICTE curriculum. It covers fundamental concepts of programming, data structures, and algorithms. Students will learn Python and Java, and work on projects to build problem-solving skills.',
    credits: 4,
  },
  {
    id: 'ba202',
    title: 'Business Administration (BBA)',
    department: 'Management',
    code: 'BBA202',
    description: 'This program provides a broad overview of business management principles, including marketing, finance, human resources, and operations, with a focus on the Indian market. It is designed to prepare students for leadership roles in various industries.',
    credits: 3,
  },
  {
    id: 'jeemain',
    title: 'JEE Main Preparation',
    department: 'Entrance Exam',
    code: 'JEE100',
    description: 'A comprehensive preparation course for the Joint Entrance Examination (Main), covering Physics, Chemistry, and Mathematics. Includes mock tests, doubt-clearing sessions, and expert guidance to help students excel.',
    credits: 5,
  },
  {
    id: 'neetprep',
    title: 'NEET UG Preparation',
    department: 'Entrance Exam',
    code: 'NEET100',
    description: 'An intensive course for the National Eligibility cum Entrance Test (UG) for medical aspirants. The curriculum covers Physics, Chemistry, and Biology (Botany and Zoology) as per the latest NTA syllabus.',
    credits: 5,
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
  fees: 'The average tuition fee is approximately ₹1,50,000 per semester for undergraduate programs. This does not include hostel, mess, or other personal expenses. Specific fees may vary by program. A detailed fee structure is available on the university website.',
  eligibility: 'Applicants must have passed the Class 12 (or equivalent) examination. For engineering, PCM is required, and for medical, PCB is required. Minimum percentage criteria and entrance exam scores (like JEE/NEET) are applicable.',
  facilities: 'Our campus boasts state-of-the-art facilities, including modern laboratories, a 24/7 library, a sports complex with cricket and football grounds, multiple canteens, and student common rooms. High-speed Wi-Fi is available across the entire campus.',
};