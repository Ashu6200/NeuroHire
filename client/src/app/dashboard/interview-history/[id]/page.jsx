'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Download,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  View,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const InterviewHistoryById = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const mockInterviewData = {
    id: 'as',
    jobProfile: {
      id: 'jp1',
      roleTitle: 'Frontend Developer',
      companyName: 'Tech Corp',
      experienceLevel: 'Mid-level',
      skills: ['React', 'TypeScript', 'CSS', 'Next.js'],
    },
    date: '2025-05-10T14:30:00Z',
    startedAt: '2025-05-10T14:30:00Z',
    endedAt: '2025-05-10T15:01:25Z',
    duration: 1885,
    totalScore: 8.2,
    qa: [
      {
        question: 'Tell me about your experience with React and TypeScript.',
        userAnswer:
          "I've been working with React for about 4 years and TypeScript for 3 years. I've built several large-scale applications using both technologies. I particularly enjoy how TypeScript enhances the development experience by providing type safety and better tooling. In my current role, I've implemented a component library using React and TypeScript that's used across multiple projects in our organization.",
        aiFeedback: {
          score: 9,
          strengths: [
            'Provided specific experience timeframes',
            'Mentioned concrete examples of work',
            'Explained personal value derived from the technologies',
            'Highlighted organizational impact',
          ],
          areasToImprove: [
            "Could have mentioned specific React features you're proficient with",
          ],
        },
      },
      {
        question: 'How do you handle state management in large applications?',
        userAnswer:
          "For state management in large applications, I typically use a combination of approaches depending on the specific needs. For global state, I've used Redux with Redux Toolkit to simplify the boilerplate. For more localized state, React's Context API works well. I also follow the principle of keeping state as close as possible to where it's needed, using component state when appropriate. In my experience, it's important to plan the state architecture early to avoid refactoring issues later.",
        aiFeedback: {
          score: 8.5,
          strengths: [
            'Demonstrated knowledge of multiple state management approaches',
            'Showed understanding of state locality principles',
            'Mentioned planning importance',
          ],
          areasToImprove: [
            'Could have mentioned performance considerations',
            "Could have discussed specific challenges you've overcome",
          ],
        },
      },
      {
        question:
          'Describe a challenging project you worked on and how you overcame obstacles.',
        userAnswer:
          'I worked on a real-time dashboard that needed to display data from multiple sources with frequent updates. The main challenge was performance - the initial implementation would slow down significantly after running for a few hours. I identified that we were creating too many unnecessary re-renders and implemented several optimizations: memoization with useMemo and useCallback, virtualized lists for long data sets, and debouncing rapid update events. I also implemented a web worker to handle data processing off the main thread. These changes improved performance by about 70%.',
        aiFeedback: {
          score: 9.5,
          strengths: [
            'Provided a specific, relevant example',
            'Clearly identified the core problem',
            'Listed multiple technical solutions implemented',
            'Quantified the improvement results',
          ],
          areasToImprove: ['Could have mentioned team collaboration aspects'],
        },
      },
      {
        question:
          'How do you stay updated with the latest frontend technologies?',
        userAnswer:
          "I follow several tech blogs and newsletters like JavaScript Weekly and React Status. I'm active on Twitter where I follow key developers in the React ecosystem. I also participate in local meetups and occasionally attend conferences. I like to experiment with new libraries and frameworks by building small projects on the weekends. Recently, I've been exploring React Server Components and the App Router in Next.js 13.",
        aiFeedback: {
          score: 8,
          strengths: [
            'Mentioned multiple learning sources',
            'Showed proactive learning through side projects',
            'Referenced specific current technologies',
          ],
          areasToImprove: [
            'Could have mentioned how you evaluate which new technologies to adopt',
            'Could have discussed how you share knowledge with your team',
          ],
        },
      },
      {
        question:
          "What's your approach to writing maintainable and scalable code?",
        userAnswer:
          "I believe in the importance of clean, well-documented code with consistent patterns. I use TypeScript for type safety and follow principles like DRY and SOLID. I'm a big advocate for automated testing - unit tests for business logic and component tests with React Testing Library. For larger applications, I prefer a modular architecture with clear boundaries between features. Code reviews are also essential - I always seek feedback from teammates to improve quality and share knowledge.",
        aiFeedback: {
          score: 7.5,
          strengths: [
            'Mentioned important coding principles',
            'Emphasized testing importance',
            'Discussed architectural considerations',
            'Highlighted collaborative aspects',
          ],
          areasToImprove: [
            'Could have provided a specific example of refactoring for maintainability',
            'Could have discussed documentation practices in more detail',
            'Could have mentioned performance considerations',
          ],
        },
      },
    ],
    summary:
      'You demonstrated strong technical knowledge and communication skills throughout the interview. Your answers were well-structured and included specific examples from your experience. You showed good understanding of React, TypeScript, and state management concepts. Areas for improvement include providing more details on performance optimization strategies and discussing team collaboration aspects in more depth.',
    skillScores: {
      'Technical Knowledge': 8.5,
      Communication: 8.0,
      'Problem Solving': 9.0,
      'Cultural Fit': 7.5,
      Experience: 8.0,
    },
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 8)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 6)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };
  return (
    <section className='p-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {'Interview Results'}
          </h1>
          <p className='text-muted-foreground'>
            {'Track your progress and see better interview outcomes.'}
          </p>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-2 mt-2'>
          <p className='text-muted-foreground'>
            {mockInterviewData.jobProfile.roleTitle}
          </p>
          <Badge variant='outline'>
            {mockInterviewData.jobProfile.companyName}
          </Badge>
          <Badge variant='outline'>{formatDate(mockInterviewData.date)}</Badge>
        </div>
        <div className='flex gap-4 items-center'>
          <Button className='gap-2'>
            <View className='h-4 w-4' />
            View Profile
          </Button>
          <Button variant='outline' className='gap-2'>
            <Download className='h-4 w-4' />
            Export Report
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3 mt-4'>
        <Card
          className={
            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
          }
        >
          <CardHeader className=''>
            <CardTitle className='text-sm font-medium'>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold ${getScoreColor(
                mockInterviewData.totalScore,
              )}`}
            >
              {mockInterviewData.totalScore.toFixed(1)}
              <span className='text-base font-normal text-muted-foreground'>
                /10
              </span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
          }
        >
          <CardHeader className=''>
            <CardTitle className='text-sm font-medium'>Duration</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <Clock className='h-5 w-5 text-muted-foreground' />
            <div className='text-2xl font-bold'>
              {formatDuration(mockInterviewData.duration)}
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
          }
        >
          <CardHeader className=''>
            <CardTitle className='text-sm font-medium'>Questions</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5 text-muted-foreground' />
            <div className='text-2xl font-bold'>
              {mockInterviewData.qa.length}{' '}
              <span className='text-base font-normal text-muted-foreground'>
                answered
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue='summary'
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4 mt-4'
      >
        <TabsList className='grid grid-cols-3 w-full border shadow-xs dark:bg-input/30 dark:border-input'>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='questions'>Questions & Answers</TabsTrigger>
          <TabsTrigger value='skills'>Skills Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value='summary' className='space-y-4'>
          <Card
            className={
              'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
            }
          >
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
              <CardDescription>
                AI-generated summary of your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='whitespace-pre-line'>{mockInterviewData.summary}</p>
            </CardContent>
          </Card>

          <Card
            className={
              'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
            }
          >
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Breakdown of your performance by skill area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {Object.entries(mockInterviewData.skillScores).map(
                  ([skill, score]) => (
                    <div key={skill}>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-sm font-medium'>{skill}</span>
                        <span
                          className={`text-sm font-medium ${getScoreColor(
                            score,
                          )}`}
                        >
                          {score.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={score * 10} className='h-2' />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full' asChild>
                <Link
                  href={`/dashboard/job-profiles/${mockInterviewData.jobProfile.id}`}
                >
                  Practice Again
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='questions' className='space-y-4'>
          <Card
            className={
              'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
            }
          >
            <CardHeader>
              <CardTitle>Questions & Answers</CardTitle>
              <CardDescription>
                Detailed feedback on each of your responses
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {mockInterviewData.qa.map((qa, index) => (
                <div key={index} className='space-y-4'>
                  {index > 0 && <Separator className='my-6' />}
                  <div>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='font-medium text-lg'>
                        Question {index + 1}
                      </h3>
                      <Badge
                        className={getScoreBadgeColor(qa.aiFeedback.score)}
                      >
                        Score: {qa.aiFeedback.score.toFixed(1)}/10
                      </Badge>
                    </div>
                    <p className='text-muted-foreground mb-4'>{qa.question}</p>
                    <div className='bg-muted/30 p-4 rounded-lg mb-4'>
                      <h4 className='text-sm font-medium mb-2'>Your Answer:</h4>
                      <p>{qa.userAnswer}</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <ThumbsUp className='h-4 w-4 text-green-600' />
                          <h4 className='font-medium'>Strengths</h4>
                        </div>
                        <ul className='space-y-1 list-disc list-inside text-sm'>
                          {qa.aiFeedback.strengths.map((strength, i) => (
                            <li key={i} className='text-muted-foreground'>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <ThumbsDown className='h-4 w-4 text-yellow-600' />
                          <h4 className='font-medium'>Areas to Improve</h4>
                        </div>
                        <ul className='space-y-1 list-disc list-inside text-sm'>
                          {qa.aiFeedback.areasToImprove.map((area, i) => (
                            <li key={i} className='text-muted-foreground'>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='skills' className='space-y-4'>
          <Card
            className={
              'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
            }
          >
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of your skills based on your answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <h3 className='font-medium mb-4'>Technical Knowledge</h3>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm'>Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        mockInterviewData.skillScores['Technical Knowledge'],
                      )}`}
                    >
                      {mockInterviewData.skillScores[
                        'Technical Knowledge'
                      ].toFixed(1)}
                      /10
                    </span>
                  </div>
                  <Progress
                    value={
                      mockInterviewData.skillScores['Technical Knowledge'] * 10
                    }
                    className='h-2 mb-4'
                  />
                  <p className='text-sm text-muted-foreground'>
                    You demonstrated strong knowledge of React, TypeScript, and
                    state management. Your explanations of technical concepts
                    were clear and showed depth of understanding. Consider
                    expanding your knowledge of performance optimization
                    techniques.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-medium mb-4'>Communication</h3>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm'>Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        mockInterviewData.skillScores['Communication'],
                      )}`}
                    >
                      {mockInterviewData.skillScores['Communication'].toFixed(
                        1,
                      )}
                      /10
                    </span>
                  </div>
                  <Progress
                    value={mockInterviewData.skillScores['Communication'] * 10}
                    className='h-2 mb-4'
                  />
                  <p className='text-sm text-muted-foreground'>
                    Your answers were well-structured and easy to follow. You
                    provided specific examples to illustrate your points. To
                    improve, consider using more concise language in some
                    responses and ensuring you fully address all parts of
                    multi-part questions.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-medium mb-4'>Problem Solving</h3>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm'>Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        mockInterviewData.skillScores['Problem Solving'],
                      )}`}
                    >
                      {mockInterviewData.skillScores['Problem Solving'].toFixed(
                        1,
                      )}
                      /10
                    </span>
                  </div>
                  <Progress
                    value={
                      mockInterviewData.skillScores['Problem Solving'] * 10
                    }
                    className='h-2 mb-4'
                  />
                  <p className='text-sm text-muted-foreground'>
                    You excelled in describing your approach to solving complex
                    problems. Your example of optimizing the real-time dashboard
                    showed strong analytical skills and a methodical approach to
                    troubleshooting.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-medium mb-4'>Cultural Fit</h3>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm'>Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        mockInterviewData.skillScores['Cultural Fit'],
                      )}`}
                    >
                      {mockInterviewData.skillScores['Cultural Fit'].toFixed(1)}
                      /10
                    </span>
                  </div>
                  <Progress
                    value={mockInterviewData.skillScores['Cultural Fit'] * 10}
                    className='h-2 mb-4'
                  />
                  <p className='text-sm text-muted-foreground'>
                    You mentioned collaboration and knowledge sharing, which are
                    positive indicators for team fit. To improve, consider
                    discussing more about how you handle conflicts or
                    challenging team dynamics.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-medium mb-4'>Experience</h3>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm'>Score</span>
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        mockInterviewData.skillScores['Experience'],
                      )}`}
                    >
                      {mockInterviewData.skillScores['Experience'].toFixed(1)}
                      /10
                    </span>
                  </div>
                  <Progress
                    value={mockInterviewData.skillScores['Experience'] * 10}
                    className='h-2 mb-4'
                  />
                  <p className='text-sm text-muted-foreground'>
                    Your 4 years of React experience and specific project
                    examples demonstrated relevant expertise for the role. To
                    strengthen this area, consider highlighting more leadership
                    experiences or instances where you influenced technical
                    decisions.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline' asChild>
                <Link href='/dashboard/history'>Back to History</Link>
              </Button>
              <Button asChild>
                <Link
                  href={`/dashboard/interview/${mockInterviewData.jobProfile.id}`}
                >
                  Practice Again
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default InterviewHistoryById;
