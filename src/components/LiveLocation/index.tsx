import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import useUserLocation from '@/hooks/useUserLocation';
import ShareLocationModal from './ShareLocationModal';
import { useAsync } from '@/hooks/useAsync';
import { DURATIONS } from '@/consts';

const DinamicMap = dynamic(() => import('../Map'), {
  ssr: false,
});

const LiveLocation = () => {
  const { userLocation } = useUserLocation();
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState(DURATIONS.FIFTEEN_MINUTES)
  const [endTime, setEndTime] = useState<any>(null)
  const [uniqueID, setUniqueID] = useState('')
  const [sharing, setSharing] = useState(false)
  const path = `/api/location`

  const { run: runPostMyCoordinates } = useAsync()
  const { run: runUpdateMyCoordinates } = useAsync()

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() >= endTime) {
        setSharing(false)
      }
    }, 1000)
    
    return () => {
      clearInterval(interval)
    }
  }, [endTime, Date])
  
  useEffect(() => {
    const interval = setInterval(() => {
      if ( sharing ) {
        const updateCoords = axios.put(path, {
          latitude: userLocation?.[0],
          longitude: userLocation?.[1],
          sharing: true,
          endTime: endTime,
          id: uniqueID
        })
        runUpdateMyCoordinates(updateCoords)

      } else {
        axios.delete(`/api/location?uniqueID=${uniqueID}`)
        setUniqueID('')
        setEndTime(null)
        setSharing(false)
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [userLocation, sharing, uniqueID])  
  
  const handleOnShareModalClick = () => {
    setOpen(true)
  }

  const handleOnClose = () => {
    setOpen(false)
    setDuration(DURATIONS.ONE_HOUR)
  }
  const handleChangeDuration = (duration: number) => {
    setDuration(duration)
  }

  // post coordinates
  const handleShareClick = () => {
    const id = uuidv4();
    const endTime = Date.now() + duration
    try {
      const postCoords = axios.post(path, {
        latitude: userLocation?.[0],
        longitude: userLocation?.[1],
        sharing: true,
        endTime: endTime,
        id
      })
      runPostMyCoordinates(postCoords, {
        onSuccess: (response) => {
          const data = response.data.data
          if ( data.id && data.endTime && data.sharing ) {
            setUniqueID(data.id)
            setEndTime(data.endTime)
            setSharing(data.sharing)
            setOpen(false)

            // const appUrl = `http://localhost:3000/track-location?uniqueID=${id}`  //appUrl to test locally
            const text = 'track my location in real time ->'
            const appUrl = `https://my-location.vercel.app/track-location?uniqueID=${id}`
            const encodedText = encodeURIComponent(text + ' ' + appUrl)
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`
            window.open(whatsappUrl)

          } else {
            setUniqueID('')
            setEndTime(null)
            setSharing(false)
            setOpen(false)
          }
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleStopSharingClick = async() => {
    setSharing(false)
  }

  const date = (time: any) => new Date(time)
  const hours = date(endTime).getHours() < 10 ? `0${date(endTime).getHours()}` : date(endTime).getHours()
  const minutes = date(endTime).getMinutes() < 10 ? `0${date(endTime).getMinutes()}` : date(endTime).getMinutes()
  const shareMessage = `Sharing until: ${hours}:${minutes}`

  return (
    <>
      <div className='w-[100%] flex flex-col items-center !z-[100]'>

        <DinamicMap userLocation={userLocation} sharedCoordinates={null} />

        {userLocation !== null && sharing === false && (
          <div
            className=' rounded bg-[green] hover:bg-[green]/80 pl-3 pr-1 my-[20px] cursor-pointer h-[24px] flex items-center border shadow shadow-[green]'
            onClick={handleOnShareModalClick}
          >
            <span className='text-[14px] font-[600] text-white'>
              share your location
            </span>
            <Image src='/whatsapp-logo.png' alt='whatsapp-logo' width={30} height={24} />
          </div>
        )}
        
        {userLocation !== null && sharing === true &&(
          <div className='flex flex-col'>
            <div
              className=' rounded bg-[red] hover:bg-[red]/80 pl-3 pr-1 my-[20px] cursor-pointer h-[24px] flex items-center border shadow shadow-[red]'
              onClick={handleStopSharingClick}
            >
              <span className='text-[14px] font-[600] text-white'>
                stop sharing location
              </span>
            </div>

            <div className='font-[300] text-[14px] mx-auto'>{endTime && shareMessage}</div>
          </div>
        )}

      </div>

      {open && (
        <ShareLocationModal
          open={open}
          handleOnClose={handleOnClose}
          handleChangeDuration={handleChangeDuration}
          onShareClick={handleShareClick}
          duration={duration}
        />
      )}
    </>
  )
}

export default LiveLocation