
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface OTPInputFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  length?: number;
  required?: boolean;
  helpText?: string;
  className?: string;
}

export function OTPInputField({
  id,
  label,
  value = '',
  onChange,
  length = 6,
  required = false,
  helpText,
  className
}: OTPInputFieldProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Update OTP state when value prop changes
  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      setOtp([...otpArray, ...Array(length - otpArray.length).fill('')]);
    } else {
      setOtp(Array(length).fill(''));
    }
  }, [value, length]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    
    // Only accept single digits
    if (newValue && !/^\d*$/.test(newValue)) {
      return;
    }
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = newValue.slice(-1); // Take only the last character
    setOtp(newOtp);
    
    // Notify parent component
    onChange(newOtp.join(''));
    
    // Move focus to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move focus to previous input on left arrow
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      // Move focus to next input on right arrow
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    
    if (!pasteData || !/^\d*$/.test(pasteData)) {
      return;
    }
    
    const otpDigits = pasteData.slice(0, length).split('');
    const newOtp = [...Array(length).fill('')];
    
    otpDigits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = otpDigits.length < length ? otpDigits.length : length - 1;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={`${id}-0`}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="flex gap-2 items-center justify-center">
        {Array.from({ length }, (_, i) => (
          <input
            key={`${id}-${i}`}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            id={`${id}-${i}`}
            value={otp[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={i === 0 ? handlePaste : undefined}
            maxLength={1}
            className="w-10 h-12 text-center text-lg font-semibold border border-input rounded-md bg-background focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
            aria-label={`digit ${i + 1}`}
            required={required}
          />
        ))}
      </div>
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs text-center">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default OTPInputField;
