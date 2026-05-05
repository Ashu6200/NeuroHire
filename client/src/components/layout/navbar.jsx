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
import { useSession } from '@/lib/auth-client';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <nav className='border-b'>
      <div className='flex items-center justify-between px-4 py-4 md:px-12 lg:px-16'>
        {/* Logo */}
        <div className='flex items-center gap-4'>
          <Link href='/' className='text-xl font-bold flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            <span className='truncate'>NeuroHire</span>
          </Link>
          <div className='hidden lg:flex md:items-center md:gap-4'>
            {navItems.map((item) => (
              <div key={item.name} className='relative'>
                <Button variant='ghost' asChild>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          <ThemeSwitcher />
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
            <div className='hidden md:flex gap-4'>
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
              <div className='flex flex-col gap-6 pt-12'>
                <div className='flex items-center justify-between'>
                  <ThemeSwitcher />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className='h-6 w-6' />
                    <span className='sr-only'>Close menu</span>
                  </Button>
                </div>

                <div className='flex flex-col gap-4'>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='text-lg font-medium hover:text-primary transition-colors'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {!user && (
                  <div className='flex flex-col gap-3 mt-4 border-t pt-6'>
                    <Button variant='outline' asChild className='w-full'>
                      <Link
                        href='/signIn'
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild className='w-full'>
                      <Link
                        href='/signUp'
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
