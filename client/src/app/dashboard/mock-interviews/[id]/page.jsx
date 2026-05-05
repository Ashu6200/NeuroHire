'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetMockInterviewByIdQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const AiInterviewById = ({ params }) => {
  const { id } = React.use(params);
  const pageHeader = {
    title: 'Your Mock Interview',
    subtitle:
      'Get tailored interview questions based on your resume and target role. Practice smarter, not harder—with AI that understands your unique journey.',
  };
  const {
    data: item,
    isLoading,
    isFetching,
  } = useGetMockInterviewByIdQuery(id);
  const router = useRouter();

  return (
    <section className='p-4'>
      <div className='grid items-center'>
        <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
          <h1 className='my-4 text-4xl font-bold text-pretty lg:text-3xl'>
            {pageHeader.title}
          </h1>
          <p className='mb-6 max-w-4xl text-muted-foreground lg:text-base'>
            {pageHeader.subtitle}
          </p>
        </div>
      </div>
      {isLoading || isFetching ? (
        <p className='text-muted-foreground text-lg'>Loading interview...</p>
      ) : (
        <div className='space-y-6'>
          <div className='flex rounded-lg border p-4'>
            <div className='w-8/12'>
              <h3 className='font-medium text-2xl mb-2'>
                Interview Description Preview
              </h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Title</p>
                    <p className='font-medium'>
                      {item.data.mockInterview.title || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Company</p>
                    <p className='font-medium'>
                      {item.data.mockInterview.company || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Role</p>
                    <p className='font-medium'>
                      {item.data.mockInterview.role || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Experience Level
                    </p>
                    <p className='font-medium'>
                      {item.data.mockInterview.experienceLevel ||
                        'Not specified'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>
                    Difficulty Settings
                  </p>
                  <div className='flex gap-2 mt-1'>
                    <Badge variant='outline'>
                      Technical: {item.data.mockInterview.technicalDifficulty}
                    </Badge>
                    <Badge variant='outline'>
                      Behavioral: {item.data.mockInterview.behavioralDifficulty}
                    </Badge>
                    <Badge variant='outline'>
                      Behavioral:{' '}
                      {item.data.mockInterview.situationalDifficulty}
                    </Badge>
                    <Badge variant='outline'>
                      General: {item.data.mockInterview.generalDifficulty}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Job Profile Description
                  </p>
                  <p className='font-medium'>
                    {item.data.mockInterview.jobProfileDescription ||
                      'Not specified'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Preferred Candidate Profile
                  </p>
                  <p className='font-medium'>
                    {item.data.mockInterview.preferredCandidateProfile ||
                      'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            <div className='w-4/12'>
              <div className='w-full flex flex-col items-center gap-4'>
                <Image
                  src='/layout/authBG.jpg'
                  alt='Image'
                  className=' rounded-lg inset-0 max-h-[350px] w-full object-cover dark:brightness-[0.2] dark:grayscale'
                  width={400}
                  height={400}
                />
                <div className='w-full relative hidden bg-muted lg:block'></div>
                <div className='flex items-center gap-4'>
                  <Button
                    size={'lg'}
                    variant={'default'}
                    onClick={() =>
                      router.push(`/dashboard/mock-interviews/${id}/update`)
                    }
                  >
                    Edit Interview
                  </Button>
                  <Button
                    size={'lg'}
                    variant={'outline'}
                    onClick={() => router.push(`/dashboard/interviewSession?id=${id}`)}
                  >
                    Take Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AiInterviewById;
