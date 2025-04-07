
import { CollectionFormData } from "@/services/CollectionService";

/**
 * Adapts form data from CollectionForm to match the expected CollectionFormData interface
 */
export function adaptCollectionFormData(formData: { 
  name?: string; 
  description?: string; 
  apiId?: string; 
}): CollectionFormData {
  return {
    name: formData.name || '', // Ensure name is always provided
    apiId: formData.apiId || '', // Ensure apiId is always provided
    description: formData.description,
  };
}

/**
 * Adapts number field settings for display or submission
 */
export function adaptNumberFieldSettings(settings: {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  currency?: string;
  showButtons?: boolean;
  buttonLayout?: 'horizontal' | 'vertical';
  floatLabel?: boolean;
  filled?: boolean;
  accessibilityLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return {
    min: settings.min ?? 0,
    max: settings.max ?? 100,
    step: settings.step ?? 1,
    defaultValue: settings.defaultValue ?? 0,
    prefix: settings.prefix ?? '',
    suffix: settings.suffix ?? '',
    locale: settings.locale ?? 'en-US',
    currency: settings.currency ?? '',
    showButtons: settings.showButtons ?? false,
    buttonLayout: settings.buttonLayout ?? 'horizontal',
    floatLabel: settings.floatLabel ?? false,
    filled: settings.filled ?? false,
    accessibilityLabel: settings.accessibilityLabel ?? '',
    disabled: settings.disabled ?? false,
    invalid: settings.invalid ?? false,
  };
}

/**
 * Formats a number according to locale and currency settings
 */
export function formatNumberWithSettings(
  value: number | null, 
  locale: string = 'en-US', 
  currency?: string, 
  prefix?: string, 
  suffix?: string
): string {
  if (value === null) return '';
  
  let formattedValue = '';
  
  if (currency) {
    formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  } else {
    formattedValue = new Intl.NumberFormat(locale).format(value);
  }
  
  // Add prefix and suffix if provided and not already handled by currency formatting
  if (!currency && prefix) formattedValue = prefix + formattedValue;
  if (suffix) formattedValue = formattedValue + suffix;
  
  return formattedValue;
}

/**
 * Adapter to convert React.ChangeEvent to the expected string value for InputTextField
 */
export function adaptInputChangeEvent(setter: (value: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
}
