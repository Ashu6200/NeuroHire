import CommonHeader from '@/components/dashboard/CommonHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import { Award, BarChart2, Clock } from 'lucide-react';
import React from 'react';

const MainDashboard = () => {
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
        <MetricCard
          title={'Total Interviews'}
          stats={'5'}
          icon={<BarChart2 className='h-4 w-4 text-muted-foreground' />}
          body={'Practice sessions completed'}
        />
        <MetricCard
          title={' Total Practice Time'}
          stats={'5'}
          icon={<Clock className='h-4 w-4 text-muted-foreground' />}
          body={' Time invested in interviews'}
        />
        <MetricCard
          title={'Average Score'}
          stats={'5'}
          icon={<Award className='h-4 w-4 text-muted-foreground' />}
          body={'Out of 10 points'}
        />
        <MetricCard
          title={' Improvement Rate'}
          stats={'5'}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          }
          body={' From first to last interview'}
        />
      </div>
    </section>
  );
};

export default MainDashboard;
