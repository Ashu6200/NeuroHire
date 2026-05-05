'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useGetQuestionByIdQuery, 
  useUpdateQuestionProgressMutation 
} from '@/store/questionFeature/questionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data, isLoading, error } = useGetQuestionByIdQuery(id);
  const [updateProgress, { isLoading: isUpdating }] = useUpdateQuestionProgressMutation();
  
  const [status, setStatus] = useState('Unsolved');
  const [notes, setNotes] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (data?.data?.progress) {
      setStatus(data.data.progress.status || 'Unsolved');
      setNotes(data.data.progress.notes || '');
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateProgress({ id, status, notes }).unwrap();
      toast.success('Progress saved successfully');
    } catch (err) {
      toast.error('Failed to save progress');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Question not found</h2>
        <Button onClick={() => router.push('/dashboard/practice-questions')}>Go Back</Button>
      </div>
    );
  }

  const question = data.data;

  return (
    <div className="container max-w-7xl py-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/practice-questions')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{question.category}</Badge>
            <Badge variant="secondary">{question.difficulty}</Badge>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unsolved">Unsolved</SelectItem>
              <SelectItem value="Attempted">Attempted</SelectItem>
              <SelectItem value="Needs Review">Needs Review</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Progress
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Pane: Question Description */}
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-6">
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: question.description.replace(/\n/g, '<br/>') }} />
              </div>

              {question.tags && question.tags.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Pane: Notes and Solution */}
        <div className="flex flex-col h-full gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Your Notes / Code</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="h-full w-full border-0 focus-visible:ring-0 resize-none p-6 text-sm font-mono bg-transparent"
                placeholder="Write your thoughts, approach, or code snippet here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {question.solution && (
            <Card className="shrink-0 transition-all">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50" onClick={() => setShowSolution(!showSolution)}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-md">AI Hint / Solution</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  {showSolution ? 'Hide' : 'Show'}
                </Button>
              </CardHeader>
              {showSolution && (
                <CardContent className="p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                    <div dangerouslySetInnerHTML={{ __html: question.solution.replace(/\n/g, '<br/>') }} />
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
