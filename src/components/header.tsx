'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/dashboard/context/user-context';
import { useState } from 'react';
import { postLogout } from '@/app/api/auth/postLogout';
import { useCredentials } from '@/hooks/use-credentials';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearCredentials } = useCredentials();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await postLogout();
      clearCredentials();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      clearCredentials();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.firstName?.[0] || '';
    const lastInitial = user.lastName?.[0] || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const getUserDisplayName = () => {
    if (loading) return 'Loading...';
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  };

  const getUserEmail = () => {
    if (loading) return 'Loading...';
    return user?.email || 'No email';
  };

  return (
    <header className={className}>
      <div className='flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6'>
        <div className='flex flex-1 items-center gap-4'>
          <div className='flex items-center gap-2'>
            <h1 className='text-lg font-semibold'>Dashboard</h1>
            {/* Debug info */}
            {error && (
              <span className='text-xs text-red-500'>Error: {error}</span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={user?.profileImage || '/placeholder.svg'}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback className='bg-gradient-to-br from-green-400 to-blue-500 text-white'>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {getUserDisplayName()}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {getUserEmail()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/profile')}
              >
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
