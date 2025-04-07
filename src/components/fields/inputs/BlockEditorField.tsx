
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BlockEditorFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  minHeight?: string;
}

export function BlockEditorField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Enter content...',
  required = false,
  helpText,
  className,
  minHeight = '200px'
}: BlockEditorFieldProps) {
  // For a real implementation, you'd use a rich text editor library
  // This is a simplified version to demonstrate the UI

  const handleExecCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    
    // After command execution, get the updated HTML content
    const editorElement = document.getElementById(`${id}-editor`) as HTMLDivElement;
    if (editorElement) {
      onChange(editorElement.innerHTML);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="border border-input rounded-md overflow-hidden">
        <div className="bg-muted/50 p-2 flex flex-wrap items-center gap-1 border-b">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('bold')}
            title="Bold"
          >
            <Bold size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('italic')}
            title="Italic"
          >
            <Italic size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleExecCommand('underline')}
            title="Underline"
          >
            <Underline size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <List size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => handleExecCommand('justifyRight')}
            title="Align Right"
          >
            <AlignRight size={16} />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) handleExecCommand('createLink', url);
            }}
            title="Insert Link"
          >
            <Link size={16} />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0" 
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) handleExecCommand('insertImage', url);
            }}
            title="Insert Image"
          >
            <Image size={16} />
          </Button>
        </div>
        
        <div
          id={`${id}-editor`}
          contentEditable
          className={cn(
            "p-3 outline-none focus:ring-0 prose prose-sm max-w-none",
            "min-h-[200px] overflow-auto"
          )}
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e) => {
            const target = e.target as HTMLDivElement;
            onChange(target.innerHTML);
          }}
          data-placeholder={placeholder}
        />
      </div>
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default BlockEditorField;
