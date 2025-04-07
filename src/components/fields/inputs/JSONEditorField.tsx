
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Code } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface JSONEditorFieldProps {
  id: string;
  label?: string;
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  rows?: number;
  readOnly?: boolean;
}

export function JSONEditorField({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter JSON data",
  required = false,
  helpText,
  className,
  rows = 8,
  readOnly = false
}: JSONEditorFieldProps) {
  const [internalValue, setInternalValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPrettyPrinted, setIsPrettyPrinted] = useState(true);
  
  // Convert object to string for display
  useEffect(() => {
    try {
      if (value === undefined || value === null) {
        setInternalValue('');
      } else if (typeof value === 'object') {
        setInternalValue(JSON.stringify(value, null, 2));
        setIsPrettyPrinted(true);
      } else if (typeof value === 'string') {
        try {
          // Try to parse and re-stringify to pretty print
          const parsedValue = JSON.parse(value);
          setInternalValue(JSON.stringify(parsedValue, null, 2));
          setIsPrettyPrinted(true);
        } catch (e) {
          // If it's not valid JSON, just use the string as-is
          setInternalValue(value);
          setIsPrettyPrinted(false);
        }
      } else {
        setInternalValue(String(value));
        setIsPrettyPrinted(false);
      }
      setError(null);
    } catch (e) {
      setError('Invalid JSON format');
      setInternalValue(typeof value === 'string' ? value : '');
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    if (!readOnly) {
      try {
        if (newValue.trim() === '') {
          onChange('');
          setError(null);
        } else {
          const parsed = JSON.parse(newValue);
          onChange(parsed);
          setError(null);
        }
      } catch (e) {
        setError('Invalid JSON format');
        // Still update with the raw string to allow editing
        // But don't call onChange to avoid saving invalid JSON
      }
    }
  };
  
  const formatJson = () => {
    try {
      if (internalValue.trim() === '') {
        return;
      }
      
      const parsed = JSON.parse(internalValue);
      setInternalValue(JSON.stringify(parsed, null, 2));
      setIsPrettyPrinted(true);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Cannot format invalid JSON');
    }
  };
  
  const compressJson = () => {
    try {
      if (internalValue.trim() === '') {
        return;
      }
      
      const parsed = JSON.parse(internalValue);
      setInternalValue(JSON.stringify(parsed));
      setIsPrettyPrinted(false);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Cannot compress invalid JSON');
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {!readOnly && (
        <div className="flex space-x-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJson}
            disabled={isPrettyPrinted || internalValue.trim() === ''}
            className="text-xs h-8"
          >
            <Code className="mr-1 h-3 w-3" />
            Pretty Print
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={compressJson}
            disabled={!isPrettyPrinted || internalValue.trim() === ''}
            className="text-xs h-8"
          >
            <Code className="mr-1 h-3 w-3" />
            Compress
          </Button>
        </div>
      )}
      
      <Textarea
        id={id}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "font-mono text-sm",
          error ? "border-red-500" : "",
          readOnly ? "bg-gray-50" : ""
        )}
        rows={rows}
        readOnly={readOnly}
      />
      
      {error && (
        <Alert variant="destructive" className="py-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {helpText && !error && (
        <p className="text-muted-foreground text-xs">{helpText}</p>
      )}
    </div>
  );
}

export default JSONEditorField;
