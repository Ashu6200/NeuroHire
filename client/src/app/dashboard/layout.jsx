'use client';
import AppSidebar from '@/components/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const userStoreData = useSelector((state) => state.userStore);
  const { isAuthenticated } = userStoreData;
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signIn');
    }
  }, [isAuthenticated]);

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

  return (
    <SidebarProvider defaultOpen={initialState}>
      <AppSidebar />
      <ScrollArea className='flex-1 h-screen w-full'>{children}</ScrollArea>
    </SidebarProvider>
  );
};

export default DashboardLayout;
