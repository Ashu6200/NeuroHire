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
import { ArrowUpRight, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Interview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const mockInterviews = [
    {
      id: '1',
      jobProfile: {
        id: 'jp1',
        roleTitle: 'Frontend Developer',
        companyName: 'Tech Corp',
      },
      date: '2025-05-10T14:30:00Z',
      duration: 1845, // in seconds
      score: 8.2,
    },
    {
      id: '2',
      jobProfile: {
        id: 'jp2',
        roleTitle: 'React Developer',
        companyName: 'Startup Inc',
      },
      date: '2025-05-08T10:15:00Z',
      duration: 2130, // in seconds
      score: 7.5,
    },
    {
      id: '3',
      jobProfile: {
        id: 'jp1',
        roleTitle: 'Frontend Developer',
        companyName: 'Tech Corp',
      },
      date: '2025-05-05T16:45:00Z',
      duration: 1920, // in seconds
      score: 6.9,
    },
    {
      id: '4',
      jobProfile: {
        id: 'jp3',
        roleTitle: 'Full Stack Engineer',
        companyName: 'Enterprise Solutions',
      },
      date: '2025-05-01T09:30:00Z',
      duration: 2250, // in seconds
      score: 7.8,
    },
    {
      id: '5',
      jobProfile: {
        id: 'jp1',
        roleTitle: 'Frontend Developer',
        companyName: 'Tech Corp',
      },
      date: '2025-04-25T11:00:00Z',
      duration: 1800, // in seconds
      score: 6.5,
    },
    {
      id: '6',
      jobProfile: {
        id: 'jp2',
        roleTitle: 'React Developer',
        companyName: 'Startup Inc',
      },
      date: '2025-04-20T15:30:00Z',
      duration: 1950, // in seconds
      score: 7.2,
    },
  ];
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-2'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by role or company...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              {/* {uniqueJobProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.title}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className='w-full'>
              <Calendar className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Filter by date' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Time</SelectItem>
              <SelectItem value='week'>Last 7 Days</SelectItem>
              <SelectItem value='month'>Last 30 Days</SelectItem>
              <SelectItem value='3months'>Last 3 Months</SelectItem>
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
          {mockInterviews.length === 0 ? (
            <Card>
              <CardContent className='text-center py-10'>
                <p className='text-muted-foreground mb-4'>
                  No interview sessions found matching your criteria.
                </p>
                <Button asChild>
                  <Link href='/dashboard/job-profiles/new'>
                    Start a New Interview
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {mockInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border dark:bg-input/30 bg-background'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>
                        {interview.jobProfile.roleTitle}
                      </h3>
                      <Badge variant='outline'>
                        {interview.jobProfile.companyName}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {/* {formatDistanceToNow(new Date(interview.date), {
                        addSuffix: true,
                      })}{" "}
                      ({format(new Date(interview.date), "MMM d, yyyy")}) */}
                    </div>
                  </div>
                  <div className='flex items-center gap-4 mt-2 sm:mt-0'>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm text-muted-foreground'>
                        Duration:
                      </div>
                      <div className='font-medium'>
                        {formatDuration(interview.duration)}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='text-sm text-muted-foreground'>
                        Score:
                      </div>
                      <Badge className={getScoreColor(interview.score)}>
                        {interview.score.toFixed(1)}/10
                      </Badge>
                    </div>
                    <Button variant='ghost' size='icon' asChild>
                      <Link
                        href={`/dashboard/interview-history/${interview.id}`}
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

export default Interview;
