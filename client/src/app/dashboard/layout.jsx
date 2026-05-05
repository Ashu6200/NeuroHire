'use client';
import AppSidebar from '@/components/AppSidebar';
import UpgradeModal from '@/components/UpgradeModal';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from '@/lib/auth-client';
import { useGetMyBillingQuery } from '@/store/billingFeature/billingService';
import { toast } from 'sonner';

const UsageWatcher = () => {
  const { data: billingData } = useGetMyBillingQuery();
  const warned = useState(false);

  useEffect(() => {
    if (!billingData?.data) return;
    const { usage, limits } = billingData.data;
    if (!usage || !limits) return;

    const checks = [
      { key: 'mockInterviewsCreated', label: 'mock interviews' },
      { key: 'aiGenerations', label: 'AI generations' },
      { key: 'resumeExports', label: 'resume exports' },
    ];

    checks.forEach(({ key, label }) => {
      const used = usage[key] ?? 0;
      const limit = limits[key] ?? 0;
      if (limit === 0) return;
      const ratio = used / limit;
      if (ratio >= 1) {
        toast.warning(`You've reached your ${label} limit. Upgrade to continue.`, {
          id: `limit-${key}`,
          duration: Infinity,
        });
      } else if (ratio >= 0.8) {
        toast.info(`You're close to your ${label} limit (${used}/${limit} used).`, {
          id: `warn-${key}`,
        });
      }
    });
  }, [billingData]);

  return null;
};

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace('/signIn');
      return;
    }
  }, [isPending, router, session?.user]);

  const [initialState, setInitialState] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const sidebarState = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sidebar:state='));

    if (sidebarState) {
      setInitialState(sidebarState.split('=')[1] === 'true');
    }
  }, []);
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) {
        document.cookie = `sidebar:state=false; path=/; max-age=${
          60 * 60 * 24 * 7
        }`;
        setInitialState(false);
      }
    };

    handleRouteChange();
  }, [pathname]);

  if (isPending) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={initialState}>
      <AppSidebar />
      <ScrollArea className='flex-1 h-screen w-full'>{children}</ScrollArea>
      <UpgradeModal />
      {session?.user && <UsageWatcher />}
    </SidebarProvider>
  );
};

export default DashboardLayout;
