'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useGetInterviewResultsQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  CalendarDays,
  Clock,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Wrench,
  Star,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';

const scoreColor = (score, max = 100) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'text-green-500';
  if (pct >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

const scoreBadgeVariant = (score, max = 100) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'default';
  if (pct >= 40) return 'secondary';
  return 'destructive';
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const durationMins = (start, end) => {
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.round(diff / 60000));
};

const SkillBar = ({ label, value, icon: Icon }) => (
  <div className='space-y-1'>
    <div className='flex items-center justify-between text-sm'>
      <span className='flex items-center gap-1 text-muted-foreground'>
        <Icon className='h-3.5 w-3.5' />
        {label}
      </span>
      <span className={`font-semibold ${scoreColor(value)}`}>{value}/100</span>
    </div>
    <div className='h-1.5 rounded-full bg-muted overflow-hidden'>
      <div
        className={`h-full rounded-full transition-all ${
          value >= 70
            ? 'bg-green-500'
            : value >= 40
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  </div>
);

const QAItem = ({ qa, index }) => {
  const [open, setOpen] = useState(index === 0);
  const q = qa.question;
  const questionText = q?.questionText || q || 'Question';
  const questionType = q?.questionType || 'general';
  const score = qa.aiFeedback?.score ?? 0;

  return (
    <div className='border rounded-lg overflow-hidden'>
      <button
        className='w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors'
        onClick={() => setOpen((v) => !v)}
      >
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <span className='text-xs text-muted-foreground shrink-0'>Q{index + 1}</span>
          <Badge variant='outline' className='text-[10px] shrink-0 capitalize'>
            {questionType}
          </Badge>
          <span className='text-sm font-medium truncate'>{questionText}</span>
        </div>
        <div className='flex items-center gap-2 shrink-0 ml-2'>
          <Badge variant={scoreBadgeVariant(score, 10)} className='text-xs'>
            {score}/10
          </Badge>
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className='px-4 pb-4 space-y-3 border-t bg-muted/20'>
          {/* User answer */}
          <div className='pt-3'>
            <p className='text-xs font-medium text-muted-foreground mb-1'>Your Answer</p>
            <p className='text-sm leading-relaxed'>{qa.userAnswer || '(no answer provided)'}</p>
          </div>

          {/* Strengths */}
          {qa.aiFeedback?.strengths?.length > 0 && (
            <div>
              <p className='text-xs font-medium text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1'>
                <CheckCircle2 className='h-3 w-3' />
                Strengths
              </p>
              <ul className='space-y-1'>
                {qa.aiFeedback.strengths.map((s, i) => (
                  <li key={i} className='text-xs text-muted-foreground flex items-start gap-1.5'>
                    <span className='text-green-500 mt-0.5'>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas to improve */}
          {qa.aiFeedback?.areasToImprove?.length > 0 && (
            <div>
              <p className='text-xs font-medium text-orange-600 dark:text-orange-400 mb-1.5 flex items-center gap-1'>
                <AlertCircle className='h-3 w-3' />
                Areas to Improve
              </p>
              <ul className='space-y-1'>
                {qa.aiFeedback.areasToImprove.map((a, i) => (
                  <li key={i} className='text-xs text-muted-foreground flex items-start gap-1.5'>
                    <span className='text-orange-500 mt-0.5'>•</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AttemptsContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id;
  const resultIdFromUrl = searchParams.get('resultId');

  const { data, isLoading, isError } = useGetInterviewResultsQuery(id, { skip: !id });

  const results = data?.data?.results || [];
  const interview = data?.data?.interview || {};

  const [selectedId, setSelectedId] = useState(resultIdFromUrl || null);

  // Auto-select: prefer URL param, then first result
  useEffect(() => {
    if (results.length === 0) return;
    if (resultIdFromUrl && results.find((r) => r._id === resultIdFromUrl)) {
      setSelectedId(resultIdFromUrl);
    } else if (!selectedId) {
      setSelectedId(results[0]._id);
    }
  }, [results, resultIdFromUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedResult = results.find((r) => r._id === selectedId);
  const skillAssign = selectedResult?.skillAssingment || {};

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-4'>
        <AlertCircle className='h-10 w-10 text-destructive' />
        <p className='text-muted-foreground'>Failed to load results.</p>
        <Button variant='outline' onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-4'>
        <MessageSquare className='h-10 w-10 text-muted-foreground' />
        <div className='text-center'>
          <p className='font-semibold text-lg'>No attempts yet</p>
          <p className='text-muted-foreground text-sm mt-1'>
            Complete a mock interview session to see your results here.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/interviewSession?id=${id}`)}
          className='gap-2'
        >
          <Play className='h-4 w-4' />
          Take Interview
        </Button>
      </div>
    );
  }

  return (
    <section className='p-4'>
      {/* Page header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>{interview.title || 'Interview'} — Attempts</h1>
        <p className='text-muted-foreground text-sm mt-1'>
          {interview.role}
          {interview.companyName ? ` · ${interview.companyName}` : ''} · {results.length}{' '}
          {results.length === 1 ? 'attempt' : 'attempts'}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Left — Attempt list */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>All Attempts</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[480px]'>
                <div className='px-4 pb-4 space-y-2'>
                  {results.map((result, index) => {
                    const isSelected = result._id === selectedId;
                    const attemptNum = results.length - index;
                    return (
                      <button
                        key={result._id}
                        onClick={() => setSelectedId(result._id)}
                        className={`w-full text-left rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/40'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <span className='text-sm font-semibold'>Attempt #{attemptNum}</span>
                          <Badge
                            variant={scoreBadgeVariant(result.totalScore)}
                            className='text-xs'
                          >
                            {result.totalScore}/100
                          </Badge>
                        </div>
                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <CalendarDays className='h-3 w-3' />
                            {formatDate(result.attemptedDate || result.createdAt)}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {durationMins(result.stateAt, result.endAt)} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Button
            variant='outline'
            className='w-full mt-3 gap-2'
            onClick={() => router.push(`/dashboard/interviewSession?id=${id}`)}
          >
            <Play className='h-4 w-4' />
            Take Again
          </Button>
        </div>

        {/* Right — Result detail */}
        <div className='lg:col-span-2 space-y-4'>
          {selectedResult ? (
            <>
              {/* Score overview */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base'>Overall Performance</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center gap-6'>
                    <div className='text-center'>
                      <p
                        className={`text-5xl font-bold ${scoreColor(selectedResult.totalScore)}`}
                      >
                        {selectedResult.totalScore}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>out of 100</p>
                    </div>
                    <Separator orientation='vertical' className='h-16' />
                    <div className='flex-1 space-y-2'>
                      <SkillBar
                        label='Communication'
                        value={skillAssign.communicationScore ?? 0}
                        icon={MessageSquare}
                      />
                      <SkillBar
                        label='Technical Depth'
                        value={skillAssign.technicalDepthScore ?? 0}
                        icon={Wrench}
                      />
                      <SkillBar
                        label='STAR Method'
                        value={skillAssign.starMethodScore ?? 0}
                        icon={Star}
                      />
                    </div>
                  </div>

                  {selectedResult.summary && (
                    <div className='p-3 bg-muted/50 rounded-lg'>
                      <p className='text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1'>
                        <TrendingUp className='h-3.5 w-3.5' />
                        AI Summary
                      </p>
                      <p className='text-sm leading-relaxed'>{selectedResult.summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Q&A Breakdown */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base'>
                    Q&A Breakdown ({selectedResult.qa?.length || 0} questions)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className='h-[420px] pr-2'>
                    <div className='space-y-2'>
                      {(selectedResult.qa || []).map((qa, i) => (
                        <QAItem key={i} qa={qa} index={i} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className='flex items-center justify-center h-64 text-muted-foreground'>
              Select an attempt to view details
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AttemptsPage = () => (
  <Suspense
    fallback={
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    }
  >
    <AttemptsContent />
  </Suspense>
);

export default AttemptsPage;
