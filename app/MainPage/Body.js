"use client"
import React from 'react'
import {  Dosis} from "next/font/google";
import "../globals.css";
import NextTopLoader from 'nextjs-toploader';
import StoreHydrator from './StoreHydrator';

const dosis = Dosis({ subsets: ['latin'] })

const Body = ({children}) => {
  return (
    <body
    className={`   ${dosis.className} antialiased`}
    suppressHydrationWarning
  >
    <link rel="icon" href="/logo.png" sizes="any" />
        <NextTopLoader 
       color="#fffd00"
       initialPosition={0.08}
       crawlSpeed={200}
       height={3}
       crawl={true}
       showSpinner={false}
       easing="ease"
       speed={200}
       shadow="0 0 10px #fffd00,0 0 5px #fffd00"
       className=" z-50"
      />
    <div className=' select-none     relative scrollbar-track-black scrollbar-thin'>
    <StoreHydrator />
    {children}
    </div>
  </body>
  )
}

export default Body