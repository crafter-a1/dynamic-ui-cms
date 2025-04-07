
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ButtonLink {
  label: string;
  url: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  target?: '_blank' | '_self';
  icon?: boolean;
}

interface ButtonLinksFieldProps {
  id: string;
  label: string;
  buttons: ButtonLink[];
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  onClick?: (url: string) => void;
}

export const ButtonLinksField = ({
  id,
  label,
  buttons = [],
  orientation = 'horizontal',
  required = false,
  helpText = null,
  className,
  disabled = false,
  onClick
}: ButtonLinksFieldProps) => {
  const handleButtonClick = (url: string, event: React.MouseEvent) => {
    if (onClick) {
      event.preventDefault();
      onClick(url);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div 
        className={cn(
          "flex gap-3",
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
        id={id}
      >
        {buttons.map((button, index) => (
          <a
            key={index}
            href={button.url}
            target={button.target || '_self'}
            rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
            onClick={(e) => handleButtonClick(button.url, e)}
          >
            <Button
              variant={button.variant || 'default'}
              disabled={disabled}
              className="flex items-center gap-1.5"
            >
              {button.label}
              {button.icon && <ExternalLink className="h-4 w-4 ml-1" />}
            </Button>
          </a>
        ))}
      </div>

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default ButtonLinksField;
