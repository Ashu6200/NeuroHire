'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useGetAdminUsersQuery,
  useGrantPlanMutation,
  useSetUserRoleMutation,
} from '@/store/adminFeature/adminService';
import { toast } from 'sonner';

const AdminUsersPage = () => {
  const { data, isLoading } = useGetAdminUsersQuery();
  const [grantPlan] = useGrantPlanMutation();
  const [setUserRole] = useSetUserRoleMutation();
  const users = data?.data?.users || [];

  const handleGrantPlan = async (userId, planCode) => {
    try {
      await grantPlan({ userId, planCode }).unwrap();
      toast.success(`${planCode} granted`);
    } catch (error) {
      toast.error(error?.data?.message || 'Unable to grant plan');
    }
  };

  const handleSetAdmin = async (userId) => {
    try {
      await setUserRole({ userId, role: 'admin' }).unwrap();
      toast.success('Role updated');
    } catch (error) {
      toast.error(error?.data?.message || 'Unable to update role');
    }
  };

  return (
    <section className='flex flex-col gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>Users</h1>
        <p className='text-sm text-muted-foreground'>
          Review users, grant plans, and promote admins.
        </p>
      </div>

      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle>User Profiles</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3'>
          {isLoading && <p className='text-sm'>Loading users...</p>}
          {users.map((user) => (
            <div
              key={user._id}
              className='grid gap-3 rounded-lg border p-3 text-sm lg:grid-cols-[1.2fr_1fr_auto]'
            >
              <div>
                <p className='font-medium'>{user.name || 'Unnamed user'}</p>
                <p className='text-muted-foreground'>{user.email}</p>
                <p className='text-xs text-muted-foreground'>
                  Better Auth ID: {user.betterAuthUserId || 'Not synced'}
                </p>
              </div>
              <div>
                <p>Role: {user.role}</p>
                <p>Plan: {user.plan}</p>
                <p>Status: {user.status}</p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    handleGrantPlan(user.betterAuthUserId, 'pro')
                  }
                  disabled={!user.betterAuthUserId}
                >
                  Grant Pro
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    handleGrantPlan(user.betterAuthUserId, 'max')
                  }
                  disabled={!user.betterAuthUserId}
                >
                  Grant Max
                </Button>
                <Button
                  size='sm'
                  onClick={() => handleSetAdmin(user.betterAuthUserId)}
                  disabled={!user.betterAuthUserId}
                >
                  Make Admin
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminUsersPage;
