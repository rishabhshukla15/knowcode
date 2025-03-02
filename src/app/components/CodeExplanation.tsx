'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeExplanationProps {
  code: string;
  explanation: string;
  detectedLanguage?: string;
}

interface ExplanationSection {
  title: string;
  content: string;
  type: string;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({ code, explanation, detectedLanguage }) => {
  const { theme } = useTheme();
  // Format text with double asterisks as bold and remove unnecessary backticks
  const formatText = (text: string): React.ReactNode[] => {
    // First, remove unnecessary backticks
    let processedText = text;
    
    // Replace single backticks that are likely not part of code blocks
    // This regex matches single backticks that are not part of triple backtick code blocks
    processedText = processedText.replace(/`([^`]+)`/g, '$1');
    
    // Now apply bold formatting
    return formatBoldText(processedText);
  };
  
  // Format text with double asterisks as bold
  const formatBoldText = (text: string): React.ReactNode[] => {
    if (!text.includes('**')) return [text];
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let inBold = false;
    let currentText = '';
    
    // Find all occurrences of ** and process them
    for (let i = 0; i < text.length - 1; i++) {
      if (text[i] === '*' && text[i + 1] === '*') {
        // Add text before the ** marker
        const beforeText = text.substring(lastIndex, i);
        
        if (!inBold) {
          // We're entering bold mode
          parts.push(<span key={parts.length}>{beforeText}</span>);
          currentText = '';
        } else {
          // We're exiting bold mode
          parts.push(<strong key={parts.length}>{currentText}</strong>);
          currentText = '';
        }
        
        // Toggle bold state
        inBold = !inBold;
        
        // Skip the second * character
        i++;
        lastIndex = i + 1;
      } else if (i >= lastIndex) {
        // Collect current text
        currentText += text[i];
      }
    }
    
    // Handle the last character if needed
    if (text.length - 1 >= lastIndex) {
      currentText += text[text.length - 1];
    }
    
    // Add any remaining text
    if (currentText) {
      if (inBold) {
        parts.push(<strong key={parts.length}>{currentText}</strong>);
      } else {
        parts.push(<span key={parts.length}>{currentText}</span>);
      }
    }
    
    return parts.length > 0 ? parts : [text];
  };

  // Detect language using highlight.js as fallback if no language is provided
  const detectLanguage = (code: string): string => {
    try {
      const result = hljs.highlightAuto(code);
      return result.language || 'javascript';
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'javascript'; // Default to JavaScript
    }
  };

  // Use the detected language from Gemini if provided, otherwise use highlight.js
  const language = detectedLanguage || detectLanguage(code);

  // Parse the explanation into sections
  const parseExplanation = (text: string): ExplanationSection[] => {
    const sections: ExplanationSection[] = [];
    
    // Regular expressions to match section headers
    const syntaxRegex = /\*\*\[SYNTAX\]\*\*/i;
    const logicRegex = /\*\*\[LOGIC\]\*\*/i;
    
    // Split the text by lines
    const lines = text.split('\n');
    
    let currentSection: ExplanationSection | null = null;
    let currentContent: string[] = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for section headers
      if (syntaxRegex.test(line)) {
        // If we were collecting content for a previous section, save it
        if (currentSection) {
          currentSection.content = currentContent.join('\n');
          sections.push(currentSection);
          currentContent = [];
        }
        
        currentSection = {
          title: 'Syntax',
          content: '',
          type: 'syntax'
        };
      } else if (logicRegex.test(line)) {
        // If we were collecting content for a previous section, save it
        if (currentSection) {
          currentSection.content = currentContent.join('\n');
          sections.push(currentSection);
          currentContent = [];
        }
        
        currentSection = {
          title: 'Logic',
          content: '',
          type: 'logic'
        };
      } else if (currentSection) {
        // Add the line to the current section's content
        if (line || currentContent.length > 0) {
          currentContent.push(line);
        }
      } else {
        // If no section has been found yet, this is introductory text
        if (line) {
          currentContent.push(line);
        }
      }
    }
    
    // Add the last section if there is one
    if (currentSection) {
      currentSection.content = currentContent.join('\n');
      sections.push(currentSection);
    } else if (currentContent.length > 0) {
      // If we have content but no sections were found, add it as 'other'
      sections.push({
        title: 'Explanation',
        content: currentContent.join('\n'),
        type: 'other'
      });
    }
    
    return sections;
  };

  const sections = parseExplanation(explanation);

  // Get tab value based on section type
  const getTabValue = (type: string): string => {
    switch (type) {
      case 'syntax':
        return 'syntax';
      case 'logic':
        return 'logic';
      default:
        return 'explanation';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="bg-muted px-4 py-2 flex justify-between items-center">
          <CardTitle className="text-base font-medium">Detected language: {language}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-auto">
          <SyntaxHighlighter 
            language={language.toLowerCase()} 
            style={theme === 'dark' ? vscDarkPlus : vs} 
            showLineNumbers>
            {code}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
      
      {sections.length > 0 ? (
        <Tabs defaultValue={getTabValue(sections[0].type)} className="w-full">
          <TabsList className="w-full justify-start mb-2">
            {sections.map((section, index) => (
              <TabsTrigger key={index} value={getTabValue(section.type)}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sections.map((section, index) => (
            <TabsContent key={index} value={getTabValue(section.type)} className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {section.content.split('\n').map((paragraph, pIndex) => {
                      // Skip empty paragraphs
                      if (!paragraph.trim()) return null;
                      
                      // Check if paragraph contains a bullet point
                      if (paragraph.includes('* ')) {
                        return (
                          <ul key={pIndex} className="list-disc pl-5 mb-3">
                            <li className="mb-2">{formatText(paragraph.replace('* ', ''))}</li>
                          </ul>
                        );
                      }
                      
                      return <p key={pIndex} className="mb-3">{formatText(paragraph)}</p>;
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Simple Explanation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {explanation.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{formatText(paragraph)}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExplanation;