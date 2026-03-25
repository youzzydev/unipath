'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUniversity } from '@/context/university-context';
import type { UniversityWithCoordsAndIntelligence } from '@/types';
import { Crosshair, ZoomIn, ZoomOut, RotateCcw, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UKIntelligenceMapProps {
  universities: UniversityWithCoordsAndIntelligence[];
}

export function UKIntelligenceMap({ universities }: UKIntelligenceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const { selectedUniversity, setSelectedUniversity, hoveredUniversity, setHoveredUniversity } = useUniversity();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!mapContainer.current) return;
    if (map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = token;

    const initMap = () => {
      if (!mapContainer.current) return;
      
      const width = mapContainer.current.offsetWidth;
      const height = mapContainer.current.offsetHeight;
      
      if (width === 0 || height === 0) {
        setTimeout(initMap, 100);
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-2.0, 54.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 12,
        attributionControl: false,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        
        if (!map.current) return;
        
        // Add 3D terrain
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        
        // Add 3D building layer
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id;
        
        map.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': '#1a1f2e',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.8,
            },
          },
          labelLayerId
        );
        
        // Set atmospheric fog for depth
        map.current.setFog({
          color: 'rgb(10, 15, 26)',
          'high-color': 'rgb(17, 24, 39)',
          'horizon-blend': 0.02,
          'space-color': '#050810',
          'star-intensity': 0.15,
        });
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Map failed to load');
      });
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    universities.forEach((university) => {
      if (!university.latitude || !university.longitude) return;

      const el = document.createElement('div');
      el.className = 'university-marker';
      el.innerHTML = `
        <div class="marker-container ${selectedUniversity?.id === university.id ? 'selected' : ''} ${hoveredUniversity === university.slug ? 'hovered' : ''}">
          <div class="marker-pulse"></div>
          <div class="marker-dot">
            <div class="marker-inner"></div>
          </div>
          <div class="marker-label">
            <span>${university.city}</span>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedUniversity(university);
      });

      el.addEventListener('mouseenter', () => {
        setHoveredUniversity(university.slug);
      });

      el.addEventListener('mouseleave', () => {
        setHoveredUniversity(null);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([university.longitude, university.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, universities, selectedUniversity, hoveredUniversity, setSelectedUniversity, setHoveredUniversity]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedUniversity) return;

    if (selectedUniversity.latitude && selectedUniversity.longitude) {
      // 3D fly-to animation with pitch and bearing
      map.current.flyTo({
        center: [selectedUniversity.longitude, selectedUniversity.latitude],
        zoom: 13,
        pitch: 60,
        bearing: Math.random() * 30 - 15, // Slight random rotation for dynamic feel
        duration: 2000,
        essential: true,
        curve: 1.2,
      });
    }
  }, [mapLoaded, selectedUniversity]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map.current) return;
    const currentZoom = map.current.getZoom();
    const currentPitch = map.current.getPitch();
    
    map.current.flyTo({
      zoom: direction === 'in' ? currentZoom + 1 : currentZoom - 1,
      pitch: direction === 'in' ? Math.min(currentPitch + 10, 75) : Math.max(currentPitch - 10, 0),
      duration: 400,
    });
  };

  const handleToggle3D = () => {
    if (!map.current) return;
    const new3DMode = !is3DMode;
    setIs3DMode(new3DMode);
    
    const currentPitch = map.current.getPitch();
    map.current.flyTo({
      pitch: new3DMode ? 60 : 0,
      duration: 800,
    });
  };

  const handleReset = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [-2.0, 54.0],
      zoom: 5,
      pitch: is3DMode ? 45 : 0,
      bearing: 0,
      duration: 1500,
    });
  };

  if (mapError) {
    return (
      <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-[var(--intelligence-surface)] intelligence-border-glow">
        <div className="absolute inset-0 intelligence-grid-bg opacity-30" />
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 p-8 text-center">
          <Crosshair className="h-12 w-12 text-[var(--intelligence-glow)]/50" />
          <p className="text-sm font-medium text-white">Map Error</p>
          <p className="text-sm">{mapError}</p>
          <p className="text-xs text-slate-500">Check browser console for more details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-[var(--intelligence-border)]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
      />

      <div className="absolute inset-0 pointer-events-none intelligence-grid-bg opacity-20" />
      
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom('in')}
          className="h-10 w-10 rounded-lg bg-[var(--intelligence-surface)]/90 border border-[var(--intelligence-border)] backdrop-blur-sm hover:bg-[var(--intelligence-surface)]"
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom('out')}
          className="h-10 w-10 rounded-lg bg-[var(--intelligence-surface)]/90 border border-[var(--intelligence-border)] backdrop-blur-sm hover:bg-[var(--intelligence-surface)]"
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleToggle3D}
          className={is3DMode 
            ? "h-10 w-10 rounded-lg bg-[var(--intelligence-glow)]/20 border border-[var(--intelligence-glow)] backdrop-blur-sm hover:bg-[var(--intelligence-glow)]/30" 
            : "h-10 w-10 rounded-lg bg-[var(--intelligence-surface)]/90 border border-[var(--intelligence-border)] backdrop-blur-sm hover:bg-[var(--intelligence-surface)]"
          }
          title={is3DMode ? "Switch to 2D view" : "Switch to 3D view"}
        >
          <Box className={`h-4 w-4 ${is3DMode ? "text-[var(--intelligence-glow)]" : "text-white"}`} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10 rounded-lg bg-[var(--intelligence-surface)]/90 border border-[var(--intelligence-border)] backdrop-blur-sm hover:bg-[var(--intelligence-surface)]"
        >
          <RotateCcw className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-lg bg-[var(--intelligence-surface)]/90 border border-[var(--intelligence-border)] backdrop-blur-sm">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--intelligence-glow)]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full ring-2 ring-[var(--intelligence-target)] bg-transparent" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--intelligence-surface)]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--intelligence-glow)]/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-[var(--intelligence-glow)]/50 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-full border-2 border-[var(--intelligence-glow)] animate-ping" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-sm text-slate-400">Loading intelligence map...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .university-marker {
          cursor: pointer;
        }
        
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 217, 255, 0.2);
          animation: marker-pulse 2s ease-out infinite;
        }
        
        .marker-container.selected .marker-pulse {
          width: 60px;
          height: 60px;
          background: rgba(0, 255, 136, 0.3);
        }
        
        .marker-container.hovered .marker-pulse {
          width: 50px;
          height: 50px;
        }
        
        .marker-dot {
          position: relative;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--intelligence-glow, #00D9FF);
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
          transition: all 0.2s ease;
        }
        
        .marker-container.selected .marker-dot {
          width: 20px;
          height: 20px;
          background: var(--intelligence-target, #00FF88);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.7);
        }
        
        .marker-container.hovered .marker-dot {
          transform: scale(1.2);
        }
        
        .marker-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--intelligence-bg, #0a0f1a);
        }
        
        .marker-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .marker-container:hover .marker-label,
        .marker-container.selected .marker-label,
        .marker-container.hovered .marker-label {
          opacity: 1;
        }
        
        .marker-label span {
          font-size: 11px;
          font-weight: 500;
          color: var(--intelligence-glow, #00D9FF);
          background: rgba(10, 15, 26, 0.9);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(0, 217, 255, 0.2);
        }
        
        @keyframes marker-pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .mapboxgl-ctrl-attrib {
          background: rgba(10, 15, 26, 0.8) !important;
          color: #64748b !important;
          font-size: 10px !important;
        }
        
        .mapboxgl-ctrl-attrib a {
          color: var(--intelligence-glow, #00D9FF) !important;
        }
      `}</style>
    </div>
  );
}
