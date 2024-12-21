'use client'  // This directive marks the component as a client-side component

import { UserButton } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

function DashboardHeader() {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    // Add the animation class when the component is mounted
    setAnimationClass('animate-fadeIn')
  }, [])

  const headerStyles = {
    fontSize: '1.25rem',  // Smaller text size
    fontWeight: '700',
    color: 'black',  // Black text color
    textTransform: 'uppercase',
    letterSpacing: '2px',
    animation: 'fadeIn 2s ease-out',
  }

  // Keyframes definition for fadeIn animation
  const fadeInKeyframes = `
    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  return (
    <>
      <style>{fadeInKeyframes}</style>  {/* Inject keyframes into the page */}
      <div className='p-5 shadow-md flex justify-between items-center'>
        <h2 className={`flex-1 text-right ${animationClass}`} style={headerStyles}>
          Intellistudy Hub
        </h2>
        <UserButton />
      </div>
    </>
  )
}

export default DashboardHeader
