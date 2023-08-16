import React from 'react';
import TrackLocation from '@/components/TrackLocation';

const TrackLocationPage: React.FC = () => {

  return (
    <div className='w-[100%] h-screen'>
      <div className='w-[100%] flex justify-center text-[24px] font-[600] font-mono pt-[10px]'>My location</div>
      <div className='w-[100%] flex justify-center space-x-2 mt-[40px]'>
        <div
          className='px-3 border rounded text-[14px] text-white cursor-pointer hover:bg-[purple]/80 bg-[purple] shadow shadow-[purple]'
          // onClick={handleLiveLocationClick}
        >
          Track Location
        </div>
      </div>

      <div className='w-[92%] lg:w-[40%] mx-auto border rounded border-gray-100 flex justify-center mt-[20px] p-2 shadow shadow-lg'>
        <TrackLocation />
      </div>
    </div>
  )
};

export default TrackLocationPage;
