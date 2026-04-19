'use client';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useVerifyOtpServiceMutation } from '@/store/userFeature/userService';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be 6 digits'),
});
const VerifyOtp = () => {
  const router = useRouter();
  const userStoreData = useSelector((state) => state.userStore);
  const { user, isAuthenticated } = userStoreData;
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
  const [verifyOtpService, { isLoading }] = useVerifyOtpServiceMutation();
  const onSubmit = async (data) => {
    try {
      const credentials = {
        otp: data.otp,
        email: user.email,
      };
      console.log('Credentials for OTP verification:', credentials);
      const response = await verifyOtpService(credentials).unwrap();
      if (response?.success) {
        toast.success('Verification successful', {
          description: 'Your account has been verified successfully.',
        });
        router.push('/dashboard');
        reset();
      }
    } catch (err) {
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
    <form
      className={cn('flex flex-col items-center gap-6')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Verify your account</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          A verification code has been sent to your email.
        </p>
      </div>
      <div className='text-center'>
        <p className='text-xs text-muted-foreground'>
          Please enter the 6-digit code to verify your email address.
        </p>
      </div>
      <div className='grid gap-6 items-center'>
        <div className='grid gap-2'>
          <Controller
            control={control}
            name='otp'
            render={({ field }) => (
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                  {[...Array(6)].map((_, idx) => (
                    <InputOTPSlot key={idx} index={idx} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className='text-sm text-red-500'>{errors.otp.message}</p>
          )}
        </div>
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
      <div className='text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/signUp' className='underline underline-offset-4'>
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default VerifyOtp;
