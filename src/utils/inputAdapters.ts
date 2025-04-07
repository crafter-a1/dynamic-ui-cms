
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
    console.log("No UI variant provided, defaulting to 'standard'");
    return "standard";
  }
  
  // Normalize the variant to a string and lowercase
  const variantStr = String(variant).toLowerCase();
  
  if (validVariants.includes(variantStr)) {
    const normalizedVariant = variantStr as "standard" | "material" | "pill" | "borderless" | "underlined";
    console.log(`Validated UI variant: ${normalizedVariant}`);
    return normalizedVariant;
  }
  
  console.warn(`Invalid UI variant '${variant}' provided, defaulting to 'standard'`);
  return "standard";
}

/**
 * Normalize appearance settings to ensure consistent structure
 * @param appearance The appearance settings to normalize
 * @returns Normalized appearance settings
 */
export const normalizeAppearanceSettings = (appearance: any = {}): Record<string, any> => {
  // Ensure we're working with an object
  const settings = typeof appearance === 'object' && appearance !== null ? appearance : {};
  
  // Validate and normalize UI variant - ensure we always have a valid value
  const uiVariant = validateUIVariant(settings.uiVariant || settings.uiVariation);
  
  // Log the normalized UI variant for debugging
  console.log(`Normalized UI variant: ${uiVariant}`);
  
  return {
    uiVariant,
    theme: settings.theme || 'classic',
    colors: {
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
};

/**
 * Normalizes and validates field-specific settings based on field type
 * @param fieldType The type of field
 * @param settings The settings to normalize
 * @returns Normalized field-specific settings
 */
export const normalizeFieldSpecificSettings = (fieldType: string, settings: any = {}): Record<string, any> => {
  const normalizedSettings: Record<string, any> = {};
  
  switch (fieldType.toLowerCase()) {
    case 'number':
      return {
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
        keyFilter: settings.keyFilter || 'none',
        maxLength: settings.maxLength ? Number(settings.maxLength) : undefined,
        minLength: settings.minLength ? Number(settings.minLength) : undefined,
        mask: settings.mask || '',
      };
      
    case 'textarea':
    case 'markdown':
      return {
        rows: settings.rows ? Number(settings.rows) : 5,
        minLength: settings.minLength ? Number(settings.minLength) : undefined,
        maxLength: settings.maxLength ? Number(settings.maxLength) : undefined,
      };
      
    case 'wysiwyg':
    case 'blockeditor':
      return {
        minHeight: settings.minHeight || '200px',
        toolbar: settings.toolbar || ['basic'],
      };
      
    case 'tags':
      return {
        maxTags: settings.maxTags ? Number(settings.maxTags) : 10,
        duplicates: !!settings.allowDuplicates,
        transform: settings.transform || 'none', // none, lowercase, uppercase
      };
      
    case 'mask':
      return {
        mask: settings.mask || '',
        placeholder: settings.placeholder || '',
      };
      
    case 'slug':
      return {
        prefix: settings.prefix || '',
        suffix: settings.suffix || '',
        separator: settings.separator || '-',
      };
      
    case 'otp':
      return {
        length: settings.length ? Number(settings.length) : 6,
        type: ['numeric', 'alphanumeric'].includes(settings.type) ? settings.type : 'numeric',
      };
      
    case 'color':
      return {
        showAlpha: !!settings.showAlpha,
        presets: Array.isArray(settings.presets) ? settings.presets : [],
        defaultFormat: ['hex', 'rgb', 'hsl'].includes(settings.defaultFormat) ? settings.defaultFormat : 'hex',
      };
      
    default:
      return normalizedSettings;
  }
};
