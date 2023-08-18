import React from 'react'
import axios from 'axios'

const developerPage = () => {
  const handleDeleteLocations = () => {
    const path = `/api/location`
    axios.delete(path)
  }
  return (
    <>
      <div
        className='rounded mt-[40px] mx-auto bg-[red] border text-white shadow shadow-[red] px-2 w-fit cursor-pointer'
        onClick={handleDeleteLocations}
      >
        delete locations
      </div>
    </>
  )
}

export default developerPage  