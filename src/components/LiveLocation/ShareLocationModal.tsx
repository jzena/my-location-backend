import { DURATIONS } from '@/consts'
import Image from 'next/image'
import React from 'react'
import { Modal } from '../Modal'

interface IShareLocationModal {
  handleOnClose: () => void
  open: boolean
  duration: number
  handleChangeDuration: (duration: number) => void
  onShareClick: () => void
}

const ShareLocationModal = (props: IShareLocationModal) => {
  const { duration, handleChangeDuration } = props
  return (
    <Modal open={props.open} onClose={props.handleOnClose} title='Duration:'>
      <div className='flex space-x-1.5 w-fit mx-auto items-center text-[14px]'>
        <div
          className={`${duration === DURATIONS.FIFTEEN_MINUTES && '!bg-[green] text-white hover:!bg-[green]/80 !h-[25px]'} bg-gray-100
          hover:bg-gray-200 rounded px-2 text-[14px] font-[300] cursor-pointer w-[85px] flex justify-center items-center h-[20px]`}
          onClick={() => handleChangeDuration(DURATIONS.FIFTEEN_MINUTES)}
        >
          15 minutes
        </div>
        <div
          className={`${duration === DURATIONS.ONE_HOUR && '!bg-[green] text-white hover:!bg-[green]/80 !h-[25px]'} bg-gray-100
          hover:bg-gray-200 rounded px-2 text-[14px] font-[300] cursor-pointer w-[85px] flex justify-center items-center h-[20px]`}
          onClick={() => handleChangeDuration(DURATIONS.ONE_HOUR)}
        >
          1 hour
        </div>
        <div
          className={`${duration === DURATIONS.EIGHT_HOURS && '!bg-[green] text-white hover:!bg-[green]/80 !h-[25px]'} bg-gray-100
          hover:bg-gray-200 rounded px-2 text-[14px] font-[300] cursor-pointer w-[85px] flex justify-center items-center h-[20px]`}
          onClick={() => handleChangeDuration(DURATIONS.EIGHT_HOURS)}
        >
          8 hours
        </div>
      </div>

      <div className='w-[100%] flex justify-center'>
        <a
          className='mx-auto w-fit mt-[20px] rounded bg-[green] cursor-pointer text-white px-2 text-[14px] font-[600] mb-[20px]
          mt-[40px] border shadow shadow-[green] hover:bg-[green]/80 flex space-x-1 items-center'
          onClick={props.onShareClick}
        >
          <span>share</span>
          <div className='w-[12px] h-[12px] !bg-transparent'>
            <Image src='/share-icon.png' alt='share-icon' width={12} height={12} className='!bg-transparent'/>
          </div>
        </a>
      </div>
    </Modal>
  )
}

export default ShareLocationModal