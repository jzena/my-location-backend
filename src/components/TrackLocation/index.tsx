import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import axios from 'axios'

import useUserLocation from '@/hooks/useUserLocation';
import { useAsync } from '@/hooks/useAsync';
import { useRouter } from 'next/router';
import CircularProgress from '../CircularProgress';

const DinamicMap = dynamic(() => import('../Map'), {
  ssr: false,
});
const fetcher = (path: string) => axios.get(path);

const TrackLocation = () => {
  const { userLocation } = useUserLocation();
  const [sharedCoordinates, setSharedCoordinates] = useState<any>(null)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const id = router.query.uniqueID as string
  
  const { run: runGetSharedCoordinates } = useAsync({})

  useEffect(() => {
    const getPath = `/api/location?uniqueID=${id}`
    const intervalID = setInterval(() => {
      runGetSharedCoordinates(fetcher(getPath), {
        refetch: () => runGetSharedCoordinates(fetcher(getPath)),
        onSuccess: (response) => {
          const now = Date.now()
          const data = response.data          
          if ( now < data.endTime ) {
            setError(false)
            setErrorMsg('')
            setSharedCoordinates([
              response.data.latitude,
              response.data.longitude
            ])
          } else {
            setError(true)
            setErrorMsg('Location not found')
            setSharedCoordinates(null)
            clearInterval(intervalID);
          }
        }
      })
    }, 5000)

    return () => {
      clearInterval(intervalID);
    };
  }, [router, runGetSharedCoordinates])

  return (
    <>
      {!error && (
        <div className='w-[100%] flex flex-col items-center !z-[100]'>
          {sharedCoordinates === null && (
            <div className='mx flex space-x-2 mb-[10px] items-center'>
              <span className='font-[300]'>Getting your friend's position</span>
              <CircularProgress />
            </div>
          )}

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

          {/* {sharedCoordinates !== null && ( */}
            <DinamicMap userLocation={userLocation} sharedCoordinates={sharedCoordinates} />
          {/* )} */}

        </div>
      )}
      {error && (
        <div className='flex flex-col space-y-4'>
          <span className='font-[300] w-[100%] flex justify-center'>{errorMsg}</span>
          <button
            className='rounded bg-[black] border shadow shadow-[black] text-white text-[14px] px-2 w-fit mx-auto'
            onClick={() => router.push('/')}
          >
            Back to home
          </button>
        </div>
      )}
    </>
  )
}

export default TrackLocation