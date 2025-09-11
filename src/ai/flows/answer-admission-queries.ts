'use server';

/**
 * @fileOverview A flow that answers admission-related queries using AI.
 * 
 * - answerAdmissionQuery - A function that answers admission queries.
 * - AnswerAdmissionQueryInput - The input type for the answerAdmissionQuery function.
 * - AnswerAdmissionQueryOutput - The return type for the answerAdmissionQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerAdmissionQueryInputSchema = z.object({
  query: z.string().describe('The admission-related query from the student.'),
  courseDetails: z.string().optional().describe('Course details information, including course-specific fee structures.'),
  feesInformation: z.string().optional().describe('General fees related information, like hostel and bus fees.'),
  eligibilityCriteria: z.string().optional().describe('Eligibility criteria information.'),
  facilitiesInformation: z.string().optional().describe('Facilities information.'),
  contactInformation: z.string().optional().describe('Contact information for help.'),
});
export type AnswerAdmissionQueryInput = z.infer<typeof AnswerAdmissionQueryInputSchema>;

const AnswerAdmissionQueryOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the admission query.'),
});
export type AnswerAdmissionQueryOutput = z.infer<typeof AnswerAdmissionQueryOutputSchema>;

export async function answerAdmissionQuery(input: AnswerAdmissionQueryInput): Promise<AnswerAdmissionQueryOutput> {
  const query = input.query.toLowerCase().trim();
  const isFeeQuery = query.includes('fee') || query.includes('cost');
  
  if (isFeeQuery) {
    if (query === 'fees' || query === 'fee') {
      return { answer: 'ACTION_SELECT_FEE_TYPE' };
    }

    const hasCourseContext = /b\.a\.|bfa|bjmc|ba llb|b\.sc\.|b\.tech|be|bca|mbbs|bds|b\.pharm|b\.com|bba|bhm|b\.des/i.test(query);
    const isHostelQuery = query.includes('hostel');
    const isBusQuery = query.includes('bus');

    if (hasCourseContext || isHostelQuery || isBusQuery) {
      // If the query is specific, let the flow handle it.
      return answerAdmissionQueryFlow(input);
    } else {
      // If it's a generic fee query, ask for clarification.
      return { answer: 'ACTION_SELECT_FEE_TYPE' };
    }
  }
  
  return answerAdmissionQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAdmissionQueryPrompt',
  input: {schema: AnswerAdmissionQueryInputSchema},
  output: {schema: AnswerAdmissionQueryOutputSchema},
  prompt: `You are an AI admission counselor for an Indian university. Your goal is to provide short, helpful, and easy-to-understand information to prospective students.

  Use the following information to answer the student's query. Be concise and helpful.

  **Contextual Information:**
  - **Course Details:** {{{courseDetails}}}
  - **General Fees (Hostel/Bus):** {{{feesInformation}}}
  - **Eligibility Criteria:** {{{eligibilityCriteria}}}
  - **Facilities:** {{{facilitiesInformation}}}
  - **Contact Information:** {{{contactInformation}}}

  **Student Query:** {{{query}}}

  **Instructions:**
  1.  Provide a short, direct answer in a single, easy-to-understand paragraph.
  2.  When providing the fee structure for a course, format it as follows, with each semester on a new line:
      **[Course Name]**
      - **[Semester/Term]:** [Fee Amount]
      - **[Semester/Term]:** [Fee Amount]
      ...
  3.  For general fee inquiries (like hostel or bus fees), use the 'General Fees' information.
  4. If the user asks a general question, answer in a helpful and clear paragraph.
  5.  If the requested information is not available, state that and suggest they contact the admissions office.
  `,
});

const answerAdmissionQueryFlow = ai.defineFlow(
  {
    name: 'answerAdmissionQueryFlow',
    inputSchema: AnswerAdmissionQueryInputSchema,
    outputSchema: AnswerAdmissionQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
