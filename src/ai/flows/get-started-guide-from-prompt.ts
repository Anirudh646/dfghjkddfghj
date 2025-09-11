'use server';

/**
 * @fileOverview Generates a personalized, step-by-step guide for prospective students based on their interests, leveraging university-specific information.
 *
 * - getStartedGuideFromPrompt - A function that generates a personalized guide.
 * - GetStartedGuideFromPromptInput - The input type for the getStartedGuideFromPrompt function.
 * - GetStartedGuideFromPromptOutput - The return type for the getStartedGuideFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetStartedGuideFromPromptInputSchema = z.object({
  studyInterest: z
    .string()
    .describe("The student's area of interest (e.g., 'Computer Science', 'Biology')."),
  universityCourses: z.string().optional().describe('Course catalog information.'),
  admissionRequirements: z.string().optional().describe('Admission requirements information.'),
  financialAidOptions: z.string().optional().describe('Financial aid options information.'),
  studentLifeInfo: z.string().optional().describe('Information about student life.'),
});
export type GetStartedGuideFromPromptInput = z.infer<
  typeof GetStartedGuideFromPromptInputSchema
>;

const GetStartedGuideFromPromptOutputSchema = z.object({
  guide: z.string().describe('A step-by-step guide tailored to the student, formatted as a single paragraph.'),
});
export type GetStartedGuideFromPromptOutput = z.infer<
  typeof GetStartedGuideFromPromptOutputSchema
>;

export async function getStartedGuideFromPrompt(
  input: GetStartedGuideFromPromptInput
): Promise<GetStartedGuideFromPromptOutput> {
  return getStartedGuideFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getStartedGuideFromPromptPrompt',
  input: {schema: GetStartedGuideFromPromptInputSchema},
  output: {schema: GetStartedGuideFromPromptOutputSchema},
  prompt: `You are an AI assistant designed to provide prospective students with a detailed, step-by-step guide on how to get started in their field of study at our university.

  Based on the student's interest and the information available about our university, craft a personalized guide that covers relevant courses, admission requirements, financial aid options, and student life.

  Student's Interest: {{{studyInterest}}}
  University Courses: {{{universityCourses}}}
  Admission Requirements: {{{admissionRequirements}}}
  Financial Aid Options: {{{financialAidOptions}}}
  Student Life Information: {{{studentLifeInfo}}}

  The guide should be comprehensive and easy to follow. **You must format your response as a step-by-step guide as a single paragraph.**
  Be sure to include resources or contact information when necessary.
  `,
});

const getStartedGuideFromPromptFlow = ai.defineFlow(
  {
    name: 'getStartedGuideFromPromptFlow',
    inputSchema: GetStartedGuideFromPromptInputSchema,
    outputSchema: GetStartedGuideFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
