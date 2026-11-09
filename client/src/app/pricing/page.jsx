'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCreateSubscriptionMutation,
  useGetBillingPlansQuery,
} from '@/store/billingFeature/billingService';
import Link from 'next/link';
import { toast } from 'sonner';
import SubscriptionPlanCard from '@/components/billing/SubscriptionPlanCard';

const PricingPage = () => {
  const { data, isLoading } = useGetBillingPlansQuery();
  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const plans = data?.data?.plans || [];

  const handlePlan = async (planCode) => {
    try {
      const response = await createSubscription(planCode).unwrap();
      const shortUrl = response?.data?.razorpaySubscription?.shortUrl;

      if (shortUrl) {
        window.location.href = shortUrl;
        return;
      }

      toast.success(response?.message || 'Plan selected');
    } catch (error) {
      toast.error(error?.data?.message || 'Unable to start checkout');
    }
  };

  return (
    <main className='min-h-screen px-4 py-10'>
      <section className='mx-auto flex max-w-6xl flex-col gap-8'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-primary'>Pricing</p>
          <h1 className='text-3xl font-bold'>Choose your preparation pace</h1>
          <p className='max-w-2xl text-sm text-muted-foreground'>
            Start free, then upgrade when your interview practice needs more AI
            generations, exports, and deeper feedback.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3 pt-6'>
          {isLoading && (
            <div className="col-span-full flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className='text-sm text-muted-foreground'>Fetching best plans for you...</p>
              </div>
            </div>
          )}
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.code}
              plan={plan}
              onSelect={handlePlan}
              isLoading={isCreating}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PricingPage;
