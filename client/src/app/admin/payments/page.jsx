'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminPaymentsQuery } from '@/store/adminFeature/adminService';

const AdminPaymentsPage = () => {
  const { data, isLoading } = useGetAdminPaymentsQuery();
  const payments = data?.data?.payments || [];

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Payments</h1>
        <p className='text-sm text-muted-foreground'>
          Review captured and failed Razorpay payments.
        </p>
      </div>
      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>Payment Events</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 text-sm'>
          {isLoading && <p>Loading payments...</p>}
          {payments.map((payment) => (
            <div
              key={payment._id}
              className='grid gap-2 rounded-lg border p-3 md:grid-cols-5'
            >
              <span>{payment.userId}</span>
              <span>{payment.planCode}</span>
              <span>{payment.status}</span>
              <span>₹{(payment.amount || 0) / 100}</span>
              <span>{payment.razorpayPaymentId || 'Pending'}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminPaymentsPage;
