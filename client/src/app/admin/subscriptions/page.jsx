'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminSubscriptionsQuery } from '@/store/adminFeature/adminService';

const AdminSubscriptionsPage = () => {
  const { data, isLoading } = useGetAdminSubscriptionsQuery();
  const subscriptions = data?.data?.subscriptions || [];

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Subscriptions</h1>
        <p className='text-sm text-muted-foreground'>
          Track subscription status across all users.
        </p>
      </div>
      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 text-sm'>
          {isLoading && <p>Loading subscriptions...</p>}
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className='grid gap-2 rounded-lg border p-3 md:grid-cols-4'
            >
              <span>{subscription.userId}</span>
              <span>{subscription.planCode}</span>
              <span>{subscription.status}</span>
              <span>
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminSubscriptionsPage;
