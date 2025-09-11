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
  courseDetails: z.string().optional().describe('Course details information.'),
  feesInformation: z.string().optional().describe('Fees related information.'),
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
  prompt: `You are an AI admission counselor providing information to prospective students.

  Use the following information to answer the student's query. Be concise and helpful.

  Course Details: {{{courseDetails}}}
  Fees Information: {{{feesInformation}}}
  Eligibility Criteria: {{{eligibilityCriteria}}}
  Facilities Information: {{{facilitiesInformation}}}
  Contact Information: {{{contactInformation}}}

  Student Query: {{{query}}}`,
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
