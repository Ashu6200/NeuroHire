const PLAN_CODES = {
  FREE: 'free',
  PRO: 'pro',
  MAX: 'max',
};

const PLAN_RANK = {
  [PLAN_CODES.FREE]: 0,
  [PLAN_CODES.PRO]: 1,
  [PLAN_CODES.MAX]: 2,
};

const PLAN_LIMITS = {
  [PLAN_CODES.FREE]: {
    mockInterviewsCreated: 3,
    questionRegenerations: 3,
    aiGenerations: 10,
    resumeExports: 1,
  },
  [PLAN_CODES.PRO]: {
    mockInterviewsCreated: 50,
    questionRegenerations: 50,
    aiGenerations: 150,
    resumeExports: 10,
  },
  [PLAN_CODES.MAX]: {
    mockInterviewsCreated: 500,
    questionRegenerations: 500,
    aiGenerations: 500,
    resumeExports: 100,
  },
};

const PLAN_CATALOG = {
  [PLAN_CODES.FREE]: {
    code: PLAN_CODES.FREE,
    name: 'Free',
    amount: 0,
    currency: 'INR',
    interval: 'monthly',
    description: 'Start practicing with basic AI interview preparation.',
    features: [
      '3 mock interviews each month',
      '1 resume export each month',
      'Basic AI feedback', 
    ],
    limits: PLAN_LIMITS[PLAN_CODES.FREE],
  },
  [PLAN_CODES.PRO]: {
    code: PLAN_CODES.PRO,
    name: 'Pro',
    amount: 49900,
    displayAmount: '₹499',
    currency: 'INR',
    interval: 'monthly',
    description: 'The complete career toolkit for serious job seekers looking to land their dream role.',
    features: [
      '50 Full AI Mock Interviews each month',
      '10 Premium Resume Exports each month',
      'Advanced performance analytics & insights',
      'Industry-specific interview question sets',
      'Priority email and chat support',
    ],
    limits: PLAN_LIMITS[PLAN_CODES.PRO],
  },
  [PLAN_CODES.MAX]: {
    code: PLAN_CODES.MAX,
    name: 'Max',
    amount: 99900,
    displayAmount: '₹999',
    currency: 'INR',
    interval: 'monthly',
    description: 'The ultimate power-user plan for total interview mastery and priority AI access.',
    features: [
      '500 Comprehensive Mock Interviews & AI generations',
      '100 Premium Resume Exports with exclusive templates',
      'Voice-enabled interview simulations & body language analysis',
      'Priority access to latest AI models (GPT-4o/Claude 3)',
      '1-on-1 AI Career Coaching & Personalized Roadmap',
    ],
    limits: PLAN_LIMITS[PLAN_CODES.MAX],
  },
};

const USAGE_METRICS = {
  MOCK_INTERVIEWS_CREATED: 'mockInterviewsCreated',
  QUESTION_REGENERATIONS: 'questionRegenerations',
  AI_GENERATIONS: 'aiGenerations',
  RESUME_EXPORTS: 'resumeExports',
};

module.exports = {
  PLAN_CATALOG,
  PLAN_CODES,
  PLAN_LIMITS,
  PLAN_RANK,
  USAGE_METRICS,
};
