'use client';

import CommonHeader from '@/components/dashboard/CommonHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useGetBillingPlansQuery,
  useGetMyBillingQuery,
} from '@/store/billingFeature/billingService';
import { toast } from 'sonner';

const BillingPage = () => {
  const { data: billingData, isLoading: isBillingLoading } =
    useGetMyBillingQuery();
  const { data: planData } = useGetBillingPlansQuery();
  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const billing = billingData?.data;
  const plans = planData?.data?.plans || [];
  const usage = billing?.usage?.metrics || {};
  const limits = billing?.limits || {};

  const handlePlan = async (planCode) => {
    try {
      const response = await createSubscription(planCode).unwrap();
      const shortUrl = response?.data?.razorpaySubscription?.shortUrl;

      if (shortUrl) {
        window.location.href = shortUrl;
        return;
      }

      toast.success(response?.message || 'Plan updated');
    } catch (error) {
      toast.error(error?.data?.message || 'Unable to update plan');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled');
    } catch (error) {
      toast.error(error?.data?.message || 'Unable to cancel subscription');
    }
  };

  return (
    <section className='flex flex-col gap-6 p-4'>
      <CommonHeader
        title='Billing'
        subtitle='Manage your plan, usage, and recent payments.'
        link='/pricing'
        buttonText='View Pricing'
      />

      {isBillingLoading ? (
        <p className='text-sm text-muted-foreground'>Loading billing...</p>
      ) : (
        <div className='grid gap-4 lg:grid-cols-[1fr_1.2fr]'>
          <Card className='rounded-lg'>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 text-sm'>
              <p className='text-2xl font-bold'>{billing?.plan?.name}</p>
              <p className='text-muted-foreground'>
                Status: {billing?.subscription?.status}
              </p>
              <p className='text-muted-foreground'>
                Renews:{' '}
                {billing?.subscription?.currentPeriodEnd
                  ? new Date(
                      billing.subscription.currentPeriodEnd
                    ).toLocaleDateString()
                  : 'Monthly'}
              </p>
              <Button
                variant='outline'
                disabled={isCancelling}
                onClick={handleCancel}
              >
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>

          <Card className='rounded-lg'>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-3 sm:grid-cols-2'>
              {Object.keys(limits).map((metric) => (
                <div key={metric} className='rounded-lg border p-3'>
                  <p className='text-sm font-medium'>{metric}</p>
                  <p className='text-2xl font-bold'>
                    {usage[metric] || 0} / {limits[metric]}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-3'>
        {plans.map((plan) => (
          <Card key={plan.code} className='rounded-lg'>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 text-sm'>
              <p>{plan.description}</p>
              <p className='text-2xl font-bold'>
                {plan.amount === 0
                  ? 'Free'
                  : plan.displayAmount || `₹${plan.amount / 100}`}
              </p>
              <Button
                disabled={isCreating || billing?.plan?.code === plan.code}
                onClick={() => handlePlan(plan.code)}
              >
                {billing?.plan?.code === plan.code ? 'Current Plan' : 'Select'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BillingPage;
