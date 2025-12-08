// src/components/map/MapControls.jsx
import React from 'react';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';

const MapControls = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onReset,
  minZoom = 1,
  maxZoom = 4
}) => {
  // Logic to disable buttons
  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom; // Will be false if zoom is 1

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-t-lg hover:bg-slate-700 
                   disabled:opacity-50 disabled:cursor-not-allowed text-white border-b border-slate-700"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="p-2 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 
                   disabled:opacity-50 disabled:cursor-not-allowed text-white border-b border-slate-700"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <button
        onClick={onReset}
        disabled={zoom === 1}
        className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-b-lg hover:bg-slate-700 
                   disabled:opacity-50 disabled:cursor-not-allowed text-white"
        title="Reset View"
      >
        <Home className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MapControls;