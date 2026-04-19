'use client';

import CommonHeader from '@/components/dashboard/CommonHeader';
import MockInterviewCard from '@/components/MockInterviewCard';
import { Input } from '@/components/ui/input';
import { useGetAllMockInterviewQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

const MockInterviews = () => {
  const { data, isLoading, error, isFetching } = useGetAllMockInterviewQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = useMemo(() => {
    if (!data?.data.mockInterviews) return [];
    return data?.data.mockInterviews.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.role?.toLowerCase().includes(query) ||
        item.companyName?.toLowerCase().includes(query) ||
        item.skills?.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  return (
    <section className='p-4'>
      <CommonHeader
        title='Mock Interview Templates'
        subtitle='Manage your created mock interview templates for interview practice.'
        link='/dashboard/create-mock-interview'
        buttonText='New Interview'
      />
      <div className='mt-4'>
        <h1 className='text-lg font-bold tracking-tight'>
          Search Profiles{' '}
          <span className='text-muted-foreground text-sm font-normal'>
            (Find specific job profiles by role, company, or skills.)
          </span>
        </h1>
        <div className='relative mt-2'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by role, company, or skills...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='mt-4 gap-4 flex flex-col'>
        {isLoading || isFetching ? (
          <p className='text-muted-foreground text-lg'>Loading interviews...</p>
        ) : error ? (
          <p className='text-red-500 text-lg'>Failed to load interviews.</p>
        ) : filteredData.length === 0 ? (
          <p className='text-muted-foreground text-lg'>
            No mock interviews found for "{searchQuery}".
          </p>
        ) : (
          filteredData.map((item, index) => (
            <MockInterviewCard item={item} key={item._id || index} />
          ))
        )}
      </div>
    </section>
  );
};

export default MockInterviews;
