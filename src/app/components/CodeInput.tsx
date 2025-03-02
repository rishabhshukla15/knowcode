'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CodeInputProps {
  onCodeSubmit: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ onCodeSubmit }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onCodeSubmit(code);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code-input" className="block text-lg font-medium mb-2">
            Paste your code here:
          </label>
          <Textarea
            id="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono h-64 resize-none"
            placeholder="// Paste your code here and I'll explain it in simple terms..."
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">
            Explain This Code
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CodeInput;