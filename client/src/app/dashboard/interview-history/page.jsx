'use client';
import CommonHeader from '@/components/dashboard/CommonHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, Calendar, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { useGetAllUserInterviewResultsQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { format, formatDistanceToNow } from 'date-fns';

const InterviewHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { data: resultsData, isLoading } = useGetAllUserInterviewResultsQuery();
  const results = resultsData?.data?.results || [];

  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const interview = item.mockInterviewId || {};
      const matchesSearch = 
        interview.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || interview.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [results, searchQuery, roleFilter]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(results.map(r => r.mockInterviewId?.role).filter(Boolean));
    return Array.from(roles);
  }, [results]);

  const formatDuration = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / 1000;
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = Math.floor(duration % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 8)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 6)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <section className='p-4'>
      <CommonHeader
        title={'Interview History'}
        subtitle={'Review and analyze your past interview sessions.'}
        link={'/dashboard/create-mock-interview'}
        buttonText={'New Interview'}
      />
      <div className='mt-4'>
        <h1 className='text-lg font-bold tracking-tight'>
          {'Filter Interviews '}
          <span className='text-muted-foreground text-sm font-normal'>
            {'(Find specific interview sessions based on criteria.)'}
          </span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by role or company...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue='list' className='space-y-4 mt-4'>
        <TabsList>
          <TabsTrigger value='list'>List View</TabsTrigger>
          <TabsTrigger value='calendar'>Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value='list' className='space-y-4'>
          {isLoading ? (
            <div className='flex justify-center py-20'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : filteredResults.length === 0 ? (
            <Card>
              <CardContent className='text-center py-10'>
                <p className='text-muted-foreground mb-4'>
                  No interview sessions found matching your criteria.
                </p>
                <Button asChild>
                  <Link href='/dashboard/create-mock-interview'>
                    Start a New Interview
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {filteredResults.map((result) => (
                <div
                  key={result._id}
                  className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border dark:bg-input/30 bg-background'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>
                        {result.mockInterviewId?.role || 'Deleted Mock Interview'}
                      </h3>
                      {result.mockInterviewId?.companyName && (
                        <Badge variant='outline'>
                          {result.mockInterviewId.companyName}
                        </Badge>
                      )}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(new Date(result.createdAt), {
                        addSuffix: true,
                      })}{" "}
                      ({format(new Date(result.createdAt), "MMM d, yyyy")})
                    </div>
                  </div>
                  <div className='flex items-center gap-4 mt-2 sm:mt-0'>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm text-muted-foreground'>
                        Duration:
                      </div>
                      <div className='font-medium'>
                        {formatDuration(result.startAt, result.endAt)}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm text-muted-foreground'>
                        Score:
                      </div>
                      <Badge className={getScoreColor(result.totalScore)}>
                        {result.totalScore?.toFixed(1)}/10
                      </Badge>
                    </div>
                    <Button variant='ghost' size='icon' asChild>
                      <Link
                        href={`/dashboard/interview-history/${result._id}`}
                      >
                        <ArrowUpRight className='h-4 w-4' />
                        <span className='sr-only'>View details</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value='calendar' className='space-y-4'>
          <Card>
            <CardContent className='text-center py-10'>
              <p className='text-muted-foreground'>
                Calendar view will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default InterviewHistoryPage;
