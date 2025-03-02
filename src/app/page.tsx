'use client';

import { useState } from 'react';
import CodeInput from './components/CodeInput';
import CodeExplanation from './components/CodeExplanation';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  const handleCodeSubmit = async (submittedCode: string) => {
    setIsExplaining(true);
    setCode(submittedCode);
    
    try {
      // Use Google Generative AI (Gemini)
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      
      // Initialize the API with your API key
      // In production, use environment variables for API keys
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // First, detect the programming language using Gemini
      const languagePrompt = `Analyze this code and tell me what programming language it is. Respond with ONLY the language name (like "JavaScript", "Python", "Java", etc.) and nothing else:

${submittedCode}`;
      
      const languageResult = await model.generateContent(languagePrompt);
      const language = languageResult.response.text().trim();
      setDetectedLanguage(language);
      
      // Then, create a prompt that asks for a dog-friendly explanation
      const explanationPrompt = `Analyze the following ${language} code snippet and provide your analysis in two sections.

[SYNTAX]
List and explain every syntax element used in the code (e.g., keywords, operators, data types, functions, etc.). Provide a brief description for each element.

[LOGIC]
Explain the overall logic and flow of the code. Describe how the code works, what it does step-by-step, and how its components interact.


Code snippet:
${submittedCode}`;
      
      // Generate the explanation
      const explanationResult = await model.generateContent(explanationPrompt);
      const explanation = explanationResult.response.text();
      
      setExplanation(explanation);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation('Sorry, I had trouble explaining this code. Please try again! Woof!');
      setDetectedLanguage('Unknown');
    } finally {
      setIsExplaining(false);
    }
  };


  return (
    <div className="min-h-screen p-6 pb-20 gap-8 sm:p-10 bg-background">
      <Toaster />
      <header className="mb-12 relative">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground">KnowCode</h1>
          <p className="text-lg text-muted-foreground">
            Paste your code and get a simple explanation that even a dog could understand!
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <CodeInput onCodeSubmit={handleCodeSubmit} />
        
        {isExplaining && (
          <div className="flex justify-center my-8">
            <div className="flex items-center bg-muted px-4 py-2 rounded-md">
              <span className="mr-3 text-muted-foreground font-medium">Analyzing code</span>
              <span className="h-2 w-2 bg-primary rounded-full mx-1 animate-bounce"></span>
              <span className="h-2 w-2 bg-primary rounded-full mx-1 animate-bounce delay-75"></span>
              <span className="h-2 w-2 bg-primary rounded-full mx-1 animate-bounce delay-150"></span>
            </div>
          </div>
        )}

        {!isExplaining && code && explanation && (
          <CodeExplanation code={code} explanation={explanation} detectedLanguage={detectedLanguage} />
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>KnowCode - Making code understandable for everyone</p>
      </footer>
    </div>
  );
}
