'use server';

import { answerAdmissionQuery } from '@/ai/flows/answer-admission-queries';
import { courses, contacts, generalInfo, faqs } from '@/lib/data';
import { z } from 'zod';

const getContextString = () => {
  const courseDetails = `Available courses: ${courses.map(c => c.title).join(', ')}. Details include descriptions, credits, etc.`;
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
