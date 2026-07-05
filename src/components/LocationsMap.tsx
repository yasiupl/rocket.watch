"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create highlighted icon
const highlightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map boundaries and resetting
function MapController({
  onBoundsChange,
  resetTrigger,
  onResetComplete
}: {
  onBoundsChange: (bounds: L.LatLngBounds) => void,
  resetTrigger: boolean,
  onResetComplete: () => void
}) {
  const map = useMapEvents({
    moveend() {
      onBoundsChange(map.getBounds());
    },
    zoomend() {
      onBoundsChange(map.getBounds());
    },
  });

  useEffect(() => {
    // Initial bounds report
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  useEffect(() => {
    if (resetTrigger) {
      map.setView([20, 0], 2);
      onResetComplete();
    }
  }, [resetTrigger, map, onResetComplete]);

  return null;
}

export default function LocationsMap() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePad, setActivePad] = useState<any | null>(null);
  const [sortField, setSortField] = useState('total_launch_count');
  const [sortOrder, setSortOrder] = useState('desc');
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [resetTrigger, setResetTrigger] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        let allResults: any[] = [];
        let limit = 100;
        let offset = 0;

        while (true) {
          const data = await fetchFromApi('pad/', { limit: limit.toString(), offset: offset.toString() });
          allResults = [...allResults, ...(data.results || [])];

          if (data.next) {
             offset += limit;
          } else {
             break;
          }
        }

        setLocations(allResults);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="h-[600px] bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center animate-pulse">Loading map...</div>;
  }

  // Filter pads with valid coordinates
  const validPads = locations.filter(pad => pad.latitude && pad.longitude);

  // Further filter pads that are currently visible within map bounds
  const visiblePads = validPads.filter(pad => {
    if (!mapBounds) return true;
    const lat = parseFloat(pad.latitude);
    const lng = parseFloat(pad.longitude);
    return mapBounds.contains([lat, lng]);
  });

  const sortedPads = [...visiblePads].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Handle nested location property if needed
    if (sortField === 'location_name') {
       valA = a.location?.name || '';
       valB = b.location?.name || '';
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Column */}
          <div className="lg:w-2/3 h-[500px] rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative z-0">
            <button
                onClick={() => setResetTrigger(true)}
                className="absolute top-4 right-4 z-[400] bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-md shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors"
            >
                Reset Zoom
            </button>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                 onBoundsChange={setMapBounds}
                 resetTrigger={resetTrigger}
                 onResetComplete={() => setResetTrigger(false)}
              />

              {validPads.map((pad) => {
                const isSelected = activePad?.id === pad.id;
                return (
                  <Marker
                    key={pad.id}
                    position={[parseFloat(pad.latitude), parseFloat(pad.longitude)]}
                    icon={isSelected ? highlightIcon : new L.Icon.Default()}
                    eventHandlers={{
                      click: () => setActivePad(pad)
                    }}
                  />
                );
              })}
            </MapContainer>
          </div>

          {/* Details Card Column */}
          <div className="lg:w-1/3">
             {activePad ? (
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{activePad.name}</h3>
                     <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-lg border-b border-slate-200 dark:border-slate-700 pb-4">{activePad.location?.name}</p>

                     <div className="space-y-4 flex-grow">
                         <div className="flex justify-between items-center">
                             <span className="text-slate-500 dark:text-slate-400 font-medium">Total Launches</span>
                             <span className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">{activePad.total_launch_count}</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-slate-500 dark:text-slate-400 font-medium">Coordinates</span>
                             <span className="text-slate-900 dark:text-white font-mono text-sm">{parseFloat(activePad.latitude).toFixed(4)}, {parseFloat(activePad.longitude).toFixed(4)}</span>
                         </div>
                         {activePad.wiki_url && (
                             <div className="pt-2">
                                <a href={activePad.wiki_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">Read on Wikipedia</a>
                             </div>
                         )}
                     </div>

                     <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                         <Link
                            href={`/pad/${activePad.id}`}
                            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold rounded-lg transition-colors"
                         >
                            View Launches from this Pad
                         </Link>
                     </div>
                 </div>
             ) : (
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 h-full flex flex-col items-center justify-center text-center">
                     <p className="text-slate-500 dark:text-slate-400 text-lg">Select a pad from the map or list to view details.</p>
                 </div>
             )}
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
           <h3 className="font-bold text-slate-900 dark:text-white">Visible Launch Pads ({sortedPads.length})</h3>
           <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
              <select
                 className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                 value={`${sortField}-${sortOrder}`}
                 onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortField(field);
                    setSortOrder(order);
                 }}
              >
                 <option value="total_launch_count-desc">Launches (High to Low)</option>
                 <option value="total_launch_count-asc">Launches (Low to High)</option>
                 <option value="name-asc">Pad Name (A-Z)</option>
                 <option value="location_name-asc">Location Name (A-Z)</option>
              </select>
           </div>
        </div>

        {sortedPads.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No pads found in this area. Zoom out or pan the map.
            </div>
        ) : (
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {sortedPads.map(pad => (
                  <div
                     key={pad.id}
                     className={`p-4 transition-colors cursor-pointer border-b border-r border-slate-100 dark:border-slate-700/50 ${activePad?.id === pad.id ? 'bg-blue-50 dark:bg-slate-700/80 ring-inset ring-2 ring-blue-500' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                     onClick={() => setActivePad(pad)}
                  >
                     <div className="flex justify-between items-start gap-4">
                         <div>
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 line-clamp-1" title={pad.name}>
                               {pad.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1" title={pad.location?.name}>{pad.location?.name}</p>
                         </div>
                         <div className="flex-shrink-0 text-right">
                            <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium border border-slate-200 dark:border-slate-600">
                               {pad.total_launch_count}
                            </span>
                         </div>
                     </div>
                  </div>
               ))}
            </div>
        )}
      </div>
    </div>
  );
}
