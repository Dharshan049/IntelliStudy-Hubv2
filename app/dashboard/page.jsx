import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import Chatbot from './_components/Chatbot'

function Dashboard() {
  return (
    <div>
        <WelcomeBanner/>
        <CourseList/>
        <Chatbot /> {/* Add the Chatbot component here */}
    </div>
  )
}

export default Dashboard