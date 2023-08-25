import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import useUserLocation from '@/hooks/useUserLocation';
import ShareLocationModal from './ShareLocationModal';
import { useAsync } from '@/hooks/useAsync';
import { DURATIONS } from '@/consts';
import { useRouter } from 'next/router';

const DinamicMap = dynamic(() => import('../Map'), {
  ssr: false,
});

const fetcher = (path: string) => axios.get(path)
const LiveLocation = () => {
  const { userLocation } = useUserLocation();
  const [open, setOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [duration, setDuration] = useState(DURATIONS.FIFTEEN_MINUTES)

  const router = useRouter()
  const uniqueIDStr = router.query.uniqueID as string
  const endTimeStr = router.query.endTime as string
  const endTimeParsed = parseInt(endTimeStr, 10)
  const locationPath = `/api/location`

  const { run: runGetMyCoordinates } = useAsync()
  const { run: runPostMyCoordinates } = useAsync()
  const { run: runUpdateMyCoordinates } = useAsync()

  const postCoordinates = useCallback((
    userLocation: number[] | null,
    endTime: any,
    id: string | string[],
    resend: boolean
  ) => {
    const postCoords = axios.post(locationPath, {
      latitude: userLocation?.[0],
      longitude: userLocation?.[1],
      endTime: endTime,
      id
    })
    runPostMyCoordinates(postCoords, {
      onSuccess: (response) => {
        const data = response.data.data
        if ( resend === false ) {
          setOpen(false)
          setSharing(true)

          // const appUrl = `http://localhost:3000/track-location?uniqueID=${data.id}&endTime=${data.endTime}`  //appUrl to test locally
          const appUrl = `https://my-location.vercel.app/track-location?uniqueID=${data.id}&endTime=${data.endTime}`   //stg
          const text = 'track my location in real time ->'
          const encodedText = encodeURIComponent(text + ' ' + appUrl)
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`
          window.open(whatsappUrl)
          router.push(`/live-location?uniqueID=${data.id}&endTime=${data.endTime}`)

        } else if (resend === true) {
          setOpen(false)
          setSharing(true)
          router.push(`/live-location?uniqueID=${data.id}&endTime=${data.endTime}`)
        }
      }
    })
  },[userLocation])

  const updateCoordinates = useCallback((
    userLocation: number[] | null,
    endTime: any,
    id: string | string[],
  ) => {
    const updateCoords = axios.put(locationPath, {
      latitude: userLocation?.[0],
      longitude: userLocation?.[1],
      endTime: endTime,
      id: id
    })
    runUpdateMyCoordinates(updateCoords)

    if (Date.now() < endTime ) {
      setSharing(true)
    } else {
      setSharing(false)
    }
  }, [userLocation])
  
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if ( endTimeStr ) {
          runGetMyCoordinates(fetcher(`${locationPath}?uniqueID=${uniqueIDStr}`), {
            onSuccess: (response) => {
              const data = response.data
              const now = Date.now()
              if ( data.endTime && now < data.endTime ) {
                updateCoordinates(
                  userLocation,
                  endTimeParsed,
                  uniqueIDStr
                )
              } else if ( data.endTime && now >= data.endTime ) {
                updateCoordinates(
                  userLocation,
                  Date.now(),
                  uniqueIDStr
                )
                router.push('/live-location')
              } else if ( !data.endTime && now < endTimeParsed ) {
                postCoordinates(
                  userLocation,
                  endTimeParsed,
                  uniqueIDStr,
                  true
                )
              } else if ( !data.endTime && now >= endTimeParsed ) {
                updateCoordinates(
                  userLocation,
                  Date.now(),
                  uniqueIDStr
                )
                router.push('/live-location')
              }
            }
          })
        } else {
          return;
        }
      } catch (error) {
        console.log('error-post-put-coords:', error);
        if (Date.now() < endTimeParsed) {
          const postData = {
            latitude: userLocation?.[0],
            longitude: userLocation?.[1],
            endTime: endTimeParsed,
            id: uniqueIDStr
          }
          navigator.serviceWorker.controller?.postMessage(postData);
          navigator.serviceWorker.ready.then((registration: any) => {
            registration.sync.register('sync-data-post');
          });
        }
      }
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [ userLocation ])  
  
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
      postCoordinates(
        userLocation,
        endTime,
        id,
        false
      )
    } catch (error) {
      console.log(error);
    }
  }

  const handleStopSharingClick = async() => {
    updateCoordinates(
      userLocation,
      Date.now(),
      uniqueIDStr
    )
    router.push('/live-location')
  }

  const date = (time: any) => new Date(time)
  const endTimeStrToNumber = parseInt(endTimeStr, 10)

  const hours = date(endTimeStrToNumber).getHours() < 10 ?
                `0${date(endTimeStrToNumber).getHours()}` :
                date(endTimeStrToNumber).getHours()
  const minutes = date(endTimeStrToNumber).getMinutes() < 10 ?
                  `0${date(endTimeStrToNumber).getMinutes()}` :
                  date(endTimeStrToNumber).getMinutes()
  const shareMessage = `Sharing until: ${hours}:${minutes}`

  return (
    <>
      <div className='w-[100%] flex flex-col items-center !z-[100]'>

        <DinamicMap userLocation={userLocation} sharedCoordinates={null} />

        {userLocation !== null && !sharing && (
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
        
        {userLocation !== null && sharing &&(
          <div className='flex flex-col'>
            <div
              className=' rounded bg-[red] hover:bg-[red]/80 pl-3 pr-1 my-[20px] cursor-pointer h-[24px] flex items-center border shadow shadow-[red]'
              onClick={handleStopSharingClick}
            >
              <span className='text-[14px] font-[600] text-white'>
                stop sharing location
              </span>
            </div>

            <div className='font-[300] text-[14px] mx-auto'>{endTimeStr && shareMessage}</div>
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