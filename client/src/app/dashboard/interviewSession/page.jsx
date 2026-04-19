'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  StopCircle,
  Download,
  Clock,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const InterviewSessionById = () => {
  // State management
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [qnaLogs, setQnaLogs] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  // Timer interval reference
  const timerRef = useRef(null);
  const transcriptRef = useRef(null);
  const [transcript, setTranscript] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your AI interviewer today. Let's begin with your introduction.",
    },
    {
      role: 'candidate',
      text: "Hi, I'm John Doe, a software developer with 5 years of experience.",
    },
    {
      role: 'ai',
      text: 'Great! Could you tell me about your experience with React?',
    },
    {
      role: 'candidate',
      text: "I've been working with React for 3 years, building complex web applications.",
    },
    { role: 'ai', text: "What's your understanding of React hooks?" },
    {
      role: 'candidate',
      text: 'React hooks are functions that allow us to use state and lifecycle features in functional components.',
    },
    {
      role: 'ai',
      text: 'Can you explain the difference between useEffect and useLayoutEffect?',
    },
    {
      role: 'candidate',
      text: 'useEffect runs asynchronously after render, while useLayoutEffect runs synchronously before browser paint.',
    },
    {
      role: 'ai',
      text: 'What are the key principles of React that you follow in your development?',
    },
    {
      role: 'candidate',
      text: 'I follow principles like component reusability, unidirectional data flow, and keeping components pure when possible.',
    },
    {
      role: 'ai',
      text: "Can you describe a challenging React project you've worked on?",
    },
    {
      role: 'candidate',
      text: 'I built a real-time dashboard with complex data visualizations using React, Redux, and WebSocket.',
    },
    {
      role: 'ai',
      text: 'How do you handle state management in large React applications?',
    },
    {
      role: 'candidate',
      text: 'For large apps, I use Redux or Context API depending on requirements, along with local state when appropriate.',
    },
    {
      role: 'ai',
      text: "What's your experience with React performance optimization?",
    },
    {
      role: 'candidate',
      text: 'I use techniques like memo, useMemo, useCallback, code splitting, and lazy loading to optimize React apps.',
    },
  ]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);
  const toggleInterview = () => {
    if (isInterviewActive) {
      clearInterval(timerRef.current);
      setIsInterviewActive(false);
      setIsSpeaking(false);
      setIsListening(false);
    } else {
      setIsInterviewActive(true);
      setIsSpeaking(true);
      setCurrentQuestion('Tell me about your experience with React?');
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          setProgress(Math.min((newTime / (30 * 60)) * 100, 100));
          return newTime;
        });
      }, 1000);
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };
  const toggleMicrophone = () => {
    setIsListening((prev) => !prev);
  };
  const toggleAudio = () => {
    setMuted((prev) => !prev);
  };

  const downloadTranscript = () => {
    const text = transcript
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className='w-full h-max p-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>React Developer Interview</h1>
          <p className='text-muted-foreground'>Session ID: INT-2023-05-14</p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge
            variant={isInterviewActive ? 'default' : 'outline'}
            className='px-3 py-1'
          >
            {isInterviewActive ? 'In Progress' : 'Not Started'}
          </Badge>
          <Button
            variant={isInterviewActive ? 'destructive' : 'default'}
            onClick={toggleInterview}
            className='gap-2'
          >
            {isInterviewActive ? (
              <StopCircle className='h-4 w-4' />
            ) : (
              <Play className='h-4 w-4' />
            )}
            {isInterviewActive ? 'End Interview' : 'Start Interview'}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>
              {formatTime(elapsedTime)}
            </span>
          </div>
          {/* <span className='text-sm text-muted-foreground'>{elapsedTime}</span> */}
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Left column - Participants */}
        <div className='lg:col-span-2'>
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
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Image
                      src='/placeholder.svg?height=80&width=80'
                      alt='AI Interviewer'
                      width={80}
                      height={80}
                      className='rounded-full'
                    />
                  </div>
                  {isSpeaking && (
                    <span className='absolute inset-0 rounded-full animate-pulse bg-primary/20' />
                  )}
                </div>
                <h3 className='text-xl font-semibold mb-2'>Interview Bot</h3>
                <p className='text-sm text-muted-foreground text-center mb-4'>
                  Technical Interviewer
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  onClick={toggleAudio}
                >
                  {muted ? (
                    <VolumeX className='h-4 w-4' />
                  ) : (
                    <Volume2 className='h-4 w-4' />
                  )}
                  {muted ? 'Unmute' : 'Mute'}
                </Button>
              </CardContent>
            </Card>

            {/* Candidate Card */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg flex justify-between'>
                  <span>Candidate</span>
                  {isListening && (
                    <Badge
                      variant='outline'
                      className='bg-green-500/10 text-green-500'
                    >
                      Listening
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center py-4'>
                <div className='relative mb-4'>
                  <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-2'>
                    <Image
                      src='/placeholder.svg?height=80&width=80'
                      alt='Candidate'
                      width={80}
                      height={80}
                      className='rounded-full'
                    />
                  </div>
                  {isListening && (
                    <span className='absolute inset-0 rounded-full animate-pulse bg-green-500/20' />
                  )}
                </div>
                <h3 className='text-xl font-semibold mb-2'>John Doe</h3>
                <p className='text-sm text-muted-foreground text-center mb-4'>
                  React Developer
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  onClick={toggleMicrophone}
                >
                  {isListening ? (
                    <Mic className='h-4 w-4' />
                  ) : (
                    <MicOff className='h-4 w-4' />
                  )}
                  {isListening ? 'Mute Mic' : 'Unmute Mic'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Interview Controls */}
          <Card className='mt-4 p-4'>
            <CardHeader className=''>
              <CardTitle className='text-lg'>Interview Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button
                  variant='outline'
                  className='gap-2'
                  disabled={!isInterviewActive}
                >
                  <Pause className='h-4 w-4' />
                  Pause
                </Button>
                <Button
                  variant='outline'
                  className='gap-2'
                  disabled={!isInterviewActive}
                >
                  <Zap className='h-4 w-4' />
                  Skip Question
                </Button>
                <Button
                  variant='outline'
                  className='gap-2'
                  onClick={downloadTranscript}
                >
                  <Download className='h-4 w-4' />
                  Export Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Transcript and Analysis */}
        <div>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='p-4 bg-muted/50 rounded-md mb-4 mx-4'>
                <h3 className='text-sm font-medium mb-1'>Current Question:</h3>
                <p className='text-sm'>
                  {currentQuestion || 'Waiting for the next question...'}
                </p>
              </div>
              <ScrollArea className='h-[300px] px-4' ref={transcriptRef}>
                <div className='space-y-4 pb-4 h-full'>
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        entry.role === 'ai' ? 'text-primary-foreground' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                              ${
                                entry.role === 'ai'
                                  ? 'bg-primary/10'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}
                      >
                        {entry.role === 'ai' ? (
                          <Zap className='h-4 w-4 text-primary' />
                        ) : (
                          <CheckCircle className='h-4 w-4 text-green-500' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium mb-1 text-white'>
                          {entry.role === 'ai' ? 'AI Interviewer' : 'Candidate'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InterviewSessionById;

//  <Tabs defaultValue="transcript" onValueChange={setActiveTab}>
//             <TabsList className="grid grid-cols-2 mb-4">
//               <TabsTrigger value="transcript" className="gap-2">
//                 <MessageSquare className="h-4 w-4" />
//                 Transcript
//               </TabsTrigger>
//               <TabsTrigger value="analysis" className="gap-2">
//                 <BarChart2 className="h-4 w-4" />
//                 Analysis
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="transcript" className="m-0">

//             </TabsContent>

//             <TabsContent value="analysis" className="m-0">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Interview Analysis</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
//                         <Award className="h-4 w-4" />
//                         Performance Score
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <Progress value={78} className="h-2" />
//                         <span className="text-sm font-medium">78%</span>
//                       </div>
//                     </div>

//                     <Separator />

//                     <div>
//                       <h3 className="text-sm font-medium mb-2">Key Strengths</h3>
//                       <ul className="text-sm space-y-1">
//                         <li className="flex items-center gap-2">
//                           <CheckCircle className="h-3 w-3 text-green-500" />
//                           Strong React fundamentals
//                         </li>
//                         <li className="flex items-center gap-2">
//                           <CheckCircle className="h-3 w-3 text-green-500" />
//                           Good understanding of hooks
//                         </li>
//                         <li className="flex items-center gap-2">
//                           <CheckCircle className="h-3 w-3 text-green-500" />
//                           Experience with performance optimization
//                         </li>
//                       </ul>
//                     </div>

//                     <Separator />

//                     <div>
//                       <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
//                       <ul className="text-sm space-y-1 text-muted-foreground">
//                         <li>More examples of complex projects</li>
//                         <li>Deeper knowledge of React internals</li>
//                         <li>Testing strategies could be more comprehensive</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
