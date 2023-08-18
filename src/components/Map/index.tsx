import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import CircularProgress from '../CircularProgress';
import { blueIcon, redIcon } from './icons';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  userLocation: [number, number] | null;
  sharedCoordinates: [number, number] | null
}

const Map = (props: MapProps) => {
  const { userLocation, sharedCoordinates } = props
  const [locationNotFound, setLocationNotFound] = useState(false)

  useEffect(() => {
    if (userLocation === null) {
      setLocationNotFound(false)
      setTimeout(() => {
        setLocationNotFound(true)
      }, 3000);
    } else {
      setLocationNotFound(false)
    }
  }, [userLocation])
  

  if (userLocation === null) {
    if (locationNotFound) {
      return (
        <div className='font-[300]'>
          Location not available...
        </div>
      )
    } else {
      return (
        <div className='flex space-x-2 items-center'>
          <span className='font-[300]'>Getting location...</span>
          <CircularProgress />
        </div>
      )
    }
  }

  return (
    <>
      {userLocation !== null && (
        <MapContainer center={userLocation} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={userLocation} icon={blueIcon} />

          {sharedCoordinates !== null && (
            <Marker position={sharedCoordinates} icon={redIcon} />
          )}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
