'use client';

import MetricCard from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminDashboardQuery } from '@/store/adminFeature/adminService';
import { CreditCard, Users, Zap } from 'lucide-react';

const AdminDashboardPage = () => {
  const { data, isLoading } = useGetAdminDashboardQuery();
  const dashboard = data?.data;

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Admin</h1>
        <p className='text-sm text-muted-foreground'>
          Manage users, billing, subscriptions, and AI usage.
        </p>
      </div>

      {isLoading ? (
        <p className='text-sm text-muted-foreground'>Loading admin data...</p>
      ) : (
        <div className='grid gap-4 md:grid-cols-3'>
          <MetricCard
            title='Users'
            stats={dashboard?.users || 0}
            icon={<Users className='h-4 w-4 text-muted-foreground' />}
            body='App user profiles'
          />
          <MetricCard
            title='Active Subscriptions'
            stats={dashboard?.activeSubscriptions || 0}
            icon={<CreditCard className='h-4 w-4 text-muted-foreground' />}
            body='Currently active plans'
          />
          <MetricCard
            title='Recent Usage Rows'
            stats={dashboard?.recentUsage?.length || 0}
            icon={<Zap className='h-4 w-4 text-muted-foreground' />}
            body='Latest metered activity'
          />
        </div>
      )}

      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2 text-sm'>
          {(dashboard?.recentPayments || []).map((payment) => (
            <div
              key={payment._id}
              className='flex items-center justify-between rounded-lg border p-3'
            >
              <span>{payment.planCode}</span>
              <span>{payment.status}</span>
              <span>₹{(payment.amount || 0) / 100}</span>
            </div>
          ))}
          {!dashboard?.recentPayments?.length && (
            <p className='text-muted-foreground'>No payments yet.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminDashboardPage;
