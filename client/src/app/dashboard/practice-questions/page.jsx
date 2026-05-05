'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetAllQuestionsQuery } from '@/store/questionFeature/questionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const statusIcons = {
  Solved: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  Attempted: <Circle className="w-5 h-5 text-yellow-500" />,
  'Needs Review': <Circle className="w-5 h-5 text-red-500" />,
  Unsolved: <Circle className="w-5 h-5 text-muted-foreground" />,
};

export default function PracticeQuestionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const { data, isLoading, error } = useGetAllQuestionsQuery({
    search: search || undefined,
    category: category !== 'all' ? category : undefined,
    difficulty: difficulty !== 'all' ? difficulty : undefined,
  });

  const questions = data?.data || [];

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Questions</h1>
          <p className="text-muted-foreground mt-1">
            Master your interview skills with our curated question bank.
          </p>
        </div>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Behavioral">Behavioral</SelectItem>
              <SelectItem value="System Design">System Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
          ))
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load questions. Please try again later.
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-card/50">
            <h3 className="text-xl font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          questions.map((question) => (
            <Link key={question._id} href={`/dashboard/practice-questions/${question._id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group mb-4">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="mt-1" title={`Status: ${question.userProgress}`}>
                      {statusIcons[question.userProgress] || statusIcons.Unsolved}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {question.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className="text-xs font-normal">
                          {question.category}
                        </Badge>
                        <Badge variant="secondary" className={`text-xs border-none ${difficultyColors[question.difficulty]}`}>
                          {question.difficulty}
                        </Badge>
                        {question.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
