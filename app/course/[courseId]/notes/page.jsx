"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewNotes() {
  const { courseId } = useParams();  // Extract courseId from URL
  const [notes, setNotes] = useState([]);  // State to store notes
  const [stepCount, setStepCount] = useState(0);  // State to track current note
  const [loading, setLoading] = useState(true);  // Loading state
  const router = useRouter();  // Next.js router for navigation

  // Fetch notes on component mount
  useEffect(() => {
    GetNotes();  // Call function to fetch notes
  }, []);

  // Function to fetch notes from the server
  const GetNotes = async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'notes',  // Send the study type as 'notes'
      });
      setNotes(result.data);  // Store fetched notes in state
      setLoading(false);  // Set loading state to false once data is fetched
    } catch (error) {
      console.error('Error fetching notes:', error);  // Log error if any
      setLoading(false);  // Set loading state to false on error
    }
  };

  // Determine current note and check if it's the last one
  const currentNote = notes[stepCount];
  const isLastStep = stepCount === notes.length - 1;  // Check if it's the last step

  // Show loading message if data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show message if there are no notes available
  if (notes.length === 0) {
    return <div>No notes available for this course.</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex gap-5 items-center mb-6'>
        {/* Show Previous button only if stepCount > 0 */}
        {stepCount !== 0 && (
          <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)}>
            Previous
          </Button>
        )}

        {/* Render progress bars for each note */}
        <div className='flex gap-2 flex-1'>
          {notes.map((item, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full ${index < stepCount ? 'bg-primary' : 'bg-gray-500'}`}
            />
          ))}
        </div>

        {/* Show Next button, but disable it at the last step */}
        <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)} disabled={isLastStep}>
          Next
        </Button>
      </div>

      {/* Main content */}
      <div className='bg-white p-4 rounded-md shadow-md'>
        {/* Show note content */}
        {currentNote && (
          <>
            <div className='mb-4'>
              <h3 className='text-xl font-semibold mb-2'>Note {stepCount + 1}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: currentNote.notes?.replace('```html', ' '),
                }}
                className='prose mb-4'  // Already applied bottom margin here
              />
            </div>

            {/* End of notes message and Go to Course Page button */}
            {isLastStep && (
              <div className='flex items-center gap-10 flex-col justify-center'>
                <h2 className='mt-5 text-lg font-semibold'>End of Notes</h2>
                <Button onClick={() => router.back()}>Go to Course Page</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewNotes;
