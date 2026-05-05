const { default: OpenAI } = require('openai');
const { config } = require('../config/config');
const logger = require('../utils/logger');

const OPENAI_API_KEY = config.OPENAI_API_KEY;
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENAI_API_KEY,
});

async function callWithRetry(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (err) {
    if (err.code === 429 && retries > 0) {
      logger.warn('AI rate limited, retrying', { delay, retries });
      await new Promise((res) => setTimeout(res, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

function extractText(rawContent) {
  let text = Array.isArray(rawContent)
    ? rawContent
        .filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n')
        .trim()
    : rawContent?.trim();
  return text ? text.replace(/```json|```/g, '').trim() : '';
}

const generateQuestions = async (
  role,
  domain,
  experienceLevel,
  preferredCandidateProfile,
  companyName,
  jobProfileDescription,
  technicalDifficulty,
  behavioralDifficulty,
  situationalDifficulty,
  generalDifficulty,
) => {
  try {
    const prompt = `You are a senior interviewer simulating a mock interview for the position of ${role} in the ${domain} domain. The interview is intended for a ${experienceLevel}-level candidate. The entire question set should be inspired by the following detailed candidate profile:

**Preferred Candidate Profile:**
"${preferredCandidateProfile}"

**Interview Context:**
- Role: ${role}
- Company: ${companyName || 'A modern tech-driven organization'}
- Job Description: "${jobProfileDescription}"
- Technical Difficulty: ${technicalDifficulty}
- Behavioral Difficulty: ${behavioralDifficulty}
- Situational Difficulty: ${situationalDifficulty}
- General Difficulty: ${generalDifficulty}

**Guidelines for Questions:**
1. Generate 20-30 unique questions total.
 2. Cover each type:
        - **Technical** (3–4): Based on problem-solving ability, system thinking, or domain-relevant expertise reflected in the profile.
        - **Behavioral** (2–3): Focus on culture fit, leadership, communication, and collaboration styles derived from the profile.
        - **Situational** (1–2): Pose complex, realistic work situations aligned with the profile's expected responsibilities or mindset.
        - **General** (1–2): Broader insights into the candidate's motivations, awareness of trends, or approach to growth.

**Output Format:**
Return ONLY a valid JSON array (no markdown, no code fences, no explanations).
Each item must contain:
- questionText: The question string
- questionType: One of ["technical", "behavioral", "situational", "general"]`;

    const completion = await callWithRetry(() =>
      openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
      }),
    );
    const rawText = extractText(completion.choices[0]?.message?.content);
    let questionSet;
    try {
      questionSet = JSON.parse(rawText);
    } catch (parseError) {
      logger.error('Failed to parse AI output', { error: parseError.message });
      throw new Error('Invalid JSON from AI');
    }

    return questionSet;
  } catch (error) {
    logger.error('Error generating questions', { error: error.message });
    throw error;
  }
};

/**
 * Generate enhanced per-question feedback for Pro/Max users.
 * @param {object} interview - MockInterview document
 * @param {Array} qa - Array of { question, userAnswer, aiFeedback }
 */
const generateEnhancedFeedback = async (interview, qa) => {
  const qaBlock = qa
    .map(
      (item, i) =>
        `Q${i + 1} [${item.question?.questionType || 'general'}]: ${item.question?.questionText || item.question}
Answer: ${item.userAnswer || '(no answer)'}
Basic feedback: ${item.aiFeedback?.score ?? 'N/A'}/10 — ${item.aiFeedback?.strengths?.join(', ') || ''}`
    )
    .join('\n\n');

  const prompt = `You are a senior interview coach reviewing a completed mock interview. Provide enhanced, actionable feedback.

**Interview Context:**
- Role: ${interview.role}
- Domain: ${interview.domain}
- Experience Level: ${interview.experienceLevel}
- Company: ${interview.companyName || 'N/A'}

**Question & Answer Pairs:**
${qaBlock}

**Your Task:**
Analyze the candidate's overall performance and provide:
1. A per-question enhanced breakdown
2. Overall scores across dimensions
3. Specific recommendations

**Output Format:**
Return ONLY a valid JSON object (no markdown, no code fences) with this exact shape:
{
  "overallScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "technicalDepthScore": <number 0-100>,
  "starMethodScore": <number 0-100>,
  "perQuestion": [
    {
      "index": <number>,
      "score": <number 0-10>,
      "starMethodUsed": <boolean>,
      "strengths": [<string>],
      "areasToImprove": [<string>],
      "suggestedAnswer": <string>
    }
  ],
  "recommendations": [<string>],
  "overallSummary": <string>
}`;

  const completion = await callWithRetry(() =>
    openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    }),
  );
  const rawText = extractText(completion.choices[0]?.message?.content);
  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON from AI (enhanced feedback)');
  }
};

/**
 * Generate skill gap analysis for Max users.
 * @param {object} interview - MockInterview document
 * @param {Array} qa - Array of { question, userAnswer, aiFeedback }
 */
const generateSkillGap = async (interview, qa) => {
  const qaBlock = qa
    .map(
      (item, i) =>
        `Q${i + 1}: ${item.question?.questionText || item.question}
Answer: ${item.userAnswer || '(no answer)'}`
    )
    .join('\n\n');

  const prompt = `You are a career development expert. Analyse a candidate's mock interview responses to identify skill gaps and strengths for the target role.

**Target Role:** ${interview.role}
**Domain:** ${interview.domain}
**Experience Level Required:** ${interview.experienceLevel}
**Job Description:** ${interview.jobProfileDescription}
**Preferred Candidate Profile:** ${interview.preferredCandidateProfile}

**Interview Q&A:**
${qaBlock}

**Output Format:**
Return ONLY a valid JSON object (no markdown, no code fences) with this exact shape:
{
  "overallReadiness": <number 0-100>,
  "strengths": [<string>],
  "skillGaps": [
    {
      "skill": <string>,
      "currentLevel": <"none"|"beginner"|"intermediate"|"advanced">,
      "requiredLevel": <"beginner"|"intermediate"|"advanced"|"expert">,
      "improvementTip": <string>,
      "resources": [<string>]
    }
  ],
  "priorityActions": [<string>],
  "estimatedReadinessTimeline": <string>
}`;

  const completion = await callWithRetry(() =>
    openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    }),
  );
  const rawText = extractText(completion.choices[0]?.message?.content);
  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON from AI (skill gap)');
  }
};

/**
 * Generate JD match score for Pro+ users.
 * @param {string} userProfile - Candidate profile text
 * @param {string} jobDescription - Job description text
 */
const generateJdMatch = async (userProfile, jobDescription) => {
  const prompt = `You are a recruiting expert. Evaluate how well a candidate profile matches a job description.

**Job Description:**
${jobDescription}

**Candidate Profile:**
${userProfile}

**Output Format:**
Return ONLY a valid JSON object (no markdown, no code fences) with this exact shape:
{
  "matchScore": <number 0-100>,
  "matchedSkills": [<string>],
  "missingSkills": [<string>],
  "highlights": [<string>],
  "suggestions": [<string>],
  "summary": <string>
}`;

  const completion = await callWithRetry(() =>
    openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    }),
  );
  const rawText = extractText(completion.choices[0]?.message?.content);
  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON from AI (JD match)');
  }
};

module.exports = { generateQuestions, generateEnhancedFeedback, generateSkillGap, generateJdMatch };
