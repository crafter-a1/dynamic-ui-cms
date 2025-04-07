
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus } from 'lucide-react';

interface MapFieldProps {
  id: string;
  label: string;
  value: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number } | null) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
}

export const MapField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  className,
  disabled = false
}: MapFieldProps) => {
  // Placeholder for map control (would be replaced with actual mapping implementation)
  const [coordinates, setCoordinates] = useState<string>(
    value ? `${value.lat.toFixed(6)}° ${value.lat >= 0 ? 'N' : 'S'}, ${value.lng.toFixed(6)}° ${value.lng >= 0 ? 'E' : 'W'}` : ''
  );
  const [error, setError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates(e.target.value);
    setError(null);
  };

  const handleSearch = () => {
    // This would be replaced with actual geocoding logic
    try {
      // Parse coordinates (simple example)
      const regex = /(-?\d+\.?\d*)°\s*([NS]?),\s*(-?\d+\.?\d*)°\s*([EW]?)/i;
      const match = coordinates.match(regex);
      
      if (match) {
        const lat = parseFloat(match[1]) * (match[2]?.toLowerCase() === 's' ? -1 : 1);
        const lng = parseFloat(match[3]) * (match[4]?.toLowerCase() === 'w' ? -1 : 1);
        
        onChange({ lat, lng });
      } else {
        setError('Invalid coordinates format. Use: 00.0000° N, 00.0000° E');
      }
    } catch (err) {
      setError('Could not parse coordinates. Check format and try again.');
    }
  };

  const handleZoomIn = () => {
    // Placeholder for zoom in functionality
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Placeholder for zoom out functionality
    console.log('Zoom out');
  };

  useEffect(() => {
    // This would initialize a map using libraries like Leaflet, Mapbox, or Google Maps
    if (!mapContainerRef.current) return;
    
    // Mock map initialization
    const mapElement = mapContainerRef.current;
    mapElement.innerHTML = '';

    // Create mock map components
    const mapBackground = document.createElement('div');
    mapBackground.className = 'absolute inset-0 bg-blue-50/40';
    mapElement.appendChild(mapBackground);
    
    // Create lines to mimic map features
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full');
    svg.innerHTML = `
      <path d="M20,75 L100,50 L150,85 L200,60 L250,80 L300,65" stroke="#aaa" stroke-width="1" fill="none" />
      <path d="M50,120 C120,90 200,110 250,85 C300,60 350,80 380,70" stroke="#aaa" stroke-width="1" fill="none" />
    `;
    mapElement.appendChild(svg);
    
    // Add marker if coordinates exist
    if (value) {
      const marker = document.createElement('div');
      marker.className = 'absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white';
      
      // Position the marker (simplified - just for visualization)
      // In a real map, you'd use the actual coordinates to position
      marker.style.left = '50%';
      marker.style.top = '50%';
      
      mapElement.appendChild(marker);
    }
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="border rounded-md overflow-hidden">
        {/* Map container */}
        <div className="relative w-full h-[150px] bg-muted/20 rounded-t-md" ref={mapContainerRef}>
          {/* Map zoom controls */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1 bg-white rounded-md shadow-sm border">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 rounded-none rounded-t-md hover:bg-muted" 
              onClick={handleZoomIn}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <div className="h-px bg-border" />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 rounded-none rounded-b-md hover:bg-muted" 
              onClick={handleZoomOut}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
          </div>

          {/* Location pin label (would be part of actual map in real implementation) */}
          {value && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65px] text-sm font-medium text-gray-700 bg-white px-2 py-0.5 rounded-full shadow-sm">
              Location Pin
            </div>
          )}
        </div>

        {/* Coordinates input */}
        <div className="flex border-t">
          <Input
            id={id}
            value={coordinates}
            onChange={handleCoordinateChange}
            placeholder="Enter coordinates (e.g. 48.8584° N, 2.2945° E)"
            disabled={disabled}
            className="border-0 rounded-none focus-visible:ring-transparent"
          />
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleSearch} 
            disabled={disabled}
            className="px-4 border-l rounded-none text-primary hover:text-primary"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default MapField;
