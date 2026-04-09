import { Vertical } from '@/types/scorecard';

export interface QuestionOption {
  label: string;
  score: number; // 0, 0.5, or 1.0
}

export interface Question {
  id: string;
  text: string;
  type: 'radio';
  weight: number; // weight within dimension (as decimal, e.g. 0.25)
  options: QuestionOption[];
}

export interface Dimension {
  number: number;
  name: string;
  overallWeight: number; // weight toward overall score (as decimal)
  questions: Question[];
}

// ---------- Dimension 1: Data Asset Inventory (vertical-specific) ----------

const dim1Dental: Question[] = [
  {
    id: 'd1q1',
    text: 'What is your primary practice management system?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Dentrix / Eaglesoft / Open Dental', score: 1.0 },
      { label: 'Other digital system', score: 0.5 },
      { label: 'Paper-based or mixed', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of patient records are available digitally?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '5+ years', score: 1.0 },
      { label: '2–4 years', score: 0.5 },
      { label: 'Less than 2 years', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'Do you have digital X-ray / imaging archives?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, fully digital and organized', score: 1.0 },
      { label: 'Partially digital', score: 0.5 },
      { label: 'No / paper only', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Do you track treatment acceptance rates and no-show patterns?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, systematically tracked', score: 1.0 },
      { label: 'Informally tracked', score: 0.5 },
      { label: 'Not tracked', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim1Mortgage: Question[] = [
  {
    id: 'd1q1',
    text: 'What is your primary loan origination system (LOS)?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Encompass / Blend / BytePro / major LOS', score: 1.0 },
      { label: 'Other digital system', score: 0.5 },
      { label: 'Spreadsheets or manual', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of closed loan data are available?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '5+ years', score: 1.0 },
      { label: '2–4 years', score: 0.5 },
      { label: 'Less than 2 years', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'Are loan documents digitized and searchable?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, fully digitized with classification', score: 1.0 },
      { label: 'Partially digitized', score: 0.5 },
      { label: 'Mostly paper / scanned PDFs only', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Do you track underwriting decision logs and pipeline data?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, systematically', score: 1.0 },
      { label: 'Partially', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim1HealthcareSaas: Question[] = [
  {
    id: 'd1q1',
    text: 'What EHR system is in use?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Epic / Cerner / athenahealth / major EHR', score: 1.0 },
      { label: 'Other digital EHR', score: 0.5 },
      { label: 'No EHR / paper-based', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of patient/claims data are available?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '5+ years', score: 1.0 },
      { label: '2–4 years', score: 0.5 },
      { label: 'Less than 2 years', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'Do you have prior authorization histories?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, structured and accessible', score: 1.0 },
      { label: 'Partially structured', score: 0.5 },
      { label: 'No / not accessible', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Do you track patient outcome data?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, systematically', score: 1.0 },
      { label: 'Informally', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim1Fintech: Question[] = [
  {
    id: 'd1q1',
    text: 'What is your core transaction data system?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Core banking platform / payment processor with API', score: 1.0 },
      { label: 'Digital but limited API access', score: 0.5 },
      { label: 'Manual / spreadsheet-based', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of transaction history are available?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '5+ years', score: 1.0 },
      { label: '2–4 years', score: 0.5 },
      { label: 'Less than 2 years', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'Are KYC/AML records structured and machine-readable?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, fully structured', score: 1.0 },
      { label: 'Partially', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Do you track behavioral data (payment patterns, churn signals)?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, systematically', score: 1.0 },
      { label: 'Informally', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim1B2c: Question[] = [
  {
    id: 'd1q1',
    text: 'Do you use a customer data platform or CRM?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Dedicated CDP or CRM with full purchase history', score: 1.0 },
      { label: 'Basic CRM or e-commerce platform data', score: 0.5 },
      { label: 'No structured customer database', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of customer purchase / behavior history do you have?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '3+ years', score: 1.0 },
      { label: '1–2 years', score: 0.5 },
      { label: 'Less than 1 year', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'Do you capture browse/click/abandonment behavior?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, full behavioral tracking', score: 1.0 },
      { label: 'Partial (e.g. purchases only)', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Do you have customer content — reviews, support tickets, UGC?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, substantial archive', score: 1.0 },
      { label: 'Some', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

// ---------- Dimensions 2–6: Same for all verticals ----------

const dim2Questions: Question[] = [
  {
    id: 'd2q1',
    text: 'Where does your primary data live?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Cloud-based with API access', score: 1.0 },
      { label: 'Cloud-based, limited API', score: 0.5 },
      { label: 'On-premise or local servers', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q2',
    text: 'Do your core systems have API or webhook capability?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Yes, actively used', score: 1.0 },
      { label: 'Available but not used', score: 0.5 },
      { label: 'No API access', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q3',
    text: 'Do you have a data warehouse or analytics layer?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes (Snowflake / BigQuery / Redshift / etc.)', score: 1.0 },
      { label: 'Basic (spreadsheets / simple exports)', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q4',
    text: 'How would you describe your current automation level?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Significant automation in place', score: 1.0 },
      { label: 'Some automation', score: 0.5 },
      { label: 'Mostly manual processes', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim3Questions: Question[] = [
  {
    id: 'd3q1',
    text: 'Has anyone on your team used AI tools for work tasks?',
    type: 'radio',
    weight: 0.40,
    options: [
      { label: 'Yes, regularly', score: 1.0 },
      { label: 'Yes, occasionally', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd3q2',
    text: 'Do you have anyone who could manage an AI implementation?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Yes, internal capability', score: 1.0 },
      { label: 'Could learn with support', score: 0.5 },
      { label: 'No internal capability', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd3q3',
    text: 'How would you describe leadership\'s attitude toward AI?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Actively pushing for AI adoption', score: 1.0 },
      { label: 'Open but waiting for proof', score: 0.5 },
      { label: 'Skeptical or resistant', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim4Questions: Question[] = [
  {
    id: 'd4q1',
    text: 'What percentage of your core workflows are fully digital?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '75%+', score: 1.0 },
      { label: '25–74%', score: 0.5 },
      { label: 'Less than 25%', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q2',
    text: 'Have you attempted any process automation in the last 2 years?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, successfully deployed', score: 1.0 },
      { label: 'Tried but struggled', score: 0.5 },
      { label: 'No attempts', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q3',
    text: 'How complex are your highest-value manual processes?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Repetitive and rule-based (good for AI)', score: 1.0 },
      { label: 'Mixed — some judgment required', score: 0.5 },
      { label: 'Highly complex / judgment-heavy', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q4',
    text: 'Do you have documented process workflows or SOPs?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, well-documented', score: 1.0 },
      { label: 'Partially documented', score: 0.5 },
      { label: 'Not documented', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim5Questions: Question[] = [
  {
    id: 'd5q1',
    text: 'What is your anticipated AI investment budget (annual)?',
    type: 'radio',
    weight: 0.40,
    options: [
      { label: '$50K+', score: 1.0 },
      { label: '$10K–$49K', score: 0.5 },
      { label: 'Under $10K', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd5q2',
    text: 'What payback period would make an AI project worthwhile?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Under 12 months', score: 1.0 },
      { label: '12–24 months', score: 0.5 },
      { label: 'Over 24 months', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd5q3',
    text: 'Is there executive sponsorship for an AI initiative?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Yes, active sponsor', score: 1.0 },
      { label: 'Informal support', score: 0.5 },
      { label: 'No sponsorship', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim6Questions: Question[] = [
  {
    id: 'd6q1',
    text: 'What regulatory environment does your business operate in?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Heavily regulated (HIPAA / SOX / RESPA / PCI)', score: 0.5 },
      { label: 'Moderately regulated', score: 0.5 },
      { label: 'Lightly regulated', score: 1.0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd6q2',
    text: 'Do you have a formal data privacy policy?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Yes, documented and enforced', score: 1.0 },
      { label: 'Informal / in progress', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd6q3',
    text: 'Is your data access controlled (role-based permissions)?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes, strict controls', score: 1.0 },
      { label: 'Basic controls', score: 0.5 },
      { label: 'Open access', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd6q4',
    text: 'Have you had a security audit in the last 2 years?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes', score: 1.0 },
      { label: 'In progress', score: 0.5 },
      { label: 'No', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

// ---------- Dimension 1 lookup by vertical ----------

const dim1ByVertical: Record<Vertical, Question[]> = {
  dental: dim1Dental,
  mortgage: dim1Mortgage,
  healthcare_saas: dim1HealthcareSaas,
  fintech: dim1Fintech,
  b2c: dim1B2c,
};

// ---------- Public API ----------

export const DIMENSION_NAMES = [
  'Data Asset Inventory',
  'Technical Infrastructure',
  'Team AI Literacy',
  'Process Automation Maturity',
  'Budget & ROI Readiness',
  'Compliance & Security Posture',
] as const;

export const DIMENSION_WEIGHTS = [0.25, 0.20, 0.15, 0.20, 0.10, 0.10] as const;

export function getDimensions(vertical: Vertical): Dimension[] {
  return [
    { number: 1, name: DIMENSION_NAMES[0], overallWeight: DIMENSION_WEIGHTS[0], questions: dim1ByVertical[vertical] },
    { number: 2, name: DIMENSION_NAMES[1], overallWeight: DIMENSION_WEIGHTS[1], questions: dim2Questions },
    { number: 3, name: DIMENSION_NAMES[2], overallWeight: DIMENSION_WEIGHTS[2], questions: dim3Questions },
    { number: 4, name: DIMENSION_NAMES[3], overallWeight: DIMENSION_WEIGHTS[3], questions: dim4Questions },
    { number: 5, name: DIMENSION_NAMES[4], overallWeight: DIMENSION_WEIGHTS[4], questions: dim5Questions },
    { number: 6, name: DIMENSION_NAMES[5], overallWeight: DIMENSION_WEIGHTS[5], questions: dim6Questions },
  ];
}

export function calculateDimensionScore(
  questions: Question[],
  answers: Record<string, number>,
): number {
  let score = 0;
  for (const q of questions) {
    const answerScore = answers[q.id] ?? 0;
    score += answerScore * q.weight;
  }
  return Math.round(score * 100 * 100) / 100; // 0–100, 2 decimal places
}
