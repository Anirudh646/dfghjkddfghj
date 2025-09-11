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
  applicationInfo: z.string().optional().describe('Information about the application process, steps, and deadlines.'),
  scholarshipInfo: z.string().optional().describe('Information about available scholarships.'),
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
  
  if (query === 'course' || query === 'courses') {
    return { answer: 'ACTION_SELECT_COURSE_INFO' };
  }

  if (query === 'hi' || query === 'hello') {
    return { answer: "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more." };
  }

  const isFeeQuery = query.includes('fee') || query.includes('cost');
  if (isFeeQuery) {
    if (query === 'fees' || query === 'fee') {
      return { answer: 'ACTION_SELECT_FEE_TYPE' };
    }

    const hasCourseContext = /b\.a\.|bfa|bjmc|ba llb|b\.sc\.|b\.tech|be|bca|mbbs|bds|b\.pharm|b\.com|bba|bhm|b\.des/i.test(query);
    const isHostelQuery = query.includes('hostel');
    const isBusQuery = query.includes('bus');

    if (hasCourseContext || isHostelQuery || isBusQuery) {
      return answerAdmissionQueryFlow(input);
    } else {
      if (query.includes('course')) {
        return { answer: 'ACTION_SELECT_COURSE_FOR_FEES' };
      }
      return { answer: 'ACTION_SELECT_FEE_TYPE' };
    }
  }
  
  return answerAdmissionQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAdmissionQueryPrompt',
  input: {schema: AnswerAdmissionQueryInputSchema},
  output: {schema: AnswerAdmissionQueryOutputSchema},
  prompt: `You are an AI admission counselor for a university. Your goal is to provide concise, helpful, and accurate information to prospective students based *only* on the context provided.

  **Contextual Information (Use only this information to answer):**
  - **Course Details:** {{{courseDetails}}}
  - **General Fees (Hostel/Bus):** {{{feesInformation}}}
  - **Eligibility Criteria:** {{{eligibilityCriteria}}}
  - **Application Process & Deadlines:** {{{applicationInfo}}}
  - **Scholarships:** {{{scholarshipInfo}}}
  - **Facilities:** {{{facilitiesInformation}}}
  - **Contact Information:** {{{contactInformation}}}

  **Student Query:** {{{query}}}

  **Instructions:**
  1. Answer the user's query directly and concisely using *only* the information provided in the context above.
  2. Do not add any information that is not present in the context.
  3. If the information is not available in the context, state that clearly and suggest contacting the admissions office for more details.
  4. When providing the fee structure for a course, format it as follows:
      **[Course Name]**
      - **Annual Fee:** [Fee Amount]
      - **Semester 1:** [Fee Amount]
      - **Semester 2:** [Fee Amount]
      ...
  5. If asked about the application process, list the steps clearly.
  6. If asked about scholarships, summarize the available options.
  7. Keep your answers short and to the point.
  8. If asked for a greeting, provide a friendly welcome message and briefly explain your capabilities.
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
