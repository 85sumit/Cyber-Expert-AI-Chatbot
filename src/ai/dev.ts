import { config } from 'dotenv';
config();

import '@/ai/flows/generate-security-script.ts';
import '@/ai/flows/identify-vulnerabilities.ts';
import '@/ai/flows/summarize-security-article.ts';
import '@/ai/flows/chat.ts';
