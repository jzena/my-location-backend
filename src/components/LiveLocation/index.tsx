import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import useUserLocation from '@/hooks/useUserLocation';
import ShareLocationModal from './ShareLocationModal';
import { useAsync } from '@/hooks/useAsync';
import { useRouter } from 'next/router';
import { DURATIONS } from '@/consts';

const DinamicMap = dynamic(() => import('../Map'), {
  ssr: false,
});
const fetcher = (path: string) => axios.get(path);
const post = (path: string, data: any) => axios.post(path, data);
const put = (path: string, data: any) => axios.put(path, data)

const LiveLocation = () => {
  const { userLocation } = useUserLocation();
  const [open, setOpen] = useState(false)
  const [sharedCoordinates, setSharedCoordinates] = useState<any>(null)
  const [duration, setDuration] = useState(DURATIONS.FIFTEEN_MINUTES)
  const [endTime, setEndTime] = useState<any>()
  const [uniqueID, setUniqueID] = useState('')
  const router = useRouter()
  const path = `/api/location`
  
  const { run: runGetSharedCoordinates } = useAsync({})
  const { run: runPostMyCoordinates } = useAsync({})
  const { run: runUpdateMyCoordinates } = useAsync({})
  
  useEffect(() => {
    if ( router.query.uniqueID ) {
      const uniqueID = router.query.uniqueID as string
      const getPath = `/api/location?uniqueID=${uniqueID}`
      setUniqueID(uniqueID)

      const intervalID = setInterval(() => {
        runGetSharedCoordinates(fetcher(getPath), {
          onSuccess: (response) => {
            if (response.data.endTime) {
              setEndTime(response?.data?.endTime)
              setSharedCoordinates(response?.data)
              if (Date.now() < response.data.endTime) {
                const data = {
                  latitude: userLocation?.[0],
                  longitude: userLocation?.[1],
                  sharing: true,
                  endTime: response.data.endTime,
                  id: uniqueID
                }
                runUpdateMyCoordinates(put(path, data))
              } else if (Date.now() >= response.data.endTime) {
                const data = {
                  latitude: userLocation?.[0],
                  longitude: userLocation?.[1],
                  sharing: false,
                  endTime: response.data.endTime,
                  id: uniqueID
                }
                runUpdateMyCoordinates(put(path, data), {
                  onSuccess: () => {
                    axios.delete(`/api/location?uniqueID=${router.query.uniqueID}`)
                    setSharedCoordinates(null)
                    router.push('/')
                  }
                })
              }
            } else {
              router.push('/')
            }
          }
        })
      }, 3000)
  
      return () => {
        clearInterval(intervalID);
      };
    }
  }, [router, userLocation])
  
  
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
    setUniqueID(id)
    setEndTime(endTime)

    const data = {
      latitude: userLocation?.[0],
      longitude: userLocation?.[1],
      sharing: true,
      endTime: endTime,
      id
    }
    runPostMyCoordinates(post(path, data))

    const text = 'track my location in real time ->'
    const appUrl = `https://my-location.vercel.app/track-location?uniqueID=${id}`
    const encodedText = encodeURIComponent(text + ' ' + appUrl)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`

    window.open(whatsappUrl)
    router.push(`?uniqueID=${id}`)
    setOpen(false)
  }

  const handleStopSharingClick = () => {
    setSharedCoordinates(null)
    const data = {
      latitude: userLocation?.[0],
      longitude: userLocation?.[1],
      sharing: false,
      endTime: endTime,
      id: uniqueID
    }
    runUpdateMyCoordinates(post(path, data), {
      onSuccess: () => {
        axios.delete(`/api/location?uniqueID=${router.query.uniqueID}`)
        setSharedCoordinates(null)
        router.push('/')
      }
    })
  }

  const date = (time: any) => new Date(time)
  const hours = date(endTime).getHours() < 10 ? `0${date(endTime).getHours()}` : date(endTime).getHours()
  const minutes = date(endTime).getMinutes() < 10 ? `0${date(endTime).getMinutes()}` : date(endTime).getMinutes()
  const shareMessage = `Sharing until: ${hours}:${minutes}`

  return (
    <>
      <div className='w-[100%] flex flex-col items-center !z-[100]'>
        {sharedCoordinates !== null && (
          <div className='flex w-[100%] space-x-4 justify-center'>
            <div className='flex space-x-1 items-center'>
              <div className='border border-1 border-[blue] w-[10px] h-[10px] bg-[blue]/70' />
              <span className='text-[12px] font-[300]'>Your position</span>
            </div>
            
            <div className='flex space-x-1 items-center'>
              <div className='border border-1 border-[red] w-[10px] h-[10px] bg-[red]/70' />
              <span className='text-[12px] font-[300]'>Your friend's position</span>
            </div>
          </div>
        )}

        <DinamicMap userLocation={userLocation} sharedCoordinates={null} />

        {userLocation !== null && router.query.uniqueID !== uniqueID && (
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
        
        {userLocation !== null && router.query.uniqueID === uniqueID &&(
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