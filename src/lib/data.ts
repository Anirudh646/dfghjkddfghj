import type { Course, Contact, FaqItem, GeneralInfo } from '@/lib/types';

export const courses: Course[] = [
  {
    id: 'cs101',
    title: 'Computer Science & Engineering',
    department: 'Engineering',
    code: 'CSE101',
    description: 'An introductory course to computer science, covering fundamental concepts of programming, data structures, and algorithms. Students will learn Python and Java, and work on several small-scale projects to build their problem-solving skills.',
    credits: 4,
  },
  {
    id: 'ba202',
    title: 'Business Administration',
    department: 'Management',
    code: 'BBA202',
    description: 'This program provides a broad overview of business management principles, including marketing, finance, human resources, and operations. It is designed to prepare students for leadership roles in a variety of industries.',
    credits: 3,
  },
  {
    id: 'pd301',
    title: 'Product Design',
    department: 'Design',
    code: 'DES301',
    description: 'A hands-on course focusing on the product design lifecycle from ideation to prototype. Students will learn user research, wireframing, prototyping, and user testing methodologies using industry-standard tools like Figma and Sketch.',
    credits: 4,
  },
  {
    id: 'ds450',
    title: 'Data Science & Analytics',
    department: 'Science & Technology',
    code: 'DSA450',
    description: 'Explore the world of data science, machine learning, and big data. This course covers statistical analysis, data visualization, and predictive modeling techniques. Prerequisite: Strong foundation in statistics and programming.',
    credits: 4,
  },
];

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    title: 'Head of Admissions',
    department: 'Admissions Office',
    email: 'e.reed@university.edu',
    phone: '(123) 456-7890',
    avatarId: 'contact-1',
  },
  {
    id: '2',
    name: 'Mr. David Chen',
    title: 'Financial Aid Advisor',
    department: 'Financial Aid Office',
    email: 'd.chen@university.edu',
    phone: '(123) 456-7891',
    avatarId: 'contact-2',
  },
  {
    id: '3',
    name: 'Dr. Sofia Garcia',
    title: 'Dean of Engineering',
    department: 'Engineering Department',
    email: 's.garcia@university.edu',
    phone: '(123) 456-7892',
    avatarId: 'contact-3',
  },
  {
    id: '4',
    name: 'Prof. Ben Carter',
    title: 'Head of Design',
    department: 'Design Department',
    email: 'b.carter@university.edu',
    phone: '(123) 456-7893',
    avatarId: 'contact-4',
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'faq1',
    question: 'What are the application deadlines?',
    answer: 'The application deadline for the Fall semester is July 31st. For the Spring semester, the deadline is December 15th.',
  },
  {
    id: 'faq2',
    question: 'What documents are required for admission?',
    answer: 'You will need to submit your high school transcripts, a personal statement, two letters of recommendation, and standardized test scores (SAT or ACT).',
  },
  {
    id: 'faq3',
    question: 'Is there an application fee?',
    answer: 'Yes, there is a non-refundable application fee of $50. Fee waivers are available for eligible students. Please contact the financial aid office for more information.',
  },
  {
    id: 'faq4',
    question: 'Can I apply for financial aid?',
    answer: 'Absolutely. We offer a range of financial aid options, including scholarships, grants, and loans. You can apply for financial aid through the FAFSA and our university\'s financial aid portal.',
  },
  {
    id: 'faq5',
    question: 'What are the on-campus housing options?',
    answer: 'We offer several dormitory and apartment-style housing options for students. All freshmen are guaranteed housing if they apply by the deadline. You can find more details on the housing section of our website.',
  },
];

export const generalInfo: GeneralInfo = {
  applicationDeadlines: {
    fall: 'July 31st',
    spring: 'December 15th',
  },
  requiredDocuments: [
    'High school transcripts',
    'Personal statement',
    'Two letters of recommendation',
    'Standardized test scores (SAT/ACT)',
  ],
  applicationSteps: [
    'Complete the online application form.',
    'Pay the application fee.',
    'Submit all required documents through the portal.',
    'Track your application status online.',
  ],
  fees: 'The average tuition fee is approximately $20,000 per semester for undergraduate programs. This does not include housing, meals, or other personal expenses. Specific fees may vary by program. A detailed fee structure is available on the university website.',
  eligibility: 'Applicants must have a high school diploma or equivalent with a minimum GPA of 3.0. For graduate programs, a bachelor\'s degree in a related field is required. Some programs may have additional prerequisites or require a portfolio.',
  facilities: 'Our campus boasts state-of-the-art facilities, including modern laboratories, a 24/7 library, a comprehensive sports complex with a swimming pool and gym, multiple cafes, and dedicated student lounges. High-speed Wi-Fi is available across the entire campus.',
};
