
'use server';

import { answerAdmissionQuery } from '@/ai/flows/answer-admission-queries';
import { getStartedGuideFromPrompt } from '@/ai/flows/get-started-guide-from-prompt';
import { courses, contacts, generalInfo, faqs } from '@/lib/data';
import { z } from 'zod';

const getContextString = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  let courseDetails: string | undefined;
  const mentionedCourse = courses.find(c => lowerQuery.includes(c.title.toLowerCase()));

  if (mentionedCourse) {
    const feeInfo = mentionedCourse.feeStructure ? ` Fee Structure: ${JSON.stringify(mentionedCourse.feeStructure)}` : '';
    const placementInfo = mentionedCourse.placementInfo ? ` Placement Info: ${mentionedCourse.placementInfo}`: '';
    courseDetails = `${mentionedCourse.title} (${mentionedCourse.department}) - ${mentionedCourse.description}. Duration: ${mentionedCourse.duration}. Eligibility: ${mentionedCourse.eligibility}.${feeInfo}.${placementInfo}`;
  } else if (/\b(course|program|curriculum|syllabus)\b/.test(lowerQuery)) {
    courseDetails = `The university offers a variety of undergraduate and professional programs. Key courses include: ${courses.map(c => c.title).join(', ')}. For detailed information, please ask about a specific course.`;
  }

  let feesInformation: string | undefined;
  if (/\b(bus)\b/.test(lowerQuery)) {
    feesInformation = `Bus fees vary by route. Here is the annual fee structure: ${Object.entries(generalInfo.busFees).map(([route, fee]) => `${route}: ₹${fee}`).join(', ')}.`;
  } else if (/\b(fee|cost|hostel|payment|installment)\b/.test(lowerQuery)) {
    feesInformation = generalInfo.fees;
  }

  const eligibilityCriteria = /\b(eligibility|admission requirement)\b/.test(lowerQuery) ? generalInfo.eligibility : undefined;
  
  let applicationInfo: string | undefined;
  if (/\b(application|apply|admission|deadline|process|procedure)\b/.test(lowerQuery)) {
    applicationInfo = `Application Steps: ${generalInfo.applicationSteps.join(' ')} Deadlines: Fall - ${generalInfo.applicationDeadlines.fall}, Spring - ${generalInfo.applicationDeadlines.spring}. Required Documents: ${generalInfo.requiredDocuments.join(', ')}.`;
  }

  const scholarshipInfo = /\b(scholarship|financial aid)\b/.test(lowerQuery) ? `The university offers merit-based and need-based scholarships. Students can also apply for various government scholarships. For more details, please check the university's official website or contact the financial aid office.` : undefined;

  const facilitiesInformation = /\b(facilities|campus|amenities|accommodation|hostel)\b/.test(lowerQuery) ? generalInfo.facilities : undefined;
  
  let contactInformation: string | undefined;
  if (/\b(contact|help)\b/.test(lowerQuery)) {
      contactInformation = `Key Contacts: ${contacts.map(c => `${c.name} (${c.title}) - ${c.email}`).join('; ')}. For more details, visit the contact page.`;
  }
  
  const faqSummaries = faqs.map(faq => {
    const questionWords = faq.question.toLowerCase().split(' ');
    if (questionWords.some(word => lowerQuery.includes(word))) {
      return faq.answer;
    }
    return undefined;
  }).filter(Boolean).join(' ');

  let entranceExamInfo: string | undefined;
  if (/\b(exam|test|syllabus|pattern)\b/.test(lowerQuery)) {
    entranceExamInfo = generalInfo.entranceExams;
  }

  let applicationStatusInfo: string | undefined;
  if (/\b(status)\b/.test(lowerQuery)) {
    applicationStatusInfo = generalInfo.applicationStatus;
  }

  let internationalInfo: string | undefined;
  if (/\b(international|foreign|visa)\b/.test(lowerQuery)) {
    internationalInfo = generalInfo.internationalAdmissions;
  }

  let placementInfo: string | undefined;
  if (/\b(placement|job|career|salary|recruiter)\b/.test(lowerQuery)) {
      placementInfo = generalInfo.placements;
  }


  const combinedContext = [contactInformation, faqSummaries, entranceExamInfo, applicationStatusInfo, internationalInfo, placementInfo].filter(Boolean).join(' ');


  return {
    courseDetails,
    feesInformation,
    eligibilityCriteria,
    applicationInfo,
    scholarshipInfo,
    facilitiesInformation,
    contactInformation: combinedContext,
  };
};

const AskAISchema = z.string().min(1, { message: 'Query cannot be empty.' }).max(500, { message: 'Query is too long.' });

export async function askAI(prevState: any, formData: FormData): Promise<{ answer?: string; error?: string }> {
  const query = formData.get('query');
  const validation = AskAISchema.safeParse(query);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const validQuery = validation.data;

  try {
    const context = getContextString(validQuery);
    const result = await answerAdmissionQuery({
      query: validQuery,
      ...context,
    });
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while processing your request. Please try again.' };
  }
}

const GetStartedSchema = z.string().min(3, { message: 'Please enter your study interest.' }).max(100, { message: 'Your input is too long.' });

export async function getStarted(prevState: any, formData: FormData): Promise<{ guide?: string; error?: string }> {
  const studyInterest = formData.get('studyInterest');
  const validation = GetStartedSchema.safeParse(studyInterest);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const validInterest = validation.data;

  try {
    const courseDetails = `Available courses: ${courses.map(c => `${c.title} - ${c.description}`).join('; ')}`;
    const result = await getStartedGuideFromPrompt({
      studyInterest: validInterest,
      universityCourses: courseDetails,
      admissionRequirements: generalInfo.eligibility,
      financialAidOptions: 'Information about financial aid is available on the university website and can be discussed with our financial aid advisors.',
      studentLifeInfo: generalInfo.facilities,
    });
    return { guide: result.guide };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while generating your guide. Please try again.' };
  }
}
