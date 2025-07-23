'use client';

import type React from 'react';

import { useState, useTransition, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { postUserProfile } from '@/app/api/user-settings/postUserProfile';
import { getUser } from '@/app/api/user-settings/getUser';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const t = useTranslations();
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await getUser();
      if (result.success) {
        setUser(result.data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await postUserProfile(formData);

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        const updatedUser = await getUser();
        if (updatedUser.success) {
          setUser(updatedUser.data);
        }
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update profile',
        });
      }
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('profile.title')}
          </h1>
          <p className='text-muted-foreground'>{t('profile.subtitle')}</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <p>{message.text}</p>
          </div>
        )}

        <div className='grid gap-6 md:grid-cols-3'>
          <Card className='md:col-span-1'>
            <CardHeader className='text-center'>
              <div className='relative mx-auto w-24 h-24 mb-4'>
                <Avatar className='w-24 h-24'>
                  <AvatarFallback className='text-2xl bg-gradient-to-br from-green-400 to-blue-500 text-white'>
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'DU'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>
                {user
                  ? `${user.firstName} ${user.lastName}`
                  : t('profile.loading')}
              </CardTitle>
              <CardDescription>
                {user?.email || t('profile.loading')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>{t('profile.personalInformation')}</CardTitle>
              <CardDescription>
                {t('profile.personalInformationDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      {t('profile.firstName')}
                    </label>
                    <input
                      type='text'
                      value={formData.firstName}
                      onChange={e =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className='w-full p-2 border rounded-md bg-background'
                      disabled={isPending}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      {t('profile.lastName')}
                    </label>
                    <input
                      type='text'
                      value={formData.lastName}
                      onChange={e =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className='w-full p-2 border rounded-md bg-background'
                      disabled={isPending}
                    />
                  </div>
                  <div className='space-y-2 flex flex-col'>
                    <label className='text-sm font-medium'>
                      {t('profile.email')}
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className='flex-1 p-2 border rounded-md bg-background'
                      disabled
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      {t('profile.phoneNumber')}
                    </label>
                    <input
                      type='tel'
                      value={formData.telephone}
                      onChange={e =>
                        handleInputChange('telephone', e.target.value)
                      }
                      className='w-full p-2 border rounded-md bg-background'
                      disabled={isPending}
                    />
                  </div>
                  <div className='space-y-2 md:col-span-2'>
                    <label className='text-sm font-medium'>
                      {t('profile.username')}
                    </label>
                    <input
                      type='text'
                      value={user?.username || ''}
                      className='w-full p-2 border rounded-md bg-background'
                      disabled
                    />
                  </div>
                </div>
                <div className='flex justify-end space-x-2'>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        {t('profile.saving')}
                      </>
                    ) : (
                      t('profile.saveChanges')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
