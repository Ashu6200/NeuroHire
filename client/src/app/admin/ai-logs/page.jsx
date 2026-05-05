'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminAuditLogsQuery } from '@/store/adminFeature/adminService';

const AdminAiLogsPage = () => {
  const { data, isLoading } = useGetAdminAuditLogsQuery();
  const auditLogs = data?.data?.auditLogs || [];

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>AI Logs</h1>
        <p className='text-sm text-muted-foreground'>
          Audit billing, plan changes, and system events.
        </p>
      </div>
      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 text-sm'>
          {isLoading && <p>Loading logs...</p>}
          {auditLogs.map((log) => (
            <div
              key={log._id}
              className='grid gap-2 rounded-lg border p-3 md:grid-cols-4'
            >
              <span>{log.action}</span>
              <span>{log.actorId || 'System'}</span>
              <span>{log.targetType}</span>
              <span>{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminAiLogsPage;
