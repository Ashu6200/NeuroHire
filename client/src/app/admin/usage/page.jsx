'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminUsageQuery } from '@/store/adminFeature/adminService';

const AdminUsagePage = () => {
  const { data, isLoading } = useGetAdminUsageQuery();
  const usageRows = data?.data?.usage || [];

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Usage</h1>
        <p className='text-sm text-muted-foreground'>
          Monitor AI generation and feature limits by user.
        </p>
      </div>
      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>Metered Usage</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 text-sm'>
          {isLoading && <p>Loading usage...</p>}
          {usageRows.map((usage) => (
            <div key={usage._id} className='rounded-lg border p-3'>
              <p className='font-medium'>
                {usage.userId} · {usage.period} · {usage.planAtTime}
              </p>
              <div className='mt-2 grid gap-2 md:grid-cols-4'>
                {Object.entries(usage.metrics || {}).map(([key, value]) => (
                  <span key={key}>
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminUsagePage;
