import { useState, useEffect } from 'react';

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userAltitude, setUserAltitude] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      setErrorMsg("Geolocation is not supported by your browser.")
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setUserAltitude(altitude)
      },
      (error) => {
        console.error("Unable to retrieve your location.", error);
        setErrorMsg("Unable to retrieve your location.")
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return { userLocation, userAltitude, errorMsg };
};

export default useUserLocation;
