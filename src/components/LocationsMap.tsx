"use client";

import { useEffect, useState } from 'react';
import { fetchFromApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function LocationsMap() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        let allResults: any[] = [];
        let url = 'pad/?limit=100'; // Fetch pads directly as they have lat/long

        while (url) {
          // Using fetch to bypass our internal api proxy which is geared towards launches
          // For simplicity in this rewrite, we'll use a direct fetch to the external api for the map
          const res = await fetch(`https://ll.thespacedevs.com/2.0.0/${url}`);
          if (!res.ok) break;
          const data = await res.json();
          allResults = [...allResults, ...data.results];

          if (data.next) {
            url = data.next.split('2.0.0/')[1];
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

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative z-0">
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
        {locations.map((pad) => {
          if (!pad.latitude || !pad.longitude) return null;
          return (
            <Marker
              key={pad.id}
              position={[parseFloat(pad.latitude), parseFloat(pad.longitude)]}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold mb-1">{pad.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{pad.location?.name}</p>
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
  );
}
