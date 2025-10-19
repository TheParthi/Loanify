import { config } from 'dotenv';
config();

import '@/ai/flows/check-customer-eligibility.ts';
import '@/ai/flows/generate-loan-evaluation-report.ts';