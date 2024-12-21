"use client"

import { CourseCountContext } from '@/app/_context/CourseCountContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LayoutDashboard, Menu, Shield, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import Image from 'next/image'

function SideBar() {
    const MenuList = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Upgrade',
            path: '/dashboard/upgrade',
            icon: Shield
        },
    ]
    const { totalCourses, setTotalCourses } = useContext(CourseCountContext);
    const path = usePathname();
  return (
    <div className='h-screen shadow-md p-5 bg-white text-black'>
        <div className='flex gap-2 items-center'>
            <Image src={'/logo.png'} alt='logo' width={50} height={50} />
            <h2 className='font-bold text-2xl'>Intellistudy Hub</h2>
        </div>

        <div className='mt-10'>
            <Link href={'/create'} className='w-full'>
                <Button className='w-full bg-white text-black hover:bg-black hover:text-white'>Create New</Button>
            </Link>

            <div className='mt-5'>
                {MenuList.map((menu, index) => (
                    <Link href={menu.path} key={index}>
                    <div key={index} className={`flex gap-5 items-center p-3 hover:bg-gray-100 hover:text-black rounded-md mt-3 ${path == menu.path && 'bg-gray-200'}`}>
                        <menu.icon/>
                        <h2>{menu.name}</h2>
                    </div>
                    </Link>
                ))}
            </div>
        </div> 
        <div className='border p-3 bg-white text-black rounded-md absolute bottom-10 w-[85%]'>
           <h2 className='text-lg mb-2'>Available Credits : {5-totalCourses}</h2>
           <Progress value={(totalCourses/5)*100} className='h-2 '/>
           <h2 className='text-sm'>{totalCourses} out of 5 Credits Used</h2> 
           <Link href={'dashboard/upgrade'} className='text-black text-xs mt-3'>Upgrade to unlock more credits</Link>
        </div>
    </div>
  )
}

export default SideBar
