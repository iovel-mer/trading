'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HybridDateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export  function HybridDateInput({ value, onChange, disabled }: HybridDateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // e.g., "2025-07-17"
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="dateOfBirth" className="text-slate-200 font-medium">Date of Birth</Label>
      <Input
        id="dateOfBirth"
        name="dateOfBirth"
        type="date"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required
        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
      />
    </div>
  );
}
