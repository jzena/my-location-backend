import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { useEffect } from 'react'
import { registerServiceWorker } from '@/utils/register-sw'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    registerServiceWorker()
  }, [])
  
  return (
    <>
      <Component {...pageProps} /> 
    </>
  )
}