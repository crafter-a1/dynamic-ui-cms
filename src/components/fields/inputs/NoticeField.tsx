
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  X 
} from 'lucide-react';

type NoticeVariant = 'info' | 'success' | 'warning' | 'error';

interface NoticeFieldProps {
  id: string;
  title?: string;
  content: string;
  variant?: NoticeVariant;
  dismissable?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: boolean;
}

export const NoticeField = ({
  id,
  title,
  content,
  variant = 'info',
  dismissable = false,
  onDismiss,
  className,
  icon = true
}: NoticeFieldProps) => {
  // Define variant-specific styles
  const variantStyles: Record<NoticeVariant, { 
    bg: string, 
    border: string, 
    title: string,
    text: string,
    icon: React.ReactNode 
  }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-800',
      text: 'text-blue-700',
      icon: <Info className="h-5 w-5 text-blue-500" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-800',
      text: 'text-green-700',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-800',
      text: 'text-red-700',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    }
  };
  
  const styles = variantStyles[variant];

  return (
    <div 
      id={id}
      className={cn(
        "p-4 rounded-md border",
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {icon && <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>}

          <div className="flex-1 space-y-1">
            {title && (
              <h4 className={cn("font-semibold", styles.title)}>{title}</h4>
            )}
            <div className={cn("text-sm", styles.text)}>{content}</div>
          </div>
        </div>

        {dismissable && onDismiss && (
          <button 
            type="button"
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 ml-3 p-1 rounded-full opacity-60 hover:opacity-100",
              styles.text
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NoticeField;
