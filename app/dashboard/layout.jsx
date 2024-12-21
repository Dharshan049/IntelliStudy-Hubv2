"use client"
import React, { useState } from 'react'
import SideBar from './_components/SideBar'
import DashBoardHeader from './_components/DashBoardHeader'
import { CourseCountContext } from '../_context/CourseCountContext'

function DashboardLayout({children}) {

  const [totalCourses,setTotalCourses] = useState(0);

  return (
    <CourseCountContext.Provider value={{totalCourses,setTotalCourses}}>
    <div>
        <div className='md:w-64 hidden md:block fixed'>
            <SideBar/>
        </div>
        <div className='md:ml-64'>
            <DashBoardHeader/>
            <div className='p-10'>
                {children}
            </div>
        </div>
    </div>
    </CourseCountContext.Provider>
  )
}

export default DashboardLayout