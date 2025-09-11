export type Course = {
  id: string;
  title: string;
  department: string;
  code: string;
  description: string;
  credits: number;
  feeStructure?: {
    [semester: string]: number;
  };
};

export type Contact = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatarId: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type GeneralInfo = {
  applicationDeadlines: {
    fall: string;
    spring: string;
  };
  requiredDocuments: string[];
  applicationSteps: string[];
  fees: string;
  eligibility: string;
  facilities: string;
};
