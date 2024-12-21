"use client"

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import FlashcardItem from './_components/FlashcardItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


function Flashcard() {

  const {courseId} = useParams();
  const [flashCards, setFlashCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState();
  const [api, setApi] = useState();

  useEffect(()=>{
    GetFlashCards();
  },[])

  useEffect(()=>{
    if(!api){
      return ;
    }

    api.on('select',()=>{
      setIsFlipped(false);
    })

  },[api])

  const GetFlashCards= async()=>{
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'Flashcard'
    })

    setFlashCards(result?.data);
    console.log('flashcards',result.data);
  }

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      <h2 className='font-bold text-2xl'>Flashcards</h2>
      <p>Flashcards are a great way to test your knowledge. They are short, simple questions that test your understanding of a concept. They are also a great way to review material and reinforce what you have learned.</p>

      <div>
      <Carousel setApi={setApi}>
      <CarouselContent>
  {flashCards?.content &&
    flashCards.content.map((flashcard, index) => (
      <CarouselItem key={index} className="flex items-center justify-center mt-10">
        <FlashcardItem
          handleClick={handleClick}
          isFlipped={isFlipped}
          flashcard={flashcard}
        />
      </CarouselItem>
    ))}
</CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

       
      </div>
      
    </div>
  ) 
}

export default Flashcard