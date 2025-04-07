
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
