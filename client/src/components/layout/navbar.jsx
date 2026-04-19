'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  GalleryVerticalEnd,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { navItems } from '@/constants';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const userStoreData = useSelector((state) => state.userStore);
  const { user } = userStoreData;
  return (
    <nav className='border-b'>
      <div className='flex items-center justify-between px-8 py-6 md:px-12 lg:px-16'>
        {/* Logo */}
        <div className='flex items-center gap-4'>
          <Link href='/' className='text-xl font-bold flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            NeuroHire
          </Link>
          <div className='hidden md:flex md:items-center md:gap-4'>
            {navItems.map((item) => (
              <div key={item.name} className='relative'>
                <Button variant='ghost' asChild>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='rounded-full' size='icon'>
                  <Avatar>
                    <AvatarImage
                      src='/placeholder.svg?height=32&width=32'
                      alt='Profile'
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile/me')}>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex gap-4'>
              <Button variant='outline' asChild>
                <Link href='/signIn'>Login</Link>
              </Button>
              <Button asChild>
                <Link href='/signUp'>Sign Up</Link>
              </Button>
            </div>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <div className='flex flex-col gap-6 pt-6'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-4 top-4'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className='h-6 w-6' />
                  <span className='sr-only'>Close menu</span>
                </Button>

                {navItems.map((item) => (
                  <div key={item.name} className='flex flex-col'>
                    <Link
                      href={item.href}
                      className='px-2 py-1 font-medium hover:text-primary'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
