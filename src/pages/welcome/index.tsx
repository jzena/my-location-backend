import React, { useState } from 'react';
import LiveLocation from '@/components/LiveLocation';
import Position from '@/components/Position';

const POSITION_VIEW = 'position'
const LIVE_LOCATION_VIEW = 'live-location'

const WelcomePage: React.FC = () => {
  const [view, setView] = useState(POSITION_VIEW)

  // handlers
  const handlePositionClick = () => {
    setView(POSITION_VIEW)
  }
  const handleLiveLocationClick = () => {
    setView(LIVE_LOCATION_VIEW)
  }

  return (
    <div className='w-[100%] h-screen'>
      <div className='w-[100%] flex justify-center text-[24px] font-[600] font-mono pt-[10px]'>My location</div>
      <div className='w-[100%] flex justify-center space-x-2 mt-[40px]'>
        <div
          className={`px-3 border rounded text-[14px] text-white cursor-pointer hover:bg-[purple]/80
          ${view === POSITION_VIEW ? 'bg-[purple] shadow shadow-[purple]' : 'bg-[#5F005F]'} `}
          onClick={handlePositionClick}
        >
          Position
        </div>
        <div
          className={`px-3 border rounded text-[14px] text-white cursor-pointer hover:bg-[purple]/80
          ${view === LIVE_LOCATION_VIEW ? 'bg-[purple] shadow shadow-[purple]' : 'bg-[#5F005F]'} `}
          onClick={handleLiveLocationClick}
        >
          Live Location
        </div>
      </div>

      <div className='w-[92%] lg:w-[40%] mx-auto border rounded border-gray-100 flex justify-center mt-[20px] p-2 shadow shadow-lg'>
        {
          view === POSITION_VIEW ? 
          ( <Position /> ) :
          ( <LiveLocation /> )
        }
      </div>
    </div>
  )
};

export default WelcomePage;
