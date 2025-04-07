
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
    
    // Extract appearance settings more consistently, prioritizing settings.appearance
    const appearance = field.settings?.appearance || field.appearance || {};
    
    // Make sure UI variant is always validated
    if (!appearance.uiVariant) {
      console.log(`Field ${field.name} is missing uiVariant, setting to default`);
      appearance.uiVariant = 'standard';
    } else {
      console.log(`Field ${field.name} has uiVariant: ${appearance.uiVariant}`);
    }
    
    // Normalize appearance settings to ensure consistent format
    const normalizedAppearance = {
      ...appearance,
      uiVariant: appearance.uiVariant
    };
    
    // Extract field-specific settings based on field type
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
    
    // Extract advanced settings
    const advanced = field.settings?.advanced || field.advanced || {};

    // Debug logging for appearance settings
    console.log(`Processed appearance for ${field.name}:`, JSON.stringify(normalizedAppearance, null, 2));

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
      advanced: {
        ...advanced,
        ...fieldSpecificSettings
      },
      options: field.options || [],
      // Include field-specific properties for backward compatibility
      ...fieldSpecificSettings
    };
  });
}
