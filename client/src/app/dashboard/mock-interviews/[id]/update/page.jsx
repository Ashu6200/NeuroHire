'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorMessage } from '@hookform/error-message';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DifficultySlider from '@/components/form/DifficultySlider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMockInterviewByIdQuery } from '@/store/mockInterviewFeature/mockInterviewService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const pageHeader = {
  title: 'Update Your Mock Interview',
  subtitle:
    'Update tailored interview questions based on your resume and target role. Practice smarter, not harder—with AI that understands your unique journey.',
};
const schema = yup.object({
  title: yup.string().required(),
  companyName: yup.string(),
  role: yup.string().required(),
  domain: yup.string().required(),
  experienceLevel: yup.string().required(),
  technicalDifficulty: yup.string().required(),
  behavioralDifficulty: yup.string().required(),
  generalDifficulty: yup.string().required(),
  situationalDifficulty: yup.string().required(),
  jobProfileDescription: yup.string().required(),
  preferredCandidateProfile: yup.string().required(),
});
const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'midLevel', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

const UpdateMockInterview = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: item, isLoading, isSuccess } = useGetMockInterviewByIdQuery(id);
  const [updateMockInterview, { isLoading: isUpdateLoading }] =
    useUpdateMockInterviewMutation();
  const value = useMemo(
    () => ({
      title: item?.data?.mockInterview?.title || '',
      companyName: item?.data?.mockInterview?.companyName || '',
      role: item?.data?.mockInterview?.role || '',
      domain: item?.data?.mockInterview?.domain || '',
      experienceLevel: item?.data?.mockInterview?.experienceLevel || 'entry',
      technicalDifficulty:
        item?.data?.mockInterview?.technicalDifficulty || 'medium',
      behavioralDifficulty:
        item?.data?.mockInterview?.behavioralDifficulty || 'medium',
      generalDifficulty:
        item?.data?.mockInterview?.generalDifficulty || 'medium',
      situationalDifficulty:
        item?.data?.mockInterview?.situationalDifficulty || 'medium',
      jobProfileDescription:
        item?.data?.mockInterview?.jobProfileDescription || '',
      preferredCandidateProfile:
        item?.data?.mockInterview?.preferredCandidateProfile || '',
    }),
    [item],
  );
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: value,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      reset(value);
    }
  }, [isLoading, isSuccess, value, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await updateMockInterview({ id, data }).unwrap();
      if (response?.success) {
        toast.success('Updated successfully', {
          description: 'You are being redirected to your dashboard.',
        });
        router.push('/dashboard/mock-interviews');
      } else {
        toast.error('Failed to update mock interview');
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

  const technicalDifficulty = watch('technicalDifficulty');
  const behavioralDifficulty = watch('behavioralDifficulty');
  const generalDifficulty = watch('generalDifficulty');
  const situationalDifficulty = watch('situationalDifficulty');

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
      <Tabs defaultValue='create' className='w-full '>
        <TabsList className='grid w-full grid-cols-2 border shadow-xs dark:bg-input/30 dark:border-input'>
          <TabsTrigger value='create'> Update Interview</TabsTrigger>
          <TabsTrigger value='templates'>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value='create'>
          <Card className='p-0 border shadow-xs dark:bg-input/30 dark:border-input'>
            <CardContent className='p-6'>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-flow-col grid-cols-2 grid-rows-1 gap-4 p-4'>
                  <div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                          id='title'
                          placeholder='Enter title'
                          {...register('title', {
                            required: 'Title is required',
                          })}
                        />
                        <ErrorMessage
                          errors={errors}
                          name='title'
                          render={({ message }) => (
                            <p className='text-red-500 text-xs'>{message}</p>
                          )}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='companyName'>Company Name</Label>
                        <Input
                          id='companyName'
                          placeholder='Enter company name'
                          {...register('companyName', {
                            required: 'Company name is required',
                          })}
                        />
                        {errors.companyName?.message && (
                          <p className='text-red-500 text-xs'>
                            {String(errors.companyName.message)}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='role'>Role</Label>
                        <Input
                          id='role'
                          placeholder='Enter job role'
                          {...register('role', {
                            required: 'Role is required',
                          })}
                        />
                        {errors.role?.message && (
                          <p className='text-red-500 text-xs'>
                            {String(errors.role.message)}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='domain'>Domain</Label>
                        <Input
                          id='domain'
                          placeholder='Enter domain'
                          {...register('domain', {
                            required: 'Domain is required',
                          })}
                        />
                        {errors.domain?.message && (
                          <p className='text-red-500 text-xs'>
                            {String(errors.domain.message)}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2 md:col-span-2'>
                        <Label htmlFor='experienceLevel'>
                          Experience Level
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            setValue('experienceLevel', value);
                            trigger('experienceLevel');
                          }}
                          defaultValue={watch('experienceLevel')}
                          id='experienceLevel'
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select experience level' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {experienceLevels.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.experienceLevel?.message && (
                          <p className='text-red-500 text-xs'>
                            {String(errors.experienceLevel.message)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-8 mt-4'>
                      <DifficultySlider
                        id='technicalDifficulty'
                        label='Technical Questions Difficulty'
                        value={technicalDifficulty}
                        setValue={setValue}
                        register={register}
                      />

                      <DifficultySlider
                        id='behavioralDifficulty'
                        label='Behavioral Questions Difficulty'
                        value={behavioralDifficulty}
                        setValue={setValue}
                        register={register}
                      />

                      <DifficultySlider
                        id='generalDifficulty'
                        label='General Questions Difficulty'
                        value={generalDifficulty}
                        setValue={setValue}
                        register={register}
                      />
                      <DifficultySlider
                        id='situationalDifficulty'
                        label='Situational Questions Difficulty'
                        value={situationalDifficulty}
                        setValue={setValue}
                        register={register}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                      <Label htmlFor='jobProfileDescription'>
                        Job Profile Description
                      </Label>
                      <Textarea
                        id='jobProfileDescription'
                        placeholder='Enter detailed job description'
                        className='min-h-[150px] h-full mt-2'
                        {...register('jobProfileDescription')}
                      />
                      {errors.jobProfileDescription?.message && (
                        <p className='text-red-500 text-xs'>
                          {String(errors.jobProfileDescription.message)}
                        </p>
                      )}
                    </div>
                    <div className='pt-2'>
                      <Label htmlFor='preferredCandidateProfile'>
                        Preferred Candidate Profile
                      </Label>
                      <Textarea
                        id='preferredCandidateProfile'
                        placeholder='Enter preferred candidate profile'
                        className='min-h-[150px] h-full mt-2'
                        {...register('preferredCandidateProfile')}
                      />
                      {errors.preferredCandidateProfile?.message && (
                        <p className='text-red-500 text-xs'>
                          {String(errors.preferredCandidateProfile.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-4 justify-end mt-8'>
                  <Button
                    type='submit'
                    variant='outline'
                    disabled={isUpdateLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => reset(value)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='templates'>
          <div className='space-y-6'>
            <div className='rounded-lg border p-4'>
              <h3 className='font-medium text-2xl mb-2'>
                Interview Template Preview
              </h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Profile</p>
                    <p className='font-medium'>
                      {watch('profile') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Company</p>
                    <p className='font-medium'>
                      {watch('companyName') || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Role</p>
                    <p className='font-medium'>
                      {watch('role') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Experience Level
                    </p>
                    <p className='font-medium'>
                      {watch('experienceLevel') || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>
                    Difficulty Settings
                  </p>
                  <div className='flex gap-2 mt-1'>
                    <Badge variant='outline'>
                      Technical:{' '}
                      {technicalDifficulty < 20
                        ? 'Very Easy'
                        : technicalDifficulty < 40
                          ? 'Easy'
                          : technicalDifficulty < 60
                            ? 'Medium'
                            : technicalDifficulty < 80
                              ? 'Hard'
                              : 'Very Hard'}
                    </Badge>
                    <Badge variant='outline'>
                      Behavioral:{' '}
                      {behavioralDifficulty < 20
                        ? 'Very Easy'
                        : behavioralDifficulty < 40
                          ? 'Easy'
                          : behavioralDifficulty < 60
                            ? 'Medium'
                            : behavioralDifficulty < 80
                              ? 'Hard'
                              : 'Very Hard'}
                    </Badge>
                    <Badge variant='outline'>
                      General:{' '}
                      {generalDifficulty < 20
                        ? 'Very Easy'
                        : generalDifficulty < 40
                          ? 'Easy'
                          : generalDifficulty < 60
                            ? 'Medium'
                            : generalDifficulty < 80
                              ? 'Hard'
                              : 'Very Hard'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Job Profile Description
                  </p>
                  <p className='font-medium'>
                    {watch('jobProfileDescription') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Preferred Candidate Profile
                  </p>
                  <p className='font-medium'>
                    {watch('preferredCandidateProfile') || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default UpdateMockInterview;
