'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CodeInputProps {
  onCodeSubmit: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ onCodeSubmit }) => {
  const [code, setCode] = useState('');

  // Function to check if input looks like code
  const isValidCode = (input: string): boolean => {
    if (!input.trim()) return false;
    
    // Check for common code patterns
    const codePatterns = [
      // Function declarations/expressions
      /function\s+\w+\s*\(/i,
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>/i,
      /\w+\s*\([^)]*\)\s*{/i,
      
      // Variable declarations
      /(?:var|let|const)\s+\w+\s*=/i,
      
      // Control structures
      /(?:if|for|while|switch)\s*\(/i,
      
      // Class declarations
      /class\s+\w+/i,
      
      // Import/export statements
      /import\s+[{\w\s,}\*]+\s+from/i,
      /export\s+(?:default\s+)?(?:const|let|var|function|class)/i,
      
      // Common programming symbols patterns
      /[{\[\(].*[}\]\)]/,
      /\w+\s*:\s*\w+/,
      /\w+\s*\+=|-=|\*=|\/=|%=|\|\|=|&&=/,
      
      // HTML/XML tags
      /<[\w\-\.]+[^>]*>/,
      
      // SQL keywords
      /SELECT|INSERT|UPDATE|DELETE|FROM|WHERE/i,
      
      // Common programming language keywords
      /\b(?:return|break|continue|try|catch|finally|throw|new|this|super|extends|implements)\b/i
    ];
    
    // Check if the input matches any code pattern
    return codePatterns.some(pattern => pattern.test(input));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    
    if (!trimmedCode) {
      toast.error('Please enter some code');
      return;
    }
    
    if (!isValidCode(trimmedCode)) {
      toast.error('Input doesn\'t appear to be code. Please enter valid code.');
      return;
    }
    
    onCodeSubmit(code);
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