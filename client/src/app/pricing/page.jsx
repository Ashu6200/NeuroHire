'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCreateSubscriptionMutation,
  useGetBillingPlansQuery,
} from '@/store/billingFeature/billingService';
import Link from 'next/link';
import { toast } from 'sonner';

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

        <div className='grid gap-4 md:grid-cols-3'>
          {isLoading && <p className='text-sm'>Loading plans...</p>}
          {plans.map((plan) => (
            <Card key={plan.code} className='rounded-lg'>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className='flex flex-col gap-4'>
                <div>
                  <span className='text-3xl font-bold'>
                    {plan.amount === 0
                      ? 'Free'
                      : plan.displayAmount || `₹${plan.amount / 100}`}
                  </span>
                  {plan.amount > 0 && (
                    <span className='text-sm text-muted-foreground'>
                      {' '}
                      / month
                    </span>
                  )}
                </div>
                <ul className='flex flex-col gap-2 text-sm'>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {plan.code === 'free' ? (
                  <Button asChild variant='outline'>
                    <Link href='/signUp'>Start Free</Link>
                  </Button>
                ) : (
                  <Button
                    disabled={isCreating}
                    onClick={() => handlePlan(plan.code)}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PricingPage;
