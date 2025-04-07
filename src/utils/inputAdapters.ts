
export const adaptInputChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
  return event.target.value;
};

/**
 * Validates that a UI variant is one of the allowed types
 * @param variant The variant to validate
 * @returns A validated variant string (defaulting to "standard" if invalid)
 */
export const validateUIVariant = (variant: any): "standard" | "material" | "pill" | "borderless" | "underlined" => {
  const validVariants = ["standard", "material", "pill", "borderless", "underlined"];
  
  if (typeof variant === 'string' && validVariants.includes(variant.toLowerCase())) {
    const normalizedVariant = variant.toLowerCase() as "standard" | "material" | "pill" | "borderless" | "underlined";
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
  
  // Validate and normalize UI variant
  const uiVariant = validateUIVariant(settings.uiVariant || settings.uiVariation);
  
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
