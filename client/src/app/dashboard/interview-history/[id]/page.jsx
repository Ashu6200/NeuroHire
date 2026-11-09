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
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { useGetInterviewResultByIdQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { format } from 'date-fns';

const InterviewHistoryById = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [activeTab, setActiveTab] = useState('summary');

  const { data: resultData, isLoading, isError } = useGetInterviewResultByIdQuery(id, { skip: !id });
  const result = resultData?.data?.result;
  const interview = result?.mockInterviewId || {};

  const formatDuration = (start, end) => {
    if (!start || !end) return '0m 0s';
    const seconds = Math.floor((new Date(end) - new Date(start)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM d, yyyy · hh:mm a');
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

  const skillScores = useMemo(() => {
    if (!result?.skillAssignment) return [];
    return [
      { name: 'Communication', score: result.skillAssignment.communicationScore / 10 || 0 },
      { name: 'Technical Depth', score: result.skillAssignment.technicalDepthScore / 10 || 0 },
      { name: 'STAR Method', score: result.skillAssignment.starMethodScore / 10 || 0 },
    ];
  }, [result]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-4'>
        <AlertCircle className='h-10 w-10 text-destructive' />
        <p className='text-muted-foreground'>Failed to load interview results.</p>
        <Button variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <section className='p-4'>
      <div className='mb-6'>
        <Button variant='ghost' className='mb-4 -ml-2 gap-2' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4' />
          Back to History
        </Button>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Interview Results
            </h1>
            <p className='text-muted-foreground'>
              Track your progress and see better interview outcomes.
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-2 mt-2'>
          <p className='font-semibold'>
            {interview.role || 'General Interview'}
          </p>
          {interview.companyName && (
            <Badge variant='outline'>
              {interview.companyName}
            </Badge>
          )}
          <Badge variant='secondary' className='text-[10px]'>
            {formatDate(result.createdAt)}
          </Badge>
        </div>
        <div className='flex gap-2 items-center'>
          <Button variant='outline' className='gap-2' asChild>
            <Link href={`/dashboard/mock-interviews/${interview._id}/attempts`}>
              <View className='h-4 w-4' />
              View All Attempts
            </Link>
          </Button>
          <Button variant='default' className='gap-2'>
            <Download className='h-4 w-4' />
            Export Report
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3 mt-4'>
        <Card className='border bg-background dark:bg-input/30'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getScoreColor(result.totalScore)}`}>
              {result.totalScore?.toFixed(1)}
              <span className='text-base font-normal text-muted-foreground ml-1'>/10</span>
            </div>
          </CardContent>
        </Card>
        <Card className='border bg-background dark:bg-input/30'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Duration</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <Clock className='h-5 w-5 text-muted-foreground' />
            <div className='text-2xl font-bold'>
              {formatDuration(result.startAt, result.endAt)}
            </div>
          </CardContent>
        </Card>
        <Card className='border bg-background dark:bg-input/30'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Questions</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5 text-muted-foreground' />
            <div className='text-2xl font-bold'>
              {result.qa?.length || 0}
              <span className='text-base font-normal text-muted-foreground ml-2'>answered</span>
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
        <TabsList className='grid grid-cols-3 w-full dark:bg-input/30 border'>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='questions'>Questions & Answers</TabsTrigger>
          <TabsTrigger value='skills'>Skills Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value='summary' className='space-y-4'>
          <Card className='border bg-background dark:bg-input/30'>
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
              <CardDescription>
                AI-generated summary of your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='whitespace-pre-line leading-relaxed'>{result.summary || 'No summary available for this session.'}</p>
            </CardContent>
          </Card>

          <Card className='border bg-background dark:bg-input/30'>
            <CardHeader>
              <CardTitle>Core Competencies</CardTitle>
              <CardDescription>
                Breakdown of your performance in key areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {skillScores.length > 0 ? (
                  skillScores.map((skill) => (
                    <div key={skill.name}>
                      <div className='flex justify-between items-center mb-1.5'>
                        <span className='text-sm font-medium'>{skill.name}</span>
                        <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>
                          {skill.score?.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={skill.score * 10} className='h-2' />
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>No skill breakdown available.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant='outline' className='w-full' asChild>
                <Link href={`/dashboard/mock-interviews/${interview._id}/attempts`}>
                  Compare with Other Attempts
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='questions' className='space-y-4'>
          <Card className='border bg-background dark:bg-input/30'>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>
                Review each question and your AI-analyzed response
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {(result.qa || []).map((qa, index) => (
                <div key={index} className='space-y-4'>
                  {index > 0 && <Separator className='my-6' />}
                  <div>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='font-semibold text-lg'>Question {index + 1}</h3>
                      <Badge className={getScoreBadgeColor(qa.aiFeedback?.score || 0)}>
                        Score: {qa.aiFeedback?.score?.toFixed(1) || 0}/10
                      </Badge>
                    </div>
                    <p className='text-sm font-medium mb-4'>{qa.question}</p>
                    <div className='bg-muted/40 p-4 rounded-lg mb-4'>
                      <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>Your Response</h4>
                      <p className='text-sm leading-relaxed'>{qa.userAnswer || '(No answer provided)'}</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <ThumbsUp className='h-4 w-4 text-green-500' />
                          <h4 className='text-sm font-bold uppercase tracking-wider'>Strengths</h4>
                        </div>
                        <ul className='space-y-2'>
                          {(qa.aiFeedback?.strengths || []).map((strength, i) => (
                            <li key={i} className='text-xs text-muted-foreground flex items-start gap-2'>
                              <span className='text-green-500 mt-1'>•</span>
                              {strength}
                            </li>
                          ))}
                          {(!qa.aiFeedback?.strengths?.length) && <li className='text-xs text-muted-foreground italic'>None identified.</li>}
                        </ul>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <ThumbsDown className='h-4 w-4 text-orange-500' />
                          <h4 className='text-sm font-bold uppercase tracking-wider'>Growth Areas</h4>
                        </div>
                        <ul className='space-y-2'>
                          {(qa.aiFeedback?.areasToImprove || []).map((area, i) => (
                            <li key={i} className='text-xs text-muted-foreground flex items-start gap-2'>
                              <span className='text-orange-500 mt-1'>•</span>
                              {area}
                            </li>
                          ))}
                          {(!qa.aiFeedback?.areasToImprove?.length) && <li className='text-xs text-muted-foreground italic'>None identified.</li>}
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
          <Card className='border bg-background dark:bg-input/30'>
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
              <CardDescription>
                In-depth breakdown of your performance across core metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                <div>
                  <h3 className='font-semibold mb-2'>Communication Skills</h3>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-muted-foreground'>Clarity, tone, and articulation</span>
                    <span className={`text-sm font-bold ${getScoreColor(result.skillAssignment?.communicationScore / 10)}`}>
                      {(result.skillAssignment?.communicationScore / 10 || 0).toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={result.skillAssignment?.communicationScore} className='h-2 mb-4' />
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    This score reflects how effectively you conveyed your ideas and maintained a professional tone throughout the session.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-semibold mb-2'>Technical Depth</h3>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-muted-foreground'>Knowledge of subject matter and toolsets</span>
                    <span className={`text-sm font-bold ${getScoreColor(result.skillAssignment?.technicalDepthScore / 10)}`}>
                      {(result.skillAssignment?.technicalDepthScore / 10 || 0).toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={result.skillAssignment?.technicalDepthScore} className='h-2 mb-4' />
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    Measures your ability to discuss technical concepts with accuracy and provide detailed, practical examples of your expertise.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className='font-semibold mb-2'>STAR Method Application</h3>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-muted-foreground'>Situation, Task, Action, and Result structure</span>
                    <span className={`text-sm font-bold ${getScoreColor(result.skillAssignment?.starMethodScore / 10)}`}>
                      {(result.skillAssignment?.starMethodScore / 10 || 0).toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={result.skillAssignment?.starMethodScore} className='h-2 mb-4' />
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    Evaluates how well you used the STAR method to structure your behavioral responses, providing clear context and quantifiable outcomes.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between pt-6 border-t'>
              <Button variant='outline' onClick={() => router.push('/dashboard/interview-history')}>
                View Other Sessions
              </Button>
              <Button asChild>
                <Link href={`/dashboard/interviewSession?id=${interview._id}`}>
                  Practice This Profile Again
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
