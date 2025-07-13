'use client';

import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface SyntaxHighlighterProps {
  children: string;
  language?: string;
  className?: string;
  showCopyButton?: boolean;
}

export function SyntaxHighlighter({ 
  children, 
  language = 'typescript', 
  className = '',
  showCopyButton = true 
}: SyntaxHighlighterProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [children, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const languageClass = `language-${language}`;

  return (
    <div className={`relative group ${className}`}>
      <pre className={`${languageClass} rounded-lg p-4 overflow-x-auto text-sm`}>
        <code className={languageClass}>{children}</code>
      </pre>
      {showCopyButton && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

interface CodeBlockProps {
  children: string;
  language?: string;
  showCopyButton?: boolean;
  className?: string;
}

export function CodeBlock({ children, language = 'typescript', showCopyButton = true, className = '' }: CodeBlockProps) {
  return (
    <div className={`my-4 ${className}`}>
      <SyntaxHighlighter language={language} showCopyButton={showCopyButton}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

interface InlineCodeProps {
  children: string;
  className?: string;
}

export function InlineCode({ children, className = '' }: InlineCodeProps) {
  return (
    <code className={`bg-muted px-2 py-1 rounded text-sm font-mono ${className}`}>
      {children}
    </code>
  );
}
