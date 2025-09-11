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
  return answerAdmissionQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAdmissionQueryPrompt',
  input: {schema: AnswerAdmissionQueryInputSchema},
  output: {schema: AnswerAdmissionQueryOutputSchema},
  prompt: `You are an AI admission counselor for an Indian university. Your goal is to provide helpful and accurate information to prospective students.

  Use the following information to answer the student's query. Be concise and helpful.

  **Contextual Information:**
  - **Course Details:** {{{courseDetails}}}
  - **General Fees (Hostel/Bus):** {{{feesInformation}}}
  - **Eligibility Criteria:** {{{eligibilityCriteria}}}
  - **Facilities:** {{{facilitiesInformation}}}
  - **Contact Information:** {{{contactInformation}}}

  **Student Query:** {{{query}}}

  **Instructions:**
  1.  Carefully analyze the student's query to understand their needs.
  2.  If the query is about fees for a specific course, use the fee structure information provided within the 'Course Details' for that course.
  3.  When providing the fee structure for a course, format it as follows, with each semester on a new line:
      [Course Name]
      [Semester/Term]) [Fee Amount]
      [Semester/Term]) [Fee Amount]
      ...
  4.  For general fee inquiries (like hostel or bus fees), use the 'General Fees' information.
  5. If the user asks a general question, answer in a helpful and clear paragraph.
  6.  If the requested information is not available, state that and suggest they contact the admissions office.
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
