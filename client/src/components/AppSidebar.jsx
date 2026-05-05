'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from './ui/sidebar';
import { GalleryVerticalEnd, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { NavUser } from './NavUser';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { usePathname } from 'next/navigation';
import { SidebarItems } from '@/constants';
import { useSession } from '@/lib/auth-client';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useGetMyBillingQuery } from '@/store/billingFeature/billingService';

const PLAN_COLORS = {
  free: 'secondary',
  pro: 'default',
  max: 'destructive',
};

const ADMIN_ROLES = ['admin', 'super_admin', 'support', 'billing_admin'];

const UsageMeter = ({ open }) => {
  const { data: session } = useSession();
  const { data: billingData, isLoading } = useGetMyBillingQuery();

  const roles = String(session?.user?.role || 'user')
    .split(',')
    .map((r) => r.trim());
  if (roles.some((r) => ADMIN_ROLES.includes(r))) return null;

  if (isLoading || !billingData?.data) return null;

  const { subscription, usage, limits } = billingData.data;
  const plan = subscription?.planCode || 'free';
  const used = usage?.mockInterviewsCreated ?? 0;
  const limit = limits?.mockInterviewsCreated ?? 3;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  if (!open) {
    return (
      <div className='px-2 py-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className='w-full h-1 rounded-full bg-muted overflow-hidden cursor-default'
              aria-label={`Interviews: ${used}/${limit}`}
            >
              <div
                className={`h-full rounded-full ${pct >= 100 ? 'bg-destructive' : pct >= 80 ? 'bg-yellow-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side='right'>
            Interviews: {used}/{limit}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className='px-3 py-2 space-y-1'>
      <div className='flex items-center justify-between'>
        <span className='text-xs text-muted-foreground'>Interviews</span>
        <span className='text-xs text-muted-foreground'>
          {used}/{limit}
        </span>
      </div>
      <Progress
        value={pct}
        className={`h-1.5 ${pct >= 100 ? '[&>div]:bg-destructive' : pct >= 80 ? '[&>div]:bg-yellow-500' : ''}`}
      />
      {plan === 'free' && pct >= 80 && (
        <Link
          href='/pricing'
          className='flex items-center gap-1 text-xs text-primary hover:underline mt-1'
        >
          <ArrowUpCircle className='h-3 w-3' />
          Upgrade for more
        </Link>
      )}
    </div>
  );
};

const AppSidebar = () => {
  const { open, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: billingData } = useGetMyBillingQuery();

  const isActive = (url) => pathname === url;
  const roles = String(session?.user?.role || 'user')
    .split(',')
    .map((role) => role.trim());
  const visibleItems = SidebarItems.filter(
    (item) => !item.roles || item.roles.some((role) => roles.includes(role)),
  );

  const plan = billingData?.data?.subscription?.planCode || 'free';

  return (
    <Sidebar collapsible='icon' className='bg-black shadow-xs' side='left'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='hover:bg-transparent'>
            <SidebarMenuButton
              size='lg'
              onClick={toggleSidebar}
              variant='ghost'
              className='bg-transparent text-inherit hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit data-[state=open]:bg-transparent data-[state=open]:text-inherit'
            >
              <div
                onClick={toggleSidebar}
                className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'
              >
                <GalleryVerticalEnd className='size-4' />
              </div>
              {open && (
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>NeuroHire</span>
                  <Badge
                    variant={PLAN_COLORS[plan] || 'secondary'}
                    className='w-fit text-[10px] px-1 py-0 h-4 mt-0.5 uppercase'
                  >
                    {plan}
                  </Badge>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {!open ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                        >
                          <Link href={item.url}>
                            {item.icon}
                            <span className='ml-2'>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side='right'
                        align='center'
                        className='hidden md:block'
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        {item.icon}
                        <span className='ml-2'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <UsageMeter open={open} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
