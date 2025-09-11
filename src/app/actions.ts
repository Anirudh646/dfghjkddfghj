'use server';

import { answerAdmissionQuery } from '@/ai/flows/answer-admission-queries';
import { getStartedGuideFromPrompt } from '@/ai/flows/get-started-guide-from-prompt';
import { courses, contacts, generalInfo, faqs } from '@/lib/data';
import { z } from 'zod';

const getContextString = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  let courseDetails = '';
  // Be more specific about when to include all course details.
  if (lowerQuery.includes('all courses') || lowerQuery.includes('list courses')) {
    courseDetails = `Available courses: ${courses.map(c => c.title).join(', ')}`;
  } else {
    // Find specific course mentions
    const mentionedCourse = courses.find(c => lowerQuery.includes(c.title.toLowerCase()));
    if (mentionedCourse) {
      const feeInfo = mentionedCourse.feeStructure ? ` Fee Structure: ${JSON.stringify(mentionedCourse.feeStructure)}` : '';
      courseDetails = `${mentionedCourse.title} (${mentionedCourse.department}) - ${mentionedCourse.description}. Duration: ${mentionedCourse.duration}. Eligibility: ${mentionedCourse.eligibility}.${feeInfo}`;
    } else if (lowerQuery.includes('course')) {
        // If it's a generic course query but not asking for all, provide a summary.
        courseDetails = `The university offers a variety of courses including: ${courses.map(c => c.title).join(', ')}. Ask about a specific one for more details.`;
    }
  }

  const feesInformation = (lowerQuery.includes('fee') || lowerQuery.includes('hostel') || lowerQuery.includes('bus')) ? generalInfo.fees : undefined;
  const eligibilityCriteria = lowerQuery.includes('eligibility') ? generalInfo.eligibility : undefined;
  const facilitiesInformation = lowerQuery.includes('facilities') || lowerQuery.includes('campus') ? generalInfo.facilities : undefined;
  const contactInformation = lowerQuery.includes('contact') || lowerQuery.includes('help') ? `Key Contacts: ${contacts.map(c => `${c.name}, ${c.title}, Email: ${c.email}`).join('; ')}. For detailed contact info, please visit the contact page.` : undefined;
  
  const faqSummaries = lowerQuery.includes('faq') || lowerQuery.includes('question') ? `FAQs cover topics like deadlines ('${faqs[0].question}'), required documents ('${faqs[1].question}'), and fees ('${faqs[2].question}').` : undefined;

  let fullContactInfo = contactInformation;
  if (faqSummaries) {
    fullContactInfo = `${contactInformation || ''}. ${faqSummaries}`;
  }
  
  return {
    courseDetails: courseDetails || undefined,
    feesInformation,
    eligibilityCriteria,
    facilitiesInformation,
    contactInformation: fullContactInfo,
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
