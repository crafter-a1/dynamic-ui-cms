
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface TranslationValue {
  [locale: string]: string;
}

interface TranslationFieldProps {
  id: string;
  label: string;
  value: TranslationValue;
  onChange: (value: TranslationValue) => void;
  locales?: { code: string; label: string }[];
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

export const TranslationField = ({
  id,
  label,
  value = {},
  onChange,
  locales = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' }
  ],
  required = false,
  helpText = null,
  className,
  disabled = false,
  placeholder = "Enter content here...",
  rows = 5
}: TranslationFieldProps) => {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code || 'en');

  // Initialize values for all locales if they don't exist
  const initializedValues = { ...value };
  locales.forEach(locale => {
    if (!initializedValues[locale.code]) {
      initializedValues[locale.code] = '';
    }
  });

  const handleChange = (locale: string, content: string) => {
    const newValue = {
      ...initializedValues,
      [locale]: content
    };
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Tabs 
        value={activeLocale} 
        onValueChange={setActiveLocale} 
        className="border rounded-md overflow-hidden"
      >
        <TabsList className="w-full grid grid-flow-col auto-cols-fr bg-muted/20">
          {locales.map(locale => (
            <TabsTrigger 
              key={locale.code} 
              value={locale.code}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {locale.label}
              {value[locale.code]?.trim() ? (
                <span className="ml-1.5 w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        {locales.map(locale => (
          <TabsContent 
            key={locale.code} 
            value={locale.code}
            className="p-0 m-0"
          >
            <div className="p-4 border-t">
              <Textarea
                id={`${id}-${locale.code}`}
                value={initializedValues[locale.code] || ''}
                onChange={(e) => handleChange(locale.code, e.target.value)}
                disabled={disabled}
                placeholder={`${placeholder} (${locale.label})`}
                rows={rows}
                className="w-full min-h-[120px] resize-y"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default TranslationField;
