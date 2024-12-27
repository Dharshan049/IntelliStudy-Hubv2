import React, { useEffect, useState } from 'react';
import MaterialCardItem from './MaterialCardItem';
import axios from 'axios';

function StudyMaterialSection({ courseId, course }) {

    const [studyTypeContent, setStudyTypeContent] = useState();

    const MaterialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read notes',
            icon: '/notes.png',
            path: '/notes',
            type: 'notes'
        },
        {
            name: 'Flashcard',
            desc: 'Flashcard help to remember the concepts',
            icon: '/flashcard.png',
            path: '/flashcard',
            type: 'flashcard'
        },
        {
            name: 'Quiz',
            desc: 'Great way to test your knowledge',
            icon: '/quiz.png',
            path: '/quiz',
            type: 'quiz'
        } 
    ];

    useEffect(() => {
        GetStudyMaterial();
    }, []);

    const GetStudyMaterial = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'ALL'
        });
        console.log(result?.data);
        setStudyTypeContent(result.data);
    };

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-xl'>Study Material</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3 justify-items-center'>
                {MaterialList.map((item, index) => (      
                    <div key={index} className="w-full h-[250px]">
                        <MaterialCardItem  
                            item={item} 
                            studyTypeContent={studyTypeContent}
                            course={course}
                            refreshData={GetStudyMaterial}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudyMaterialSection;
