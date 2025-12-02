'use server';

/**
 * @fileOverview A code vulnerability identification AI agent.
 *
 * - identifyVulnerabilities - A function that handles the code vulnerability identification process.
 * - IdentifyVulnerabilitiesInput - The input type for the identifyVulnerabilities function.
 * - IdentifyVulnerabilitiesOutput - The return type for the identifyVulnerabilities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyVulnerabilitiesInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to analyze for vulnerabilities.'),
  language: z.string().describe('The programming language of the code snippet.'),
});
export type IdentifyVulnerabilitiesInput = z.infer<typeof IdentifyVulnerabilitiesInputSchema>;

const IdentifyVulnerabilitiesOutputSchema = z.object({
  vulnerabilities: z
    .array(z.string())
    .describe('A list of potential vulnerabilities found in the code snippet.'),
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions for fixing the identified vulnerabilities.'),
});
export type IdentifyVulnerabilitiesOutput = z.infer<typeof IdentifyVulnerabilitiesOutputSchema>;

export async function identifyVulnerabilities(
  input: IdentifyVulnerabilitiesInput
): Promise<IdentifyVulnerabilitiesOutput> {
  return identifyVulnerabilitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyVulnerabilitiesPrompt',
  input: {schema: IdentifyVulnerabilitiesInputSchema},
  output: {schema: IdentifyVulnerabilitiesOutputSchema},
  prompt: `You are a cybersecurity expert specializing in identifying vulnerabilities in code.

You will be provided with a code snippet and the programming language it is written in.

Your task is to identify potential vulnerabilities in the code and provide suggestions for fixing them.

Language: {{{language}}}
Code Snippet:
\`\`\`{{{language}}}
{{{codeSnippet}}}
\`\`\`

Vulnerabilities:
{{#each vulnerabilities}}- {{{this}}}
{{/each}}

Suggestions:
{{#each suggestions}}- {{{this}}}
{{/each}}`,
});

const identifyVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'identifyVulnerabilitiesFlow',
    inputSchema: IdentifyVulnerabilitiesInputSchema,
    outputSchema: IdentifyVulnerabilitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
