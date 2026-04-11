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

const dim1Crm: Question[] = [
  {
    id: 'd1q1',
    text: 'What is your primary CRM system?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Salesforce / HubSpot / Microsoft Dynamics', score: 1.0 },
      { label: 'Other dedicated CRM', score: 0.5 },
      { label: 'Spreadsheets or no CRM', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of deal and contact history are in your CRM?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: '5+ years', score: 1.0 },
      { label: '2–4 years', score: 0.5 },
      { label: 'Less than 2 years', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q3',
    text: 'How would you describe the quality and consistency of that data?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Clean, consistent, and well-structured', score: 1.0 },
      { label: 'Somewhat messy but usable', score: 0.5 },
      { label: 'Inconsistent or unreliable', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Are activity logs captured in your CRM (calls, emails, meetings, notes)?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes, consistently logged by the team', score: 1.0 },
      { label: 'Partially — some reps log, some don\'t', score: 0.5 },
      { label: 'No, minimal activity data', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q5',
    text: 'Do you track pipeline velocity and deal stage history internally?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes, systematically tracked', score: 1.0 },
      { label: 'Informally tracked', score: 0.5 },
      { label: 'Not tracked', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim1Erp: Question[] = [
  {
    id: 'd1q1',
    text: 'What is your primary ERP system?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'SAP / Oracle / NetSuite / Microsoft Dynamics ERP', score: 1.0 },
      { label: 'Mid-market ERP (Sage, Epicor, Infor, etc.)', score: 0.5 },
      { label: 'Spreadsheets or no ERP', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q2',
    text: 'How many years of financial and operational data are in your ERP?',
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
    text: 'Does your ERP data include inventory, procurement, and supply chain records?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, fully integrated', score: 1.0 },
      { label: 'Partially — some modules connected', score: 0.5 },
      { label: 'No, financials only', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd1q4',
    text: 'Is your ERP data accessible via API or data export for analysis?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, API available and used', score: 1.0 },
      { label: 'Export capability only', score: 0.5 },
      { label: 'No external access', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

// ---------- Dimensions 2–6: Shared defaults (with CRM overrides) ----------

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
    text: 'How automated are your internal back-office operations (billing, reporting, scheduling, data entry)?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Most back-office tasks are automated', score: 1.0 },
      { label: 'Some internal tasks automated, many still manual', score: 0.5 },
      { label: 'Almost all internal operations are manual', score: 0 },
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
    text: 'What percentage of your internal staff workflows (scheduling, reporting, approvals, data entry) are fully digital?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '75%+ of internal workflows are digital', score: 1.0 },
      { label: '25–74% are digital', score: 0.5 },
      { label: 'Less than 25% are digital', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q2',
    text: 'Have you attempted to automate any internal business processes (e.g. reporting, billing, scheduling, document handling) in the last 2 years?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, successfully deployed internal automation', score: 1.0 },
      { label: 'Tried but faced challenges', score: 0.5 },
      { label: 'No internal automation attempts', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q3',
    text: 'How would you describe your highest-value internal manual processes (e.g. claims processing, loan review, billing reconciliation, intake)?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Repetitive and rule-based — same steps every time', score: 1.0 },
      { label: 'Mixed — mostly consistent with some judgment calls', score: 0.5 },
      { label: 'Highly variable — require significant human judgment', score: 0 },
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

// ---------- CRM-specific overrides for Dimensions 2 & 4 ----------

const dim2Crm: Question[] = [
  {
    id: 'd2q1',
    text: 'Where does your CRM data live?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Cloud CRM with API access (Salesforce, HubSpot, etc.)', score: 1.0 },
      { label: 'Cloud CRM, limited API or export only', score: 0.5 },
      { label: 'On-premise or local database', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q2',
    text: 'Is your CRM integrated with other sales tools (email, calendar, dialer, marketing automation)?',
    type: 'radio',
    weight: 0.30,
    options: [
      { label: 'Yes, multiple integrations active', score: 1.0 },
      { label: 'One or two basic integrations', score: 0.5 },
      { label: 'No integrations — CRM is standalone', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q3',
    text: 'Do you have a data warehouse or BI layer connected to your CRM?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Yes (Snowflake / BigQuery / Looker / Tableau / etc.)', score: 1.0 },
      { label: 'Basic reporting (CRM dashboards / spreadsheet exports)', score: 0.5 },
      { label: 'No analytics layer', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd2q4',
    text: 'How automated are your internal sales operations (lead routing, follow-up sequences, reporting)?',
    type: 'radio',
    weight: 0.20,
    options: [
      { label: 'Most sales ops tasks are automated', score: 1.0 },
      { label: 'Some automation, many manual steps remain', score: 0.5 },
      { label: 'Almost all sales operations are manual', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim4Crm: Question[] = [
  {
    id: 'd4q1',
    text: 'What percentage of your sales workflows (lead qualification, follow-ups, proposals, handoffs) are fully digital?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: '75%+ of sales workflows are digital', score: 1.0 },
      { label: '25–74% are digital', score: 0.5 },
      { label: 'Less than 25% are digital', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q2',
    text: 'Have you automated any part of your sales process (e.g. lead scoring, email sequences, proposal generation) in the last 2 years?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, successfully deployed sales automation', score: 1.0 },
      { label: 'Tried but faced challenges', score: 0.5 },
      { label: 'No sales automation attempts', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q3',
    text: 'How would you describe your highest-value manual sales processes (e.g. lead qualification, deal review, forecasting)?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Repetitive and rule-based — same steps every time', score: 1.0 },
      { label: 'Mixed — mostly consistent with some judgment calls', score: 0.5 },
      { label: 'Highly variable — require significant rep judgment', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd4q4',
    text: 'Do you have documented sales playbooks or SOPs for your pipeline stages?',
    type: 'radio',
    weight: 0.25,
    options: [
      { label: 'Yes, well-documented playbooks', score: 1.0 },
      { label: 'Partially documented', score: 0.5 },
      { label: 'Not documented — reps follow their own process', score: 0 },
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
  crm: dim1Crm,
  erp: dim1Erp,
};

// ---------- Public API ----------

export const DIMENSION_NAMES = [
  'Data Asset Inventory',
  'Technical Infrastructure',
  'Team AI Literacy',
  'Process Automation Maturity',
  'Budget & ROI Readiness',
  'Compliance & Security Posture',
  'Use Case Clarity',
] as const;

export const DIMENSION_WEIGHTS = [0.20, 0.18, 0.15, 0.18, 0.14, 0.10, 0.05] as const;

// ---------- Dimension 7: Use Case Clarity (CRM-specific + default) ----------

const dim7CrmQuestions: Question[] = [
  {
    id: 'd7q1',
    text: 'How specific is your highest-priority AI use case?',
    type: 'radio',
    weight: 0.50,
    options: [
      { label: 'Very specific — I know exactly which process to automate first', score: 1.0 },
      { label: 'Exploring — I have a general area but need help narrowing down', score: 0.5 },
      { label: 'No idea — I know AI could help but don\'t know where to start', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd7q2',
    text: 'Which area would have the highest impact if automated with AI?',
    type: 'radio',
    weight: 0.50,
    options: [
      { label: 'Lead qualification and scoring', score: 1.0 },
      { label: 'Follow-up and outreach automation', score: 1.0 },
      { label: 'Pipeline forecasting and reporting', score: 1.0 },
      { label: 'Proposal and document generation', score: 1.0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

const dim7DefaultQuestions: Question[] = [
  {
    id: 'd7q1',
    text: 'How specific is your highest-priority AI use case?',
    type: 'radio',
    weight: 0.50,
    options: [
      { label: 'Very specific — I know exactly which process to automate first', score: 1.0 },
      { label: 'Exploring — I have a general area but need help narrowing down', score: 0.5 },
      { label: 'No idea — I know AI could help but don\'t know where to start', score: 0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
  {
    id: 'd7q2',
    text: 'Which area would have the highest impact if automated with AI?',
    type: 'radio',
    weight: 0.50,
    options: [
      { label: 'Document processing and data extraction', score: 1.0 },
      { label: 'Customer communication automation', score: 1.0 },
      { label: 'Reporting and analytics', score: 1.0 },
      { label: 'Compliance and risk monitoring', score: 1.0 },
      { label: 'Not sure / Doesn\'t apply', score: 0 },
    ],
  },
];

export function getDimensions(vertical: Vertical): Dimension[] {
  const dim2 = vertical === 'crm' ? dim2Crm : dim2Questions;
  const dim4 = vertical === 'crm' ? dim4Crm : dim4Questions;
  const dim7 = vertical === 'crm' ? dim7CrmQuestions : dim7DefaultQuestions;

  return [
    { number: 1, name: DIMENSION_NAMES[0], overallWeight: DIMENSION_WEIGHTS[0], questions: dim1ByVertical[vertical] },
    { number: 2, name: DIMENSION_NAMES[1], overallWeight: DIMENSION_WEIGHTS[1], questions: dim2 },
    { number: 3, name: DIMENSION_NAMES[2], overallWeight: DIMENSION_WEIGHTS[2], questions: dim3Questions },
    { number: 4, name: DIMENSION_NAMES[3], overallWeight: DIMENSION_WEIGHTS[3], questions: dim4 },
    { number: 5, name: DIMENSION_NAMES[4], overallWeight: DIMENSION_WEIGHTS[4], questions: dim5Questions },
    { number: 6, name: DIMENSION_NAMES[5], overallWeight: DIMENSION_WEIGHTS[5], questions: dim6Questions },
    { number: 7, name: DIMENSION_NAMES[6], overallWeight: DIMENSION_WEIGHTS[6], questions: dim7 },
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
