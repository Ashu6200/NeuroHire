'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Vapi from '@vapi-ai/web';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mic,
  MicOff,
  Play,
  StopCircle,
  Download,
  Clock,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetMockInterviewQuestionsQuery,
  useSaveInterviewResultMutation,
} from '@/store/mockInterviewFeature/mockInterviewService';
import { useSession } from '@/lib/auth-client';

// Status values: idle | loading | active | ended | saving
const InterviewSession = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get('id');
  const { data: session } = useSession();

  const { data: questionsData, isLoading: questionsLoading } =
    useGetMockInterviewQuestionsQuery(interviewId, { skip: !interviewId });
  const [saveResult] = useSaveInterviewResultMutation();

  const vapiRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef(null);

  const [callStatus, setCallStatus] = useState('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [transcript, setTranscript] = useState([]);

  const questions = questionsData?.data?.questionSet || [];
  const interviewTitle = questionsData?.data?.title || 'Mock Interview';
  const role = questionsData?.data?.role || 'Candidate';
  const companyName = questionsData?.data?.companyName || '';
  const domain = questionsData?.data?.domain || '';
  const candidateName = session?.user?.name || 'Candidate';

  const userAnswers = transcript.filter((t) => t.role === 'user');
  const progress =
    questions.length > 0
      ? Math.min(100, Math.round((userAnswers.length / questions.length) * 100))
      : 0;
  const currentQuestion =
    transcript.filter((t) => t.role === 'assistant').at(-1)?.text || '';

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Init VAPI
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!key) {
      console.warn('NEXT_PUBLIC_VAPI_API_KEY is not set');
      toast.error('VAPI API key is missing. Voice interview will not work.');
      return;
    }

    const vapi = new Vapi(key);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('active');
      startTimeRef.current = new Date();
      timerRef.current = setInterval(
        () => setElapsedTime((t) => t + 1),
        1000
      );
    });

    vapi.on('call-end', () => {
      setCallStatus('ended');
      clearInterval(timerRef.current);
    });

    vapi.on('speech-start', () => setIsSpeaking(true));
    vapi.on('speech-end', () => setIsSpeaking(false));

    vapi.on('message', (msg) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          { role: msg.role, text: msg.transcript },
        ]);
      }
    });

    vapi.on('error', (err) => {
      console.error('VAPI error:', err);
      setCallStatus('idle');
      clearInterval(timerRef.current);
      toast.error('Voice connection failed. Please try again.');
    });

    return () => {
      vapi.stop();
      clearInterval(timerRef.current);
    };
  }, []);

  // Auto-save when call ends
  useEffect(() => {
    if (callStatus !== 'ended') return;
    if (!interviewId || questions.length === 0) return;

    const processAndSave = async () => {
      setCallStatus('saving');
      const userMsgs = transcript.filter((t) => t.role === 'user');
      const qa = questions.map((q, i) => ({
        question: q,
        userAnswer: userMsgs[i]?.text || '(no answer provided)',
      }));

      try {
        const res = await saveResult({
          id: interviewId,
          qa,
          startAt: startTimeRef.current?.toISOString() || new Date().toISOString(),
          endAt: new Date().toISOString(),
        }).unwrap();

        toast.success('Interview saved! Redirecting to results...');
        const resultId = res?.data?.result?._id;
        router.push(
          `/dashboard/mock-interviews/${interviewId}/attempts${resultId ? `?resultId=${resultId}` : ''}`
        );
      } catch (err) {
        console.error('Failed to save result:', err);
        toast.error('Failed to save results. You can retry below.');
        setCallStatus('ended');
      }
    };

    processAndSave();
  }, [callStatus, interviewId, questions, transcript, router, saveResult]);

  const startInterview = useCallback(async () => {
    if (!vapiRef.current || questions.length === 0) return;

    setCallStatus('loading');
    setTranscript([]);
    setElapsedTime(0);

    const questionList = questions
      .map((q, i) => `${i + 1}. [${q.questionType}] ${q.questionText}`)
      .join('\n');

    try {
      await vapiRef.current.start({
        name: 'NeuroHire Interview Bot',
        firstMessage: `Hello! Welcome to your mock interview for the ${role} position${companyName ? ` at ${companyName}` : ''}. I'll be asking you ${questions.length} questions today. Let's begin! Here's the first question: ${questions[0]?.questionText}`,
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional interviewer conducting a mock interview for the ${role} position in the ${domain} domain${companyName ? ` at ${companyName}` : ''}.

You have exactly ${questions.length} questions to ask. Ask them one by one in the order listed below. After the candidate answers each question, give a brief acknowledgment (1-2 sentences maximum), then move to the next question.

Questions (ask in this exact order):
${questionList}

Rules:
- Ask each question clearly and completely
- Do not skip or reorder questions
- Keep acknowledgments brief and professional
- After the last question is answered, thank the candidate and say you will end the session now
- Do not add extra questions beyond the list`,
            },
          ],
        },
        voice: {
          provider: 'deepgram',
          voiceId: 'luna',
        },
      });
    } catch (err) {
      console.error('Failed to start VAPI call:', err);
      setCallStatus('idle');
      toast.error('Could not start the interview. Check your VAPI configuration.');
    }
  }, [questions, role, companyName, domain]);

  const endInterview = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  const downloadTranscript = useCallback(() => {
    if (transcript.length === 0) return;
    const text = transcript
      .map((e) => `${e.role === 'ai' || e.role === 'assistant' ? 'AI Interviewer' : 'Candidate'}: ${e.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${interviewId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcript, interviewId]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isActive = callStatus === 'active';
  const isLoading = callStatus === 'loading';
  const isSaving = callStatus === 'saving';

  if (!interviewId) {
    return (
      <section className='w-full h-max p-4 flex flex-col items-center justify-center gap-4 py-20'>
        <AlertCircle className='h-10 w-10 text-destructive' />
        <p className='text-muted-foreground text-lg'>No interview ID provided.</p>
        <Button onClick={() => router.push('/dashboard/mock-interviews')}>
          Back to Interviews
        </Button>
      </section>
    );
  }

  if (questionsLoading) {
    return (
      <section className='w-full h-max p-4 flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </section>
    );
  }

  if (!questionsData?.data || questions.length === 0) {
    return (
      <section className='w-full h-max p-4 flex flex-col items-center justify-center gap-4 py-20'>
        <AlertCircle className='h-10 w-10 text-destructive' />
        <p className='text-muted-foreground text-lg'>No questions found for this interview.</p>
        <Button onClick={() => router.push('/dashboard/mock-interviews')}>
          Back to Interviews
        </Button>
      </section>
    );
  }

  return (
    <section className='w-full h-max p-4'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>{interviewTitle}</h1>
          <p className='text-muted-foreground text-sm'>
            {role}{companyName ? ` · ${companyName}` : ''} · {questions.length} questions
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge variant={isActive ? 'default' : isSaving ? 'outline' : 'outline'} className='px-3 py-1'>
            {isActive ? 'In Progress' : isSaving ? 'Saving...' : callStatus === 'ended' ? 'Ended' : 'Not Started'}
          </Badge>
          {!isActive ? (
            <Button
              onClick={startInterview}
              disabled={isLoading || isSaving}
              className='gap-2'
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Play className='h-4 w-4' />
              )}
              {isLoading ? 'Connecting...' : 'Start Interview'}
            </Button>
          ) : (
            <Button variant='destructive' onClick={endInterview} className='gap-2'>
              <StopCircle className='h-4 w-4' />
              End Interview
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>{formatTime(elapsedTime)}</span>
          </div>
          <span className='text-sm text-muted-foreground'>
            {userAnswers.length}/{questions.length} answered
          </span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Left — Participants + Controls */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* AI Interviewer Card */}
            <Card className='border-2 border-primary/10'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg flex justify-between'>
                  <span>AI Interviewer</span>
                  {isSpeaking && (
                    <Badge variant='outline' className='bg-primary/10'>
                      Speaking
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center py-4'>
                <div className='relative mb-4'>
                  <div className='rounded-full bg-primary/10 p-4 h-20 w-20 flex items-center justify-center'>
                    <Zap className='h-8 w-8 text-primary' />
                  </div>
                  {isSpeaking && (
                    <span className='absolute inset-0 rounded-full animate-pulse bg-primary/20' />
                  )}
                </div>
                <h3 className='text-xl font-semibold mb-1'>Interview Bot</h3>
                <p className='text-sm text-muted-foreground mb-4'>AI Interviewer</p>
              </CardContent>
            </Card>

            {/* Candidate Card */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg flex justify-between'>
                  <span>Candidate</span>
                  {isActive && !isMuted && (
                    <Badge variant='outline' className='bg-green-500/10 text-green-500'>
                      Live
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center py-4'>
                <div className='relative mb-4'>
                  <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-4 h-20 w-20 flex items-center justify-center'>
                    <CheckCircle className='h-8 w-8 text-green-500' />
                  </div>
                  {isActive && !isMuted && (
                    <span className='absolute inset-0 rounded-full animate-pulse bg-green-500/20' />
                  )}
                </div>
                <h3 className='text-xl font-semibold mb-1'>{candidateName}</h3>
                <p className='text-sm text-muted-foreground mb-4'>{role}</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  onClick={toggleMute}
                  disabled={!isActive}
                >
                  {isMuted ? (
                    <MicOff className='h-4 w-4' />
                  ) : (
                    <Mic className='h-4 w-4' />
                  )}
                  {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className='p-4'>
            <CardHeader className='p-0 pb-3'>
              <CardTitle className='text-lg'>Controls</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='flex flex-wrap gap-3'>
                <Button
                  variant='outline'
                  className='gap-2'
                  onClick={downloadTranscript}
                  disabled={transcript.length === 0}
                >
                  <Download className='h-4 w-4' />
                  Export Transcript
                </Button>
                {isSaving && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Analysing and saving results…
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Live Transcript */}
        <div>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              {/* Current question box */}
              <div className='p-4 bg-muted/50 rounded-md mb-4 mx-4'>
                <h3 className='text-sm font-medium mb-1'>Current Question:</h3>
                <p className='text-sm'>
                  {currentQuestion || 'Waiting for the interview to start…'}
                </p>
              </div>

              <ScrollArea className='h-[300px] px-4' ref={transcriptRef}>
                <div className='space-y-4 pb-4'>
                  {transcript.length === 0 ? (
                    <p className='text-sm text-muted-foreground text-center py-8'>
                      Transcript will appear here once the interview starts.
                    </p>
                  ) : (
                    transcript.map((entry, index) => (
                      <div key={index} className='flex gap-3'>
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.role === 'assistant'
                              ? 'bg-primary/10'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          {entry.role === 'assistant' ? (
                            <Zap className='h-4 w-4 text-primary' />
                          ) : (
                            <CheckCircle className='h-4 w-4 text-green-500' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-medium mb-1'>
                            {entry.role === 'assistant' ? 'AI Interviewer' : 'Candidate'}
                          </p>
                          <p className='text-sm text-muted-foreground'>{entry.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const InterviewSessionById = () => (
  <Suspense
    fallback={
      <div className='w-full h-max p-4 flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    }
  >
    <InterviewSession />
  </Suspense>
);

export default InterviewSessionById;
