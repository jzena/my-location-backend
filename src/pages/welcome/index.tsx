import React from 'react';
import Position from '@/components/Position';
import { useRouter } from 'next/router';

const WelcomePage: React.FC = () => {
  const router = useRouter()
  const id = router.query.uniqueID

  // handlers
  const handlePositionClick = () => {
    // router.push('/')
  }
  const handleLiveLocationClick = () => {
    if (id) {
      router.push(`/live-location?uniqueID=${id}`)
    } else {
      router.push('/live-location')
    }
  }

  return (
    <div className='w-[100%] h-screen'>
      <div className='w-[100%] flex justify-center text-[24px] font-[600] font-mono pt-[10px]'>My location</div>
      <div className='w-[100%] flex justify-center space-x-2 mt-[10px]'>
        <div
          className={`px-3 border rounded text-[14px] text-white cursor-pointer hover:bg-[purple]/80
          ${router.pathname === '/' ? 'bg-[purple] shadow shadow-[purple]' : 'bg-[#5F005F]'} `}
          onClick={handlePositionClick}
        >
          Position
        </div>
        <div
          className={`px-3 border rounded text-[14px] text-white cursor-pointer hover:bg-[purple]/80
          ${router.pathname === '/live-location' ? 'bg-[purple] shadow shadow-[purple]' : 'bg-[#5F005F]'} `}
          onClick={handleLiveLocationClick}
        >
          Live Location
        </div>
      </div>

      <div className='w-[92%] lg:w-[40%] mx-auto border rounded border-gray-100 flex justify-center mt-[20px] p-2 shadow shadow-lg'>
        <Position />
      </div>
    </div>
  )
};

export default WelcomePage;
