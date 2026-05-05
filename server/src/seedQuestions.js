require('dotenv').config();
const connectDB = require('./config/db');
const { QuestionModel } = require('./models');

const sampleQuestions = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    category: 'Technical',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    solution: '```javascript\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n```'
  },
  {
    title: 'Tell me about a time you failed',
    description: 'This is a classic behavioral question. Interviewers want to see how you handle setbacks, what you learn from them, and how you take accountability.\n\nUse the STAR method:\n- **S**ituation: Set the scene.\n- **T**ask: What was your responsibility?\n- **A**ction: What did you do? (Focus on your actions, even if they led to the failure, and then how you mitigated it).\n- **R**esult: What was the outcome and what did you learn?',
    category: 'Behavioral',
    difficulty: 'Medium',
    tags: ['Failure', 'Accountability', 'STAR Method'],
    solution: 'A good answer focuses 20% on the failure itself and 80% on the lessons learned and steps taken to prevent it from happening again. Avoid blaming others.'
  },
  {
    title: 'Design a URL Shortener (e.g. TinyURL)',
    description: 'Design a service like TinyURL that takes a long URL and generates a shorter, unique URL.\n\nKey constraints to consider:\n- High availability and scalability\n- Low latency for redirection\n- How to handle potential hash collisions\n- Read-heavy vs Write-heavy ratio',
    category: 'System Design',
    difficulty: 'Medium',
    tags: ['System Design', 'Hashing', 'Database'],
    solution: '1. **Requirements**: Calculate capacity (e.g., 100M URLs/month).\n2. **API Design**: `createShortUrl(longUrl)` and `getLogUrl(shortUrl)`.\n3. **Database**: Use a NoSQL DB (Cassandra/DynamoDB) or relational with sharding.\n4. **Encoding**: Base62 encoding on an auto-incrementing ID or MD5 hash of the long URL.\n5. **Cache**: Use Redis/Memcached to speed up redirection.'
  },
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: `head = [1,2,3,4,5]`\nOutput: `[5,4,3,2,1]`',
    category: 'Technical',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    solution: '```javascript\nfunction reverseList(head) {\n  let prev = null;\n  let current = head;\n  while (current !== null) {\n    let nextTemp = current.next;\n    current.next = prev;\n    prev = current;\n    current = nextTemp;\n  }\n  return prev;\n}\n```'
  }
];

const seedQuestions = async () => {
  try {
    await connectDB();
    await QuestionModel.deleteMany({}); // Clear existing
    console.log('Cleared existing questions');
    await QuestionModel.insertMany(sampleQuestions);
    console.log('Questions seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
