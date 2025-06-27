import React from 'react';
import Link from 'next/link';
import { ReadableDateString, getLongStatusName } from '@/lib/api'; // Assuming these are in lib/api.js or similar

const LaunchCard = ({ launch }) => {
  if (!launch) {
    return null; // Or some placeholder/error
  }

  // Default to slug if launch_library_id is not present, common in older data or different endpoints
  const launchId = launch.launch_library_id || launch.id || launch.slug;

  return (
    <div className="col s12 m6 l4 xl3"> {/* Adjusted grid size for potentially more cards */}
      <div className="card hoverable" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column' }}>
        {/* Card Image - Placeholder for now, can be added if relevant images are consistently available */}
        {/* <div className="card-image">
          <img src={launch.image || launch.rocket?.configuration?.image_url || '/assets/rocket_placeholder.jpg'} alt={launch.name} style={{ maxHeight: '150px', objectFit: 'cover' }}/>
        </div> */}
        <div className="card-content" style={{ flexGrow: 1 }}>
          <span className="card-title activator grey-text text-darken-4" style={{ fontSize: '1.2rem', lineHeight: '1.3', marginBottom: '10px' }}>
            {launch.name?.substring(0, 60)}{launch.name?.length > 60 ? '...' : ''}
            {/* <i className="material-icons right">more_vert</i> */} {/* For card reveal if used */}
          </span>

          {launch.launch_service_provider && (
            <p style={{ marginBottom: '5px' }}>
              <img
                src={launch.launch_service_provider.logo_url || '/assets/unknown.png'}
                alt={launch.launch_service_provider.name}
                style={{ width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle' }}
                onError={(e) => { e.target.onerror = null; e.target.src='/assets/unknown.png'; }}
              />
              <small>{launch.launch_service_provider.name}</small>
            </p>
          )}

          {launch.pad?.location && (
            <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
              <i className="fas fa-map-marker-alt tiny" style={{ marginRight: '5px' }}></i>
              {launch.pad.location.name.split(',')[0]}
            </p>
          )}

          <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
            <i className="far fa-clock tiny" style={{ marginRight: '5px' }}></i>
            {ReadableDateString(launch.net)}
          </p>

          <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
            Status: {getLongStatusName(launch.status?.id)}
          </p>
        </div>
        <div className="card-action">
          <Link href={`/launch/${launchId}`} legacyBehavior>
            <a className="waves-effect waves-light btn-small">Details</a>
          </Link>
          {/* Add other actions like Countdown later */}
          {/* <Link href={`/countdown/${launchId}`} legacyBehavior>
            <a className="waves-effect waves-light btn-small">Countdown</a>
          </Link> */}
        </div>
        {/* Card Reveal Section (optional) */}
        {/* <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{launch.name}<i className="material-icons right">close</i></span>
          <p>{launch.mission?.description || 'No mission description available.'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default LaunchCard;
