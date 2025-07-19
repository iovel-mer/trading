'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText } from 'lucide-react';
import { DocumentsTable } from './components/documents-table';
import { FileUpload } from './components/file-upload';
import { useTranslations } from 'next-intl';

const DocumentsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const t = useTranslations();
  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('documents.title')}
          </h1>
          <p className='text-muted-foreground'>{t('documents.subtitle')}</p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='upload' className='flex items-center gap-2'>
              <Upload className='h-4 w-4' />
              {t('documents.tabs.upload')}
            </TabsTrigger>
            <TabsTrigger value='manage' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              {t('documents.tabs.manage')}
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value='upload' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-1'>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </div>
              <div className='lg:col-span-2'>
                <DocumentsTable refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value='manage' className='space-y-6'>
            <DocumentsTable refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
