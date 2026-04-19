const { default: OpenAI } = require('openai');
const { config } = require('../config/config');

const OPENAI_API_KEY = config.OPENAI_API_KEY;
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENAI_API_KEY,
});
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
        - **Situational** (1–2): Pose complex, realistic work situations aligned with the profile’s expected responsibilities or mindset.
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
    const rawContent = completion.choices[0]?.message?.content;
    let rawText = Array.isArray(rawContent)
      ? rawContent
          .filter((c) => c.type === 'text')
          .map((c) => c.text)
          .join('\n')
          .trim()
      : rawContent?.trim();

    rawText = rawText.replace(/```json|```/g, '').trim();
    let questionSet;
    try {
      questionSet = JSON.parse(rawText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI output:', parseError);
      throw new Error('Invalid JSON from AI');
    }

    console.log('Generated Questions:', questionSet);
    return questionSet;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
async function callWithRetry(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (err) {
    if (err.code === 429 && retries > 0) {
      console.warn(`Rate limited, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

const evaluateInterview = async () => {
  try {
    const prompt = `
    
    
    
        `;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

module.exports = { generateQuestions };
