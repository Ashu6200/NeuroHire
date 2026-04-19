import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { Edit, NotebookText, Play, View } from 'lucide-react';
import { Badge } from './ui/badge';
import DeleteDialogBox from './common/DeleteDialogBox';
import { useDeleteMockInterviewMutation } from '@/store/mockInterviewFeature/mockInterviewService';

const MockInterviewCard = ({ item }) => {
  const [deleteMockInterview, { isLoading: isDeleteLoading }] =
    useDeleteMockInterviewMutation();
  const handleDelete = async () => {
    try {
      const response = await deleteMockInterview(item._id).unwrap();
      if (response?.success) {
        toast.success('Deleted successfully', {
          description: 'You have deleted the mock interview successfully.',
        });
      }
    } catch (error) {
      const status = err?.status || err?.data?.statusCode;
      const message = err?.data?.message || 'Something went wrong';
      if (status === 400) {
        toast.error(message || 'Invalid input');
      } else if (status === 500) {
        toast.error(message || 'Server error');
      } else {
        toast.error(message || 'Unexpected error');
      }
    }
  };
  return (
    <Card
      className={
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
      }
    >
      <CardHeader>
        <CardTitle>
          {item.title} <Badge variant='outline'>{item.companyName}</Badge>
        </CardTitle>
        <CardDescription>
          {item.jobProfileDescription.substring(0, 400)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2'>
          <h3 className='font-medium'>
            Role: {item.role}{' '}
            <Badge variant='secondary'>
              {item.experienceLevel.toUpperCase()}
            </Badge>
          </h3>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex flex-col md:flex-row gap-2 mt-4 sm:mt-0 justify-between w-full'>
          <div className='grid grid-cols-2 md:flex gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link href={`/dashboard/mock-interviews/${item._id}`}>
                <View className='mr-2 h-3 w-3' />
                View
              </Link>
            </Button>
            <Button size='sm' asChild>
              <Link href={`/dashboard/interviewSession?id=${item.title}`}>
                <Play className='mr-2 h-3 w-3' />
                Practice
              </Link>
            </Button>
            <Button size='sm' asChild className={'col-span-2'}>
              <Link href={`/dashboard/mock-interviews/${item._id}/attempts`}>
                <NotebookText className='mr-2 h-3 w-3' />
                Attempts
              </Link>
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link href={`/dashboard/mock-interviews/${item._id}/update`}>
                <Edit className='mr-2 h-3 w-3' />
                Edit
              </Link>
            </Button>
            <DeleteDialogBox
              title='Are you absolutely sure?'
              disable={isDeleteLoading}
              description=' This action cannot be undone. This will permanently delete this mock
            interview from our servers.'
              onDelete={handleDelete}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MockInterviewCard;
