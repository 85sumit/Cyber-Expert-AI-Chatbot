'use server';

/**
 * @fileOverview Summarizes a security article from a given URL.
 *
 * - summarizeSecurityArticle - A function that takes a URL as input and returns a summary of the article.
 * - SummarizeSecurityArticleInput - The input type for the summarizeSecurityArticle function.
 * - SummarizeSecurityArticleOutput - The return type for the summarizeSecurityArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractArticle} from '@/src/services/article-extractor';

const SummarizeSecurityArticleInputSchema = z.object({
  url: z.string().url().describe('The URL of the security article to summarize.'),
});
export type SummarizeSecurityArticleInput = z.infer<typeof SummarizeSecurityArticleInputSchema>;

const SummarizeSecurityArticleOutputSchema = z.object({
  summary: z.string().describe('A summary of the security article.'),
});
export type SummarizeSecurityArticleOutput = z.infer<typeof SummarizeSecurityArticleOutputSchema>;

export async function summarizeSecurityArticle(
  input: SummarizeSecurityArticleInput
): Promise<SummarizeSecurityArticleOutput> {
  return summarizeSecurityArticleFlow(input);
}

const summarizeSecurityArticlePrompt = ai.definePrompt({
  name: 'summarizeSecurityArticlePrompt',
  input: {schema: SummarizeSecurityArticleInputSchema},
  output: {schema: SummarizeSecurityArticleOutputSchema},
  prompt: `You are an expert cybersecurity analyst. Please summarize the key points of the following security article. Be concise and focus on the most important information for a busy security professional.\n\nArticle: {{{article}}}`,
});

const summarizeSecurityArticleFlow = ai.defineFlow(
  {
    name: 'summarizeSecurityArticleFlow',
    inputSchema: SummarizeSecurityArticleInputSchema,
    outputSchema: SummarizeSecurityArticleOutputSchema,
  },
  async input => {
    const articleContent = await extractArticle(input.url);
    const {output} = await summarizeSecurityArticlePrompt({article: articleContent});
    return output!;
  }
);
