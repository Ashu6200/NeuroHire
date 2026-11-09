const mongoose = require('mongoose');
const { MockInterviewModel, InterviewResultModel, UserModel, ResumeModel } = require('../src/models');
const connectDB = require('../src/config/db');
require('dotenv').config();

const seed = async () => {
  try {
    await connectDB();
    
    // Target the specific test user
    let user = await UserModel.findOne({ email: 'tester@nerohire.com' }) || await UserModel.findOne();
    if (!user) {
      console.log("⚠️ No user found. Creating a dummy user...");
      user = await UserModel.create({
        id: 'dummy-user-' + Date.now(),
        email: 'tester@nerohire.com',
        name: 'Beta Tester',
        role: 'user',
        status: 'active'
      });
    }
    
    const userId = user.id;
    console.log(`🌱 Seeding data for user: ${user.name} (${userId})`);

    // Clear existing dummy data if any (optional, but keeps things clean)
    // await MockInterviewModel.deleteMany({ userId });
    // await InterviewResultModel.deleteMany({ userId });

    // 1. Create a Mock Interview (Job Profile)
    const mockInterview = await MockInterviewModel.create({
      userId,
      title: 'Senior Frontend Engineer',
      companyName: 'Google',
      role: 'Frontend Engineer',
      domain: 'Software Engineering',
      experienceLevel: 'senior',
      technicalDifficulty: 'hard',
      behavioralDifficulty: 'medium',
      generalDifficulty: 'medium',
      situationalDifficulty: 'hard',
      jobProfileDescription: 'Looking for a senior React developer with strong system design skills and experience in distributed systems.',
      preferredCandidateProfile: '5+ years of experience in modern frontend frameworks, specifically React. Familiarity with Node.js and cloud infrastructure is a plus.',
      questionSet: [
        { questionText: 'Explain the internal working of React Fiber and how it enables concurrent rendering.', questionType: 'technical' },
        { questionText: 'Describe a time you had a significant technical disagreement with a teammate. How was it resolved?', questionType: 'behavioral' },
        { questionText: 'What are the pros and cons of using Micro-Frontends in a large-scale application?', questionType: 'technical' }
      ]
    });
    console.log('✅ Created Mock Interview Profile');

    // 2. Create several Interview Results (Attempts)
    const now = new Date();
    await InterviewResultModel.create([
      {
        userId,
        mockInterviewId: mockInterview._id,
        attemptedDate: new Date(now.getTime() - 3600000), // 1 hour ago
        startAt: new Date(now.getTime() - 3600000),
        endAt: new Date(now.getTime() - 1800000), // 30 mins session
        totalScore: 8.5,
        summary: 'Excellent technical depth and clear articulation of complex concepts. Communication was professional and engaging.',
        skillAssignment: {
          communicationScore: 88,
          technicalDepthScore: 92,
          starMethodScore: 75
        },
        qa: [
          {
            question: 'Explain the internal working of React Fiber.',
            userAnswer: 'React Fiber is the new reconciliation engine that allows for incremental rendering. It splits work into chunks and spreads it across multiple frames.',
            aiFeedback: {
              score: 9,
              strengths: ['Accurate definition', 'Mentioned incremental rendering'],
              areasToImprove: ['Could elaborate on the scheduler priority levels']
            }
          }
        ]
      },
      {
        userId,
        mockInterviewId: mockInterview._id,
        attemptedDate: new Date(now.getTime() - 86400000), // 1 day ago
        startAt: new Date(now.getTime() - 86400000),
        endAt: new Date(now.getTime() - 84600000),
        totalScore: 6.8,
        summary: 'Good start but struggled with the behavioral section. Needs more work on using the STAR method.',
        skillAssignment: {
          communicationScore: 70,
          technicalDepthScore: 80,
          starMethodScore: 45
        },
        qa: [
          {
            question: 'Describe a time you had a significant technical disagreement.',
            userAnswer: 'I once disagreed about using Redux vs Context. We talked about it and chose Redux.',
            aiFeedback: {
              score: 5,
              strengths: ['Identified a real scenario'],
              areasToImprove: ['Lacks specific Action and Result details (STAR method)']
            }
          }
        ]
      },
      {
        userId,
        mockInterviewId: mockInterview._id,
        attemptedDate: new Date(now.getTime() - 172800000), // 2 days ago
        startAt: new Date(now.getTime() - 172800000),
        endAt: new Date(now.getTime() - 171000000),
        totalScore: 5.5,
        summary: 'First attempt. Many areas to improve across all domains.',
        skillAssignment: {
          communicationScore: 55,
          technicalDepthScore: 60,
          starMethodScore: 30
        },
        qa: []
      }
    ]);
    console.log('✅ Created 3 Interview Attempt Results (History)');

    // 3. Create a Dummy Resume
    await ResumeModel.create({
      userId,
      title: 'Full Stack Developer Resume',
      canvasState: [
        {
          "id": "h1",
          "type": "text",
          "variant": "heading",
          "x": 50,
          "y": 48,
          "content": user.name || "Alex Smith",
          "color": "#0f172a",
          "fontSize": 34,
          "width": 500,
          "height": 52
        },
        {
          "id": "sub",
          "type": "text",
          "variant": "body",
          "x": 50,
          "y": 108,
          "content": "Senior Software Engineer · " + (user.email || "alex@example.com"),
          "color": "#64748b",
          "fontSize": 13,
          "width": 500,
          "height": 30
        },
        {
          "id": "div1",
          "type": "line",
          "x": 50,
          "y": 150,
          "points": [0, 0, 500, 0],
          "stroke": "#e2e8f0",
          "strokeWidth": 1.5
        }
      ],
      status: 'published'
    });
    console.log('✅ Created Sample Resume');

    console.log('\n🚀 Seeding completed successfully! You can now see the data in your Dashboard and History.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seed();
