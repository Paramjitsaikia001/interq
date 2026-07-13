'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClear?: boolean;
}

export function SearchBar({
  className,
  value = '',
  onChange,
  onSearch,
  onClear,
  showClear = true,
  placeholder = 'Search...',
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(String(value));

  React.useEffect(() => {
    setInternalValue(String(value));
  }, [value]);

  const handleClear = () => {
    setInternalValue('');
    if (onClear) onClear();
    if (onChange) {
      const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    if (onSearch) onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(internalValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) onChange(e);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-9 pr-12 h-10 w-full rounded-full"
        {...props}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {showClear && internalValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-md"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
