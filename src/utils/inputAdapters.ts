/**
 * Creates a function that accepts a React.ChangeEvent<HTMLInputElement> and calls the provided setter with the input value
 * @param setter - A state setter function that accepts a string value
 * @returns A function that handles React onChange events and passes the value to the setter
 */
export const adaptInputChangeEvent = (setter: (value: string) => void) => {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };
};

/**
 * Validates that a UI variant is one of the allowed types
 * @param variant The variant to validate
 * @returns A validated variant string (defaulting to "standard" if invalid)
 */
export const validateUIVariant = (variant: any): "standard" | "material" | "pill" | "borderless" | "underlined" => {
  const validVariants = ["standard", "material", "pill", "borderless", "underlined"];
  
  // If variant is undefined or null, return the default
  if (variant === undefined || variant === null) {
    console.log("[inputAdapters] No UI variant provided, defaulting to 'standard'");
    return "standard";
  }
  
  // Normalize the variant to a string and lowercase
  const variantStr = String(variant).toLowerCase();
  
  if (validVariants.includes(variantStr)) {
    const normalizedVariant = variantStr as "standard" | "material" | "pill" | "borderless" | "underlined";
    console.log(`[inputAdapters] Validated UI variant: ${normalizedVariant}`);
    return normalizedVariant;
  }
  
  console.warn(`[inputAdapters] Invalid UI variant '${variant}' provided, defaulting to 'standard'`);
  return "standard";
}

/**
 * Normalize appearance settings to ensure consistent structure
 * @param appearance The appearance settings to normalize
 * @returns Normalized appearance settings
 */
export const normalizeAppearanceSettings = (appearance: any = {}): Record<string, any> => {
  // Ensure we're working with an object
  const settings = typeof appearance === 'object' && appearance !== null ? { ...appearance } : {};
  
  // Log original settings for debugging
  console.log("[inputAdapters] Original appearance settings before normalization:", JSON.stringify(settings, null, 2));
  
  // First check if uiVariant exists in any form
  let uiVariantValue = null;
  
  if ('uiVariant' in settings) {
    uiVariantValue = settings.uiVariant;
    console.log(`[inputAdapters] Found uiVariant in settings: ${uiVariantValue}`);
  } else if ('uiVariation' in settings) {
    uiVariantValue = settings.uiVariation;
    console.log(`[inputAdapters] Found uiVariation in settings: ${uiVariantValue}`);
  } else {
    console.log(`[inputAdapters] No UI variant found in settings, will use default`);
  }
  
  // Validate and normalize UI variant - ensure we always have a valid value
  const uiVariant = validateUIVariant(uiVariantValue);
  
  // Create a normalized settings object, preserving any existing properties
  // but ensuring required properties have sensible defaults
  const normalized = {
    ...settings, // Keep all original settings
    uiVariant, // Override or set the UI variant with our validated value
    theme: settings.theme || 'classic',
    colors: {
      ...(settings.colors || {}), // Keep any existing colors
      border: settings.colors?.border || '#e2e8f0',
      text: settings.colors?.text || '#1e293b',
      background: settings.colors?.background || '#ffffff',
      focus: settings.colors?.focus || '#3b82f6',
      label: settings.colors?.label || '#64748b'
    },
    customCSS: settings.customCSS || '',
    isDarkMode: !!settings.isDarkMode,
    textAlign: settings.textAlign || 'left',
    labelPosition: settings.labelPosition || 'top',
    labelWidth: Number(settings.labelWidth) || 30,
    floatLabel: !!settings.floatLabel,
    filled: !!settings.filled,
    showBorder: settings.showBorder !== false,
    showBackground: !!settings.showBackground,
    roundedCorners: settings.roundedCorners || 'medium',
    fieldSize: settings.fieldSize || 'medium',
    labelSize: settings.labelSize || 'medium',
    customClass: settings.customClass || '',
    responsive: settings.responsive || {
      mobile: { fieldSize: 'small' },
      tablet: { fieldSize: 'medium' },
      desktop: { fieldSize: 'medium' }
    }
  };
  
  console.log("[inputAdapters] Normalized appearance settings:", JSON.stringify(normalized, null, 2));
  console.log(`[inputAdapters] UI Variant after normalization: ${normalized.uiVariant}`);
  return normalized;
};

/**
 * Normalizes and validates field-specific settings based on field type
 * @param fieldType The type of field
 * @param settings The settings to normalize
 * @returns Normalized field-specific settings
 */
export const normalizeFieldSpecificSettings = (fieldType: string, settings: any = {}): Record<string, any> => {
  console.log(`[inputAdapters] Normalizing field-specific settings for ${fieldType}:`, JSON.stringify(settings, null, 2));
  
  const normalizedSettings: Record<string, any> = {
    ...settings // Start with all original settings to preserve any we don't explicitly handle
  };
  
  switch (fieldType.toLowerCase()) {
    case 'number':
      return {
        ...normalizedSettings,
        min: settings.min !== undefined ? Number(settings.min) : undefined,
        max: settings.max !== undefined ? Number(settings.max) : undefined,
        step: settings.step !== undefined ? Number(settings.step) : 1,
        prefix: settings.prefix || '',
        suffix: settings.suffix || '',
        showButtons: !!settings.showButtons,
        buttonLayout: ['horizontal', 'vertical'].includes(settings.buttonLayout) ? settings.buttonLayout : 'horizontal',
        currency: settings.currency || 'USD',
        locale: settings.locale || 'en-US',
      };
      
    case 'text':
    case 'password':
      return {
        ...normalizedSettings,
        keyFilter: settings.keyFilter || 'none',
        maxLength: settings.maxLength ? Number(settings.maxLength) : undefined,
        minLength: settings.minLength ? Number(settings.minLength) : undefined,
        mask: settings.mask || '',
      };
      
    case 'textarea':
    case 'markdown':
      return {
        ...normalizedSettings,
        rows: settings.rows ? Number(settings.rows) : 5,
        minLength: settings.minLength ? Number(settings.minLength) : undefined,
        maxLength: settings.maxLength ? Number(settings.maxLength) : undefined,
      };
      
    case 'wysiwyg':
    case 'blockeditor':
      return {
        ...normalizedSettings,
        minHeight: settings.minHeight || '200px',
        toolbar: settings.toolbar || ['basic'],
      };
      
    case 'tags':
      return {
        ...normalizedSettings,
        maxTags: settings.maxTags ? Number(settings.maxTags) : 10,
        duplicates: !!settings.allowDuplicates,
        transform: settings.transform || 'none', // none, lowercase, uppercase
      };
      
    case 'mask':
      return {
        ...normalizedSettings,
        mask: settings.mask || '',
        placeholder: settings.placeholder || '',
      };
      
    case 'slug':
      return {
        ...normalizedSettings,
        prefix: settings.prefix || '',
        suffix: settings.suffix || '',
        separator: settings.separator || '-',
      };
      
    case 'otp':
      return {
        ...normalizedSettings,
        length: settings.length ? Number(settings.length) : 6,
        type: ['numeric', 'alphanumeric'].includes(settings.type) ? settings.type : 'numeric',
      };
      
    case 'color':
      return {
        ...normalizedSettings,
        showAlpha: !!settings.showAlpha,
        presets: Array.isArray(settings.presets) ? settings.presets : [],
        defaultFormat: ['hex', 'rgb', 'hsl'].includes(settings.defaultFormat) ? settings.defaultFormat : 'hex',
      };
      
    default:
      return normalizedSettings;
  }
};
