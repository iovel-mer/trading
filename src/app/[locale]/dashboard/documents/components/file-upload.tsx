'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { uploadDocumentAction } from '@/app/api/documents/postDocument';
import { useTranslations } from 'next-intl';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const t = useTranslations();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage('');
      setUploadSuccess(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage('');
      setUploadSuccess(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadMessage('');
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const result = await uploadDocumentAction(formData);

    if (result.success) {
      setUploadMessage(t('documents.upload.uploadSuccess'));
      setUploadSuccess(true);
      setSelectedFile(null);
      onUploadSuccess();
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      setUploadMessage(result.error || t('documents.upload.uploadFailed'));
      setUploadSuccess(false);
    }

    setIsUploading(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage('');
    setUploadSuccess(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          {t('documents.upload.title')}
        </CardTitle>
        <CardDescription>{t('documents.upload.description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div
          className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors'
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-sm text-muted-foreground mb-2'>
            {t('documents.upload.dragAndDrop')}
          </p>

          <input
            id='file-input'
            type='file'
            onChange={handleFileSelect}
            className='hidden'
            accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png'
          />
          <Button
            variant='outline'
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {t('documents.upload.selectFile')}
          </Button>
        </div>

        {selectedFile && (
          <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-3'>
              <File className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>{selectedFile.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={removeFile}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        )}

        {uploadMessage && (
          <div
            className={`text-sm p-3 rounded-lg border ${
              uploadSuccess === true
                ? 'bg-green-50 text-green-800 border-green-200'
                : uploadSuccess === false
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-muted'
            }`}
          >
            {uploadMessage}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className='w-full'
        >
          {isUploading
            ? t('documents.upload.uploading')
            : t('documents.upload.uploadDocument')}
        </Button>
      </CardContent>
    </Card>
  );
}
