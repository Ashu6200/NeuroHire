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
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { NavUser } from './NavUser';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { usePathname } from 'next/navigation';
import { SidebarItems } from '@/constants';

const AppSidebar = () => {
  const { open, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isActive = (url) => pathname === url;

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
              {SidebarItems.map((item) => (
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
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
