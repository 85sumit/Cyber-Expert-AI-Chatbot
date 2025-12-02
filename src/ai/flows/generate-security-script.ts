// Implemented the GenerateSecurityScript flow to generate basic security scripts based on user input.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating security scripts based on a description provided by the user.
 *
 * It includes:
 * - generateSecurityScript: The main function to trigger the script generation flow.
 * - GenerateSecurityScriptInput: The input type for the generateSecurityScript function.
 * - GenerateSecurityScriptOutput: The output type for the generateSecurityScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSecurityScriptInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the security task for which a script should be generated.'
    ),
});
export type GenerateSecurityScriptInput = z.infer<
  typeof GenerateSecurityScriptInputSchema
>;

const GenerateSecurityScriptOutputSchema = z.object({
  script: z
    .string()
    .describe('The generated security script based on the provided description.'),
});
export type GenerateSecurityScriptOutput = z.infer<
  typeof GenerateSecurityScriptOutputSchema
>;

export async function generateSecurityScript(
  input: GenerateSecurityScriptInput
): Promise<GenerateSecurityScriptOutput> {
  return generateSecurityScriptFlow(input);
}

const generateSecurityScriptPrompt = ai.definePrompt({
  name: 'generateSecurityScriptPrompt',
  input: {schema: GenerateSecurityScriptInputSchema},
  output: {schema: GenerateSecurityScriptOutputSchema},
  prompt: `You are an expert cybersecurity engineer. Generate a basic security script to automate the following task, using best practices and industry standards. Return only the code:

Description: {{{description}}}`,
});

const generateSecurityScriptFlow = ai.defineFlow(
  {
    name: 'generateSecurityScriptFlow',
    inputSchema: GenerateSecurityScriptInputSchema,
    outputSchema: GenerateSecurityScriptOutputSchema,
  },
  async input => {
    const {output} = await generateSecurityScriptPrompt(input);
    return output!;
  }
);
