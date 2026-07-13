import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn('flex items-center justify-center gap-1.5 select-none py-4', className)}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="h-8 w-8 rounded-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPages().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          onClick={() => onPageChange && onPageChange(page)}
          className="h-8 w-8 rounded-lg text-xs font-semibold p-0"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="h-8 w-8 rounded-lg"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
