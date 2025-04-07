
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, FileIcon, FileText, ImageIcon, FileAudio, FileVideo, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
}

interface MultiFileInputFieldProps {
  id: string;
  label?: string;
  value?: File[];
  onChange: (value: File[]) => void;
  accept?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  showPreviews?: boolean;
}

export function MultiFileInputField({
  id,
  label,
  value = [],
  onChange,
  accept,
  required = false,
  helpText,
  className,
  maxSize = 10, // Default 10MB
  maxFiles = 5,
  showPreviews = true
}: MultiFileInputFieldProps) {
  const [dragActive, setDragActive] = useState(false);
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Update internal files state when value changes externally
  React.useEffect(() => {
    if (value.length === 0) {
      setFilesWithProgress([]);
    } else {
      // Only add files that aren't already tracked
      const existingFileIds = filesWithProgress.map(f => f.id);
      const newFiles = value.filter(file => {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        return !existingFileIds.includes(fileId);
      });
      
      if (newFiles.length > 0) {
        setFilesWithProgress(prev => [
          ...prev,
          ...newFiles.map(file => ({
            file,
            id: `${file.name}-${file.size}-${file.lastModified}`,
            progress: 100
          }))
        ]);
      }
    }
  }, [value]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    validateAndProcessFiles(fileArray);
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
      const files = Array.from(e.dataTransfer.files);
      validateAndProcessFiles(files);
    }
  };

  // Validate and process the selected files
  const validateAndProcessFiles = (files: File[]) => {
    setError(null);
    
    // Check if adding these files would exceed the max number
    if (value.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Validate each file
    const validFiles: File[] = [];
    const invalidFiles: {file: File, reason: string}[] = [];
    
    files.forEach(file => {
      // Check file type if accept is specified
      if (accept && !file.type.match(accept.replace(/,/g, '|').replace(/\*/g, '.*'))) {
        invalidFiles.push({
          file,
          reason: `Invalid file type: ${file.name}`
        });
        return;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        invalidFiles.push({
          file,
          reason: `File too large: ${file.name}`
        });
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      setError(`${invalidFiles.length} file(s) couldn't be added`);
    }
    
    if (validFiles.length === 0) return;
    
    // Add files with progress
    const newFilesWithProgress = validFiles.map(file => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}`,
      progress: 0
    }));
    
    setFilesWithProgress(prev => [...prev, ...newFilesWithProgress]);
    
    // Simulate upload progress for each file
    newFilesWithProgress.forEach(fileWithProgress => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        
        setFilesWithProgress(prev => 
          prev.map(f => 
            f.id === fileWithProgress.id ? { ...f, progress } : f
          )
        );
        
        if (progress >= 100) {
          clearInterval(interval);
          onChange([...value, fileWithProgress.file]);
        }
      }, 100 + Math.random() * 200); // Randomize a bit for realistic effect
    });
  };

  // Function to remove a file
  const handleRemoveFile = (fileId: string) => {
    const fileIndex = filesWithProgress.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;
    
    // Remove from internal state
    setFilesWithProgress(prev => prev.filter(f => f.id !== fileId));
    
    // Remove from value
    const fileToRemove = filesWithProgress[fileIndex].file;
    onChange(value.filter(f => f !== fileToRemove));
  };

  // Render file icon based on type
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return showPreviews && URL.createObjectURL ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-md border flex-shrink-0">
          <img 
            src={URL.createObjectURL(file)} 
            alt="File preview" 
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <ImageIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
      );
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-6 w-6 text-green-500 flex-shrink-0" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-6 w-6 text-red-500 flex-shrink-0" />;
    } else if (fileType === 'application/pdf' || fileType.includes('text')) {
      return <FileText className="h-6 w-6 text-orange-500 flex-shrink-0" />;
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {/* File list */}
      {filesWithProgress.length > 0 && (
        <div className="space-y-2 mb-4">
          {filesWithProgress.map((fileWithProgress) => (
            <div 
              key={fileWithProgress.id}
              className="flex items-center gap-3 p-2 rounded-md border bg-background"
            >
              {getFileIcon(fileWithProgress.file)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {fileWithProgress.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(fileWithProgress.file.size / 1024 / 1024).toFixed(2)}MB
                </p>
                
                {fileWithProgress.progress < 100 && (
                  <Progress value={fileWithProgress.progress} className="h-1 mt-1" />
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(fileWithProgress.id)}
                type="button"
                className="h-7 w-7 text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {filesWithProgress.length > 0 && filesWithProgress.length < maxFiles && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="mt-2"
            >
              Add more files
            </Button>
          )}
        </div>
      )}
      
      {/* Upload area */}
      {filesWithProgress.length < maxFiles && (
        <div
          onDragEnter={handleDrag}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-input",
            error ? "border-red-500 bg-red-50" : ""
          )}
        >
          <div
            className="flex flex-col items-center justify-center gap-2 text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Drag & drop your files here</p>
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
              {filesWithProgress.length}/{maxFiles} files • Max {maxSize}MB per file
              {accept && ` • Accepted formats: ${accept}`}
            </p>
          </div>
        </div>
      )}
      
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
        multiple
        required={required && filesWithProgress.length === 0}
        aria-describedby={helpText ? `${id}-description` : undefined}
      />
    </div>
  );
}

export default MultiFileInputField;
