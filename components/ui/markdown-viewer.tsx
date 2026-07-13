import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MarkdownViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

export function MarkdownViewer({ content, className, ...props }: MarkdownViewerProps) {
  // Simple regex parser logic to make markdown tags render beautifully in Tailwind
  const renderParagraph = (text: string, idx: number) => {
    // Code block
    if (text.startsWith('```')) {
      const codeLines = text.split('\n').filter((_, i) => i > 0 && i < text.split('\n').length - 1);
      return (
        <pre key={idx} className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs font-mono overflow-x-auto my-3 border border-zinc-800">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    }

    // Header 3
    if (text.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-sm font-bold text-foreground mt-4 mb-2">
          {text.replace('### ', '')}
        </h4>
      );
    }

    // Header 2
    if (text.startsWith('## ')) {
      return (
        <h3 key={idx} className="text-base font-bold text-foreground mt-5 mb-2.5 pb-1 border-b border-border/40">
          {text.replace('## ', '')}
        </h3>
      );
    }

    // List item
    if (text.startsWith('1. ') || text.startsWith('- ')) {
      const clean = text.replace(/^[0-9\-.]\s+/, '');
      return (
        <li key={idx} className="text-xs sm:text-sm text-muted-foreground list-disc ml-5 my-1">
          {parseInlineFormatting(clean)}
        </li>
      );
    }

    return (
      <p key={idx} className="text-xs sm:text-sm text-foreground/90 leading-relaxed my-2">
        {parseInlineFormatting(text)}
      </p>
    );
  };

  // Helper to handle inline bold (**text**)
  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Split content by paragraph line breaks or code fences
  const paragraphs: string[] = [];
  let inCode = false;
  let currentBlock: string[] = [];

  content.split('\n').forEach((line) => {
    if (line.startsWith('```')) {
      if (inCode) {
        currentBlock.push(line);
        paragraphs.push(currentBlock.join('\n'));
        currentBlock = [];
        inCode = false;
      } else {
        inCode = true;
        currentBlock.push(line);
      }
    } else if (inCode) {
      currentBlock.push(line);
    } else if (line.trim() === '') {
      // Empty line breaks
    } else {
      paragraphs.push(line);
    }
  });

  return (
    <div className={cn('space-y-1.5 font-sans', className)} {...props}>
      {paragraphs.map((p, idx) => renderParagraph(p, idx))}
    </div>
  );
}
