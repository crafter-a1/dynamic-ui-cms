
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Quote, Code, Link, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MarkdownEditorFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  rows?: number;
}

export function MarkdownEditorField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Enter markdown content...',
  required = false,
  helpText,
  className,
  rows = 10
}: MarkdownEditorFieldProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(id) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newValue = beforeText + prefix + selectedText + suffix + afterText;
    onChange(newValue);

    // Set the cursor position after the insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length, 
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Simple markdown to HTML converter (basic implementation)
  const markdownToHtml = (markdown: string) => {
    let html = markdown
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Convert bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      // Convert images
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
      // Convert bullet lists
      .replace(/^\s*-\s*(.*)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      // Convert code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Convert inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert blockquotes
      .replace(/^>\s*(.*$)/gim, '<blockquote>$1</blockquote>')
      // Convert line breaks
      .replace(/\n/g, '<br />');
    
    return html;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-2">
          <div className="bg-muted/50 p-2 flex flex-wrap items-center gap-1 border border-input border-b-0 rounded-t-md">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('**', '**')}
              title="Bold"
            >
              <Bold size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('*', '*')}
              title="Italic"
            >
              <Italic size={16} />
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('# ')}
              title="Heading 1"
            >
              <Heading1 size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('## ')}
              title="Heading 2"
            >
              <Heading2 size={16} />
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('- ')}
              title="Bullet List"
            >
              <List size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('1. ')}
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
              onClick={() => insertMarkdown('> ')}
              title="Blockquote"
            >
              <Quote size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => insertMarkdown('`', '`')}
              title="Inline Code"
            >
              <Code size={16} />
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 px-2" 
              onClick={() => insertMarkdown('[', '](https://)')}
              title="Insert Link"
            >
              <Link size={16} className="mr-1" />
              <span className="text-xs">Link</span>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 px-2" 
              onClick={() => insertMarkdown('![Alt text](', ')')}
              title="Insert Image"
            >
              <Image size={16} className="mr-1" />
              <span className="text-xs">Image</span>
            </Button>
          </div>
          
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="font-mono text-sm rounded-t-none"
            aria-describedby={helpText ? `${id}-description` : undefined}
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <div 
            className="prose prose-sm max-w-none p-4 border border-input rounded-md min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        </TabsContent>
      </Tabs>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default MarkdownEditorField;
