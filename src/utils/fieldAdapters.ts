
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

    // Consistently extract appearance settings from settings.appearance
    const appearance = field.settings?.appearance || {};
    
    // Extract additional UI options
    const ui_options = field.settings?.ui_options || {};
    
    // Extract validation settings
    const validation = field.settings?.validation || {};
    
    // Extract advanced settings
    const advanced = field.settings?.advanced || {};

    // Ensure we have a valid uiVariant
    if (!appearance.uiVariant) {
      appearance.uiVariant = 'standard';
    }
    
    console.log(`Extracted appearance settings for field ${field.name}:`, JSON.stringify(appearance, null, 2));
    console.log(`UI Variant for field ${field.name}:`, appearance.uiVariant);

    // Get placeholder with consistent fallback
    let placeholder = ui_options.placeholder || field.placeholder || `Enter ${field.name}...`;
    console.log(`Using placeholder for ${field.name}:`, placeholder);

    // Debug logging
    console.log('Field data processed for preview:', {
      fieldName: field.name,
      fieldType: field.type,
      settings: field.settings,
      appearance,
      placeholder
    });

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
      appearance: appearance,
      advanced: advanced,
      options: field.options || [],
      min: validation?.min !== undefined ? validation.min : (field.min !== undefined ? field.min : undefined),
      max: validation?.max !== undefined ? validation.max : (field.max !== undefined ? field.max : undefined),
      maxTags: advanced?.maxTags || 10,
      mask: advanced?.mask || field.mask,
      keyFilter: validation?.keyFilter || field.keyFilter,
      length: advanced?.length || 6,  // For OTP input
      rows: advanced?.rows || 10,     // For textarea/markdown
      prefix: advanced?.prefix || field.prefix,
      suffix: advanced?.suffix || field.suffix,
    };
  });
}
