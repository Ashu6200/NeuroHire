"use client";
import CommonHeader from '@/components/dashboard/CommonHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import { Award, BarChart2, Clock, TrendingUp } from 'lucide-react';
import React from 'react';
import { useGetDashboardStatsQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { Skeleton } from '@/components/ui/skeleton';

const MainDashboard = () => {
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const stats = statsData?.data?.stats;

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `${hours}h ${remMins}m`;
  };

  return (
    <section className='p-4'>
      <CommonHeader
        title={'Dashboard'}
        subtitle={
          "Welcome back! Here's an overview of your interview practice."
        }
        link={'/dashboard/create-mock-interview'}
        buttonText={'New Interview'}
      />

      <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-[120px] w-full rounded-xl' />
          ))
        ) : (
          <>
            <MetricCard
              title={'Total Interviews'}
              stats={stats?.totalInterviews || '0'}
              icon={<BarChart2 className='h-4 w-4 text-muted-foreground' />}
              body={'Practice sessions completed'}
            />
            <MetricCard
              title={'Total Practice Time'}
              stats={formatDuration(stats?.totalPracticeTime)}
              icon={<Clock className='h-4 w-4 text-muted-foreground' />}
              body={'Time invested in interviews'}
            />
            <MetricCard
              title={'Average Score'}
              stats={stats?.averageScore || '0'}
              icon={<Award className='h-4 w-4 text-muted-foreground' />}
              body={'Out of 10 points'}
            />
            <MetricCard
              title={'Improvement Rate'}
              stats={`${stats?.improvementRate || 0}%`}
              icon={<TrendingUp className='h-4 w-4 text-muted-foreground' />}
              body={'From first to last interview'}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default MainDashboard;
