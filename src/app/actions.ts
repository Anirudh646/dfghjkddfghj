'use server';

import { answerAdmissionQuery } from '@/ai/flows/answer-admission-queries';
import { getStartedGuideFromPrompt } from '@/ai/flows/get-started-guide-from-prompt';
import { courses, contacts, generalInfo, faqs } from '@/lib/data';
import { z } from 'zod';

const getContextString = () => {
  const courseDetails = `Available courses: ${courses.map(c => {
    const feeInfo = c.feeStructure ? ` Fee Structure: ${JSON.stringify(c.feeStructure)}` : '';
    return `${c.title} (${c.department}) - ${c.description}. Duration: ${c.duration}. Eligibility: ${c.eligibility}.${feeInfo}`;
  }).join('; ')}`;
  
  const feesInformation = generalInfo.fees;
  const eligibilityCriteria = generalInfo.eligibility;
  const facilitiesInformation = generalInfo.facilities;
  const contactInformation = `Key Contacts: ${contacts.map(c => `${c.name}, ${c.title}, Email: ${c.email}`).join('; ')}. For detailed contact info, please visit the contact page.`;
  const faqSummaries = `FAQs cover topics like deadlines ('${faqs[0].question}'), required documents ('${faqs[1].question}'), and fees ('${faqs[2].question}').`;

  return {
    courseDetails,
    feesInformation,
    eligibilityCriteria,
    facilitiesInformation,
    contactInformation: `${contactInformation}. ${faqSummaries}`,
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
    const context = getContextString();
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
    const context = getContextString();
    const result = await getStartedGuideFromPrompt({
      studyInterest: validInterest,
      universityCourses: context.courseDetails,
      admissionRequirements: context.eligibilityCriteria,
      financialAidOptions: 'Information about financial aid is available on the university website and can be discussed with our financial aid advisors.',
      studentLifeInfo: context.facilities,
    });
    return { guide: result.guide };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while generating your guide. Please try again.' };
  }
}
