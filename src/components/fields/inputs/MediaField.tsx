
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, File, Image, X } from 'lucide-react';

interface MediaFieldProps {
  id: string;
  label: string;
  value: File | string | null;
  onChange: (value: File | string | null) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // In MB
  showPreview?: boolean;
}

interface FilePreviewProps {
  file: File | string | null;
  onRemove: () => void;
  onReplace: () => void;
  disabled?: boolean;
}

const FilePreview = ({ file, onRemove, onReplace, disabled = false }: FilePreviewProps) => {
  const isFileObj = file instanceof File;
  const fileName = isFileObj ? (file as File).name : (file as string || '');
  const fileType = isFileObj ? (file as File).type : '';
  const fileSize = isFileObj ? (file as File).size : 0;
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get the last part of a path or URL (file name)
  const getFileName = (path: string): string => {
    if (!path) return '';
    return path.split('/').pop() || path;
  };

  // Determine if it's an image based on file type or extension
  const isImage = 
    (isFileObj && (file as File).type.startsWith('image/')) || 
    (typeof file === 'string' && (/\.(jpg|jpeg|png|gif|webp|svg)$/i).test(file as string));
  
  return (
    <div className="flex items-center p-2 border rounded-md">
      <div className="flex items-center justify-center h-20 w-20 bg-muted/30 rounded mr-3 overflow-hidden">
        {isImage ? (
          <img 
            src={isFileObj ? URL.createObjectURL(file as File) : (file as string)} 
            alt={isFileObj ? (file as File).name : getFileName(file as string)}
            className="h-full w-full object-cover"
          />
        ) : (
          <File className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm truncate max-w-[180px]">
          {isFileObj ? (file as File).name : getFileName(file as string)}
        </p>
        <p className="text-xs text-muted-foreground">
          {fileType.split('/').pop()?.toUpperCase() || 'FILE'} • {formatFileSize(fileSize)}
        </p>
        <div className="flex gap-3 mt-1">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onReplace}
            disabled={disabled}
            className="h-auto p-0 text-xs text-primary"
          >
            Replace
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            className="h-auto p-0 text-xs text-destructive"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export const MediaField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  className,
  disabled = false,
  accept = "*/*",
  maxSize = 10, // Default 10MB
  showPreview = true
}: MediaFieldProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop();
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Extension check
          return fileExtension.toLowerCase() === type.toLowerCase();
        } else if (type.includes('/*')) {
          // Mime type group check (e.g., 'image/*')
          const typeGroup = type.split('/')[0];
          return fileType.startsWith(`${typeGroup}/`);
        } else {
          // Exact mime type check
          return fileType === type;
        }
      });
      
      if (!isValidType) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return false;
      }
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setError(null);
        onChange(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setError(null);
        onChange(file);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {value && showPreview ? (
        <FilePreview 
          file={value}
          onRemove={handleRemove}
          onReplace={handleClick}
          disabled={disabled}
        />
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md h-[100px] cursor-pointer transition-colors",
            dragActive ? "border-primary/70 bg-primary/5" : "border-muted",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:bg-primary/5"
          )}
          onClick={disabled ? undefined : handleClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default MediaField;
