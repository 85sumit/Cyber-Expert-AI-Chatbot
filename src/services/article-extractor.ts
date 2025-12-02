'use server';

import { extract } from '@extractus/article-extractor';

export async function extractArticle(url: string): Promise<string> {
  try {
    const article = await extract(url);
    return article?.content || '';
  } catch (error) {
    console.error('Error extracting article:', error);
    return '';
  }
}
