
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
  console.log('Raw fields data received for preview:', JSON.stringify(fields, null, 2));

  return fields.map(field => {
    const apiId = field.api_id || field.apiId || field.name?.toLowerCase().replace(/\s+/g, '_');
    
    // Extract appearance settings more consistently
    // Start by looking in settings.appearance, then field.appearance, then individual properties
    let appearance = {};
    
    // Check all possible locations where appearance settings might be stored
    if (field.settings?.appearance) {
      appearance = { ...appearance, ...field.settings.appearance };
      console.log(`Found appearance in settings.appearance for ${field.name}:`, 
        JSON.stringify(field.settings.appearance, null, 2));
    }
    
    if (field.appearance) {
      appearance = { ...appearance, ...field.appearance };
      console.log(`Found appearance at root level for ${field.name}:`, 
        JSON.stringify(field.appearance, null, 2));
    }
    
    // Check for UI variant specifically in multiple possible locations
    let uiVariant = appearance.uiVariant || appearance.uiVariation;
    
    // Also check for UI variant in settings directly
    if (!uiVariant && field.settings?.uiVariant) {
      uiVariant = field.settings.uiVariant;
    }
    
    if (!uiVariant && field.settings?.uiVariation) {
      uiVariant = field.settings.uiVariation;
    }
    
    // If still no UI variant found, use standard
    if (!uiVariant) {
      console.log(`No uiVariant found for ${field.name}, setting to default 'standard'`);
      uiVariant = 'standard';
    } else {
      console.log(`Field ${field.name} has uiVariant: ${uiVariant}`);
    }
    
    // Ensure UI variant is included in appearance
    const normalizedAppearance = {
      ...appearance,
      uiVariant: uiVariant
    };
    
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

    // Debug logging for appearance settings
    console.log(`Processed appearance for ${field.name}:`, JSON.stringify(normalizedAppearance, null, 2));
    console.log(`UI variant for ${field.name}: ${normalizedAppearance.uiVariant}`);

    // Get placeholder with consistent fallback
    let placeholder = ui_options.placeholder || field.placeholder || `Enter ${field.name}...`;

    return {
      id: field.id,
      name: field.name,
      type: field.type,
      apiId: apiId,
      required: field.required || false,
      helpText: field.settings?.helpText || field.description || ui_options.help_text,
      placeholder: placeholder,
      ui_options: ui_options,
      validation: validation,
      appearance: normalizedAppearance,
      advanced: advanced,
      options: field.options || [],
      // Include field-specific properties for backward compatibility
      ...fieldSpecificSettings
    };
  });
}
