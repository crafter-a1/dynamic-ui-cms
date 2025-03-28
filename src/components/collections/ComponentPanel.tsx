
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  TextInput, FileText, Type, List, Check, ToggleLeft, 
  Image, Link2, Hash, Phone, Mail, Globe, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentPanelItemProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const ComponentPanelItem = ({ id, name, icon, description }: ComponentPanelItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${id}`,
    data: {
      type: 'component',
      component: id,
      name,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 1,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={cn(
        "field-builder-item",
        isDragging && "opacity-50 border-dashed"
      )}
    >
      <div className="p-2 bg-cms-lightGray rounded-md">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{name}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const ComponentPanel = () => {
  const inputComponents = [
    { id: 'text', name: 'Text Input', icon: <TextInput size={20} className="text-cms-primary" />, description: 'Single line text input' },
    { id: 'textarea', name: 'Text Area', icon: <FileText size={20} className="text-cms-primary" />, description: 'Multi-line text input' },
    { id: 'richText', name: 'Rich Text', icon: <Type size={20} className="text-cms-primary" />, description: 'Formatted text editor' },
    { id: 'number', name: 'Number', icon: <Hash size={20} className="text-cms-primary" />, description: 'Numeric input field' },
    { id: 'checkbox', name: 'Checkbox', icon: <Check size={20} className="text-cms-primary" />, description: 'True/false selection' },
    { id: 'toggle', name: 'Toggle', icon: <ToggleLeft size={20} className="text-cms-primary" />, description: 'On/off switch control' },
    { id: 'select', name: 'Dropdown', icon: <List size={20} className="text-cms-primary" />, description: 'Select from options' },
    { id: 'date', name: 'Date Picker', icon: <Calendar size={20} className="text-cms-primary" />, description: 'Date selection' },
    { id: 'image', name: 'Image', icon: <Image size={20} className="text-cms-primary" />, description: 'Image upload field' },
    { id: 'url', name: 'URL', icon: <Link2 size={20} className="text-cms-primary" />, description: 'Website URL input' },
    { id: 'email', name: 'Email', icon: <Mail size={20} className="text-cms-primary" />, description: 'Email address input' },
    { id: 'phone', name: 'Phone', icon: <Phone size={20} className="text-cms-primary" />, description: 'Phone number input' },
    { id: 'address', name: 'Address', icon: <MapPin size={20} className="text-cms-primary" />, description: 'Physical address input' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-cms-border p-4">
      <h3 className="text-lg font-medium mb-4">Components</h3>
      <div className="space-y-2">
        {inputComponents.map((component) => (
          <ComponentPanelItem 
            key={component.id} 
            id={component.id} 
            name={component.name} 
            icon={component.icon} 
            description={component.description} 
          />
        ))}
      </div>
    </div>
  );
};

export default ComponentPanel;
