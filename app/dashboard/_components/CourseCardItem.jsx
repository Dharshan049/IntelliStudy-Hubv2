import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function CourseCardItem({ course }) {
  return (
    <div className="border rounded-lg shadow-md p-5">
      <div className="flex flex-col h-full">
        {/* Top Section */}
        <div className="flex justify-between items-center">
          <Image src="/knowledge.png" alt="other" width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-black text-white">
            20 dec
          </h2>
        </div>

        {/* Title and Summary Section */}
        <div className="flex-grow mt-3">
          <h2 className="font-medium text-lg">{course?.courseLayout?.courseTitle}</h2>
          <p className="text-sm line-clamp-2 text-gray-500 mt-2">
            {course?.courseLayout?.courseSummary}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <Progress value={0} />
        </div>

        {/* Button Section */}
        <div className="mt-3 flex justify-end">
          {course?.status === "Generating" ? (
            <h2 className="text-sm p-1 px-2 flex gap-2 items-center rounded-full bg-gray-400 text-white">
              <RefreshCw className="h-5 w-5 animate-spin"  />
              Generating...
            </h2>
          ) : (
            <Link href={`/course/${course?.courseId}`}><Button className=" bg-white text-black hover:bg-gray-100">View</Button></Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
