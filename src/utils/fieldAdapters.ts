
export function adaptCollectionFormData(values: any): any {
  const adaptedFields = values.fields.map((field: any) => {
    let settings = field.settings || {};

    // Adapt number field settings
    if (field.type === 'number') {
      settings = adaptNumberFieldSettings(field.settings);
    }

    // Move any appearance settings at the root level into settings.appearance
    if (field.appearance) {
      settings.appearance = {
        ...(settings.appearance || {}),
        ...field.appearance
      };
      // Remove redundant appearance property at root level
      delete field.appearance;
    }

    return {
      name: field.name,
      api_id: field.apiId,
      type: field.type,
      required: field.required || false,
      settings: settings
    };
  });

  return {
    name: values.name,
    api_id: values.apiId,
    description: values.description,
    status: values.status,
    fields: adaptedFields,
  };
}

export function adaptNumberFieldSettings(settings: any): any {
  const adaptedSettings: any = {};

  if (settings.min !== undefined) {
    adaptedSettings.min = settings.min;
  }
  if (settings.max !== undefined) {
    adaptedSettings.max = settings.max;
  }
  if (settings.step !== undefined) {
    adaptedSettings.step = settings.step;
  }
  if (settings.defaultValue !== undefined) {
    adaptedSettings.defaultValue = settings.defaultValue;
  }
  if (settings.prefix !== undefined) {
    adaptedSettings.prefix = settings.prefix;
  }
  if (settings.suffix !== undefined) {
    adaptedSettings.suffix = settings.suffix;
  }
  if (settings.locale !== undefined) {
    adaptedSettings.locale = settings.locale;
  }
  if (settings.currency !== undefined) {
    adaptedSettings.currency = settings.currency;
  }
  if (settings.showButtons !== undefined) {
    adaptedSettings.showButtons = settings.showButtons;
  }
  if (settings.buttonLayout !== undefined) {
    adaptedSettings.buttonLayout = settings.buttonLayout;
  }
  if (settings.floatLabel !== undefined) {
    adaptedSettings.floatLabel = settings.floatLabel;
  }
  if (settings.filled !== undefined) {
    adaptedSettings.filled = settings.filled;
  }
  if (settings.accessibilityLabel !== undefined) {
    adaptedSettings.accessibilityLabel = settings.accessibilityLabel;
  }

  return adaptedSettings;
}

export function adaptFieldsForPreview(fields: any[]): any[] {
  console.log('[fieldAdapters] Raw fields data received for preview:', JSON.stringify(fields, null, 2));

  return fields.map(field => {
    const apiId = field.api_id || field.apiId || field.name?.toLowerCase().replace(/\s+/g, '_');
    
    // CRITICAL FIX: Extract appearance settings correctly and with proper precedence
    // This is the main source of the bug where settings weren't being preserved
    let appearance: Record<string, any> = {};
    
    // Log the input field for debugging
    console.log(`[fieldAdapters] Processing field ${field.name} for preview:`, JSON.stringify(field, null, 2));
    
    // First check for direct appearance settings (this has highest precedence)
    if (field.appearance && Object.keys(field.appearance).length > 0) {
      appearance = { ...appearance, ...field.appearance };
      console.log(`[fieldAdapters] Found appearance at root level for ${field.name}:`, 
        JSON.stringify(field.appearance, null, 2));
    }
    
    // Then check for settings.appearance (lower precedence)
    if (field.settings?.appearance && Object.keys(field.settings.appearance).length > 0) {
      // Only use these if not already set by direct appearance
      Object.keys(field.settings.appearance).forEach(key => {
        if (appearance[key] === undefined) {
          appearance[key] = field.settings.appearance[key];
        }
      });
      console.log(`[fieldAdapters] Found appearance in settings.appearance for ${field.name}:`, 
        JSON.stringify(field.settings.appearance, null, 2));
    }
    
    // Double-check that UI variant is preserved, this is crucial
    if (!appearance.uiVariant && field.appearance?.uiVariant) {
      appearance.uiVariant = field.appearance.uiVariant;
      console.log(`[fieldAdapters] Explicitly preserving UI variant for ${field.name}: ${appearance.uiVariant}`);
    }
    
    // Extract field-specific settings
    let fieldSpecificSettings = {};
    
    switch (field.type) {
      case 'number':
        fieldSpecificSettings = {
          min: field.settings?.min !== undefined ? field.settings.min : field.min,
          max: field.settings?.max !== undefined ? field.settings.max : field.max,
          step: field.settings?.step || field.step || 1,
          prefix: field.settings?.prefix || field.prefix || '',
          suffix: field.settings?.suffix || field.suffix || '',
          showButtons: field.settings?.showButtons || field.showButtons || false,
          buttonLayout: field.settings?.buttonLayout || field.buttonLayout || 'horizontal',
          currency: field.settings?.currency || field.currency || 'USD',
          locale: field.settings?.locale || field.locale || 'en-US'
        };
        break;
        
      case 'textarea':
      case 'markdown':
        fieldSpecificSettings = {
          rows: field.settings?.rows || field.rows || 5
        };
        break;
      
      case 'mask':
        fieldSpecificSettings = {
          mask: field.settings?.mask || field.mask || ''
        };
        break;
        
      case 'tags':
        fieldSpecificSettings = {
          maxTags: field.settings?.maxTags || field.maxTags || 10
        };
        break;
        
      case 'color':
        fieldSpecificSettings = {
          showAlpha: field.settings?.showAlpha || field.showAlpha || false,
          defaultFormat: field.settings?.defaultFormat || field.defaultFormat || 'hex'
        };
        break;
        
      case 'otp':
        fieldSpecificSettings = {
          length: field.settings?.length || field.length || 6
        };
        break;
    }
    
    // Extract additional UI options
    const ui_options = field.settings?.ui_options || field.ui_options || {};
    
    // Extract validation settings
    const validation = field.settings?.validation || field.validation || {};
    
    // Extract advanced settings, merging with any previously extracted field-specific settings
    const advanced = {
      ...(field.settings?.advanced || field.advanced || {}),
      ...fieldSpecificSettings
    };

    // Debug logging for final appearance settings
    console.log(`[fieldAdapters] Final processed appearance for ${field.name}:`, JSON.stringify(appearance, null, 2));

    // Get placeholder with consistent fallback
    let placeholder = ui_options.placeholder || field.placeholder || `Enter ${field.name}...`;
    
    // Get help text with consistent fallback
    let helpText = field.settings?.helpText || field.helpText || field.description || ui_options.help_text;

    return {
      id: field.id,
      name: field.name,
      type: field.type,
      apiId: apiId,
      required: field.required || false,
      helpText: helpText,
      placeholder: placeholder,
      ui_options: ui_options,
      validation: validation,
      appearance: appearance, // Use extracted appearance directly
      advanced: advanced,
      options: field.options || [],
      // Include field-specific properties for backward compatibility
      ...fieldSpecificSettings
    };
  });
}
