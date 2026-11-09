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
import SubscriptionPlanCard from '@/components/billing/SubscriptionPlanCard';

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

      {billing?.isExpiringSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm font-medium">
            Your premium subscription is ending in less than 3 days. Renew now to maintain your advanced features.
          </p>
        </div>
      )}

      {isBillingLoading ? (
        <p className='text-sm text-muted-foreground'>Loading billing...</p>
      ) : (
        <div className='grid gap-4 lg:grid-cols-[1fr_1.2fr]'>
          <Card className='rounded-lg border-2 shadow-sm'>
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

      <div className='grid gap-6 md:grid-cols-3'>
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.code}
            plan={plan}
            isCurrentPlan={billing?.plan?.code === plan.code}
            onSelect={handlePlan}
            isLoading={isCreating}
          />
        ))}
      </div>
    </section>
  );
};

export default BillingPage;
