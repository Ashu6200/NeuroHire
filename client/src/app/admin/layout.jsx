'use client';

import AppSidebar from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const adminRoles = ['admin', 'super_admin', 'support', 'billing_admin'];

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [initialState, setInitialState] = useState(true);

  useEffect(() => {
    const sidebarState = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sidebar:state='));

    if (sidebarState) {
      setInitialState(sidebarState.split('=')[1] === 'true');
    }
  }, []);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace('/signIn');
      return;
    }

    const roles = String(session.user.role || 'user').split(',');
    const canAccessAdmin = roles.some((role) =>
      adminRoles.includes(role.trim())
    );

    if (!canAccessAdmin) {
      router.replace('/dashboard');
      return;
    }
  }, [isPending, router, session?.user]);

  if (isPending) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={initialState}>
      <AppSidebar />
      <ScrollArea className='h-screen w-full flex-1'>{children}</ScrollArea>
    </SidebarProvider>
  );
};

export default AdminLayout;
