import useUserLocation from '@/hooks/useUserLocation';
import { useEffect, useState } from 'react'
import CircularProgress from '../CircularProgress';

const FEET = 'feet'
const METERS = 'meters'

const Position = () => {
  const [unit, setUnit] = useState(FEET)
  const { userAltitude, userLocation, errorMsg } = useUserLocation()
  const [coordinates, setCoordinates] = useState<any>()
  const [altitude, setAltitude] = useState<any>()

  useEffect(() => {
    if (userLocation) { setCoordinates(userLocation) }
  }, [userLocation])

  useEffect(() => {
    if (userAltitude) { setAltitude(userAltitude) }
  }, [userAltitude])
  

  const getAltitude = () => {
    const altitudeInMeters = altitude || 0
    const altitudeInFeet = altitude || 0 * 3.28084
    return (
      (altitude && unit === FEET) ? `${altitudeInMeters.toFixed(2)} m` :
      (altitude && unit === METERS) ? `${altitudeInFeet.toFixed(2)} ft` :
      'Not available in your device'
    )
  }

  // handlers
  const handleUnitClick = () => {
    if (unit === METERS) {
      setUnit(FEET)
    } else if (unit === FEET) {
      setUnit(METERS)
    }
  }
  
  return (
    <div className='w-full my-[10px] px-[5px] flex justify-center'>
      {errorMsg ? (
        <div className='font-[300]'>Error: {errorMsg}</div>
      ) : coordinates ? (
        <div className='w-full flex flex-col space-y-3'>
          <div className='w-[95%] mx-auto flex space-x-2 md:justify-center'>
            <span className='w-[70px] min-w-[70px] font-bold text-[13px]'>
              Latitude:
            </span>
            <span className='flex grow md:grow-0 md:!w-[250px] text-[13px] font-[300] border rounded px-2'>
              {coordinates?.[0] || 'No available'}
            </span>
          </div>

          <div className='w-[95%] mx-auto flex space-x-2 md:justify-center'>
            <span className='w-[70px] min-w-[70px] font-bold text-[13px]'>
              Longitude:
            </span>
            <span className='flex grow md:grow-0 md:!w-[250px] text-[13px] font-[300] border rounded px-2'>
              {coordinates?.[1]}
            </span>
          </div>

          <div className='w-[95%] mx-auto flex space-x-2 justify-start md:justify-center'>
            <span className='w-[70px] min-w-[70px] font-bold text-[13px]'>
              Altitude:
            </span>
            <span className={`${altitude ? 'grow md:grow-0 md:w-[198px]' : 'grow md:grow-0 md:w-[250px]'} flex text-[13px] font-[300] border rounded px-2`}>
              {getAltitude()}
            </span>
            {altitude && (
              <button
                className='rounded bg-black hover:bg-black/80 text-white text-[12px] font-[400] px-1 h-[21.5px]
                tracking-tighter flex items-center w-[44px] justify-center'
                onClick={handleUnitClick}
              >
                {unit}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className='flex space-x-2 items-center'>
          <span className='font-[300]'>Getting location...</span>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default Position