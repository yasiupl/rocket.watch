"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component to handle programmatic popup opening
function MapController({ activePadId, pads }: { activePadId: string | null, pads: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (activePadId) {
      const pad = pads.find(p => p.id.toString() === activePadId);
      if (pad && pad.latitude && pad.longitude) {
        map.flyTo([parseFloat(pad.latitude), parseFloat(pad.longitude)], 5, { animate: true, duration: 1.5 });
      }
    }
  }, [activePadId, pads, map]);

  return null;
}

export default function LocationsMap() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePadId, setActivePadId] = useState<string | null>(null);
  const [sortField, setSortField] = useState('total_launch_count');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    async function loadData() {
      try {
        let allResults: any[] = [];
        let limit = 100;
        let offset = 0;

        while (true) {
          // Changed to fetch via internal lambda api instead of ll.thespacedevs.com
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

  // Filter pads with valid coordinates and sort them
  const validPads = locations.filter(pad => pad.latitude && pad.longitude);

  const sortedPads = [...validPads].sort((a, b) => {
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
      <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative z-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController activePadId={activePadId} pads={validPads} />

          {validPads.map((pad) => {
            const isHovered = activePadId === pad.id.toString();
            return (
              <Marker
                key={pad.id}
                position={[parseFloat(pad.latitude), parseFloat(pad.longitude)]}
                icon={isHovered ? highlightIcon : new L.Icon.Default()}
                eventHandlers={{
                  mouseover: () => setActivePadId(pad.id.toString()),
                  mouseout: () => setActivePadId(null)
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold mb-1">{pad.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{pad.location?.name}</p>
                    <p className="text-xs text-gray-500 mb-2">Total Launches: {pad.total_launch_count}</p>
                    <Link href={`/pad/${pad.id}`} className="text-blue-500 hover:underline text-sm font-medium">
                      View Pad Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
           <h3 className="font-bold text-slate-900 dark:text-white">Launch Pads ({validPads.length})</h3>
           <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-500">Sort by:</span>
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
        <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
           {sortedPads.map(pad => (
              <div
                 key={pad.id}
                 className={`p-4 transition-colors cursor-pointer flex justify-between items-center ${activePadId === pad.id.toString() ? 'bg-blue-50 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                 onMouseEnter={() => setActivePadId(pad.id.toString())}
                 onMouseLeave={() => setActivePadId(null)}
              >
                 <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">
                       <Link href={`/pad/${pad.id}`} className="hover:underline">{pad.name}</Link>
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{pad.location?.name}</p>
                 </div>
                 <div className="text-right">
                    <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium">
                       {pad.total_launch_count} launches
                    </span>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
