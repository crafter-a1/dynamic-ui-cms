
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, FileIcon, FileText, ImageIcon, FileAudio, FileVideo } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileInputFieldProps {
  id: string;
  label?: string;
  value?: File | null;
  onChange: (value: File | null) => void;
  accept?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  maxSize?: number; // in MB
  showPreview?: boolean;
}

export function FileInputField({
  id,
  label,
  value = null,
  onChange,
  accept,
  required = false,
  helpText,
  className,
  maxSize = 10, // Default 10MB
  showPreview = true
}: FileInputFieldProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    validateAndProcessFile(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  // Validate and process the selected file
  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check file type if accept is specified
    if (accept && !file.type.match(accept.replace(/,/g, '|').replace(/\*/g, '.*'))) {
      setError(`Invalid file type. Accepted types: ${accept}`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds maximum allowed size of ${maxSize}MB`);
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onChange(file);
      }
    }, 100);
  };

  // Function to remove the selected file
  const handleRemoveFile = () => {
    onChange(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render file icon based on type
  const renderFileIcon = () => {
    if (!value) return <FileIcon className="h-10 w-10 text-muted-foreground" />;
    
    const fileType = value.type;
    
    if (fileType.startsWith('image/')) {
      return showPreview && URL.createObjectURL ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-md border">
          <img 
            src={URL.createObjectURL(value)} 
            alt="File preview" 
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <ImageIcon className="h-10 w-10 text-blue-500" />
      );
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-10 w-10 text-green-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-10 w-10 text-red-500" />;
    } else if (fileType === 'application/pdf' || fileType.includes('text')) {
      return <FileText className="h-10 w-10 text-orange-500" />;
    } else {
      return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div
        onDragEnter={handleDrag}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-input",
          error ? "border-red-500 bg-red-50" : ""
        )}
      >
        {!value ? (
          <div
            className="flex flex-col items-center justify-center gap-2 text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Drag & drop your file here</p>
              <p className="text-sm text-muted-foreground">or</p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Browse files
            </Button>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {maxSize}MB
              {accept && ` • Accepted formats: ${accept}`}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {renderFileIcon()}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)}MB • {value.type || 'Unknown type'}
              </p>
              
              {uploadProgress < 100 && (
                <Progress value={uploadProgress} className="h-1 mt-2" />
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              type="button"
              className="h-8 w-8 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {helpText && !error && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
      
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        required={required}
        aria-describedby={helpText ? `${id}-description` : undefined}
      />
    </div>
  );
}

export default FileInputField;
