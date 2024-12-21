import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

const MaterialCardItem = ({ item, studyTypeContent, course, refreshData }) => {
  const [loading, setLoading] = useState(false);

  // Helper function to check if content exists
  const hasContent = () => {
    if (item.type === 'notes') {
      return studyTypeContent?.notes?.length > 0;
    }
    return studyTypeContent?.[item.type] !== null && studyTypeContent?.[item.type] !== undefined;
  };

  const GenerateContent = async (e) => {
    try {
      e.preventDefault(); // Prevent the link navigation
      e.stopPropagation(); // Prevent event bubbling
      
      console.log('course:', course);
      toast.loading('Generating...');
      setLoading(true);
      
      let chapters = '';
      course?.courseLayout.chapters.forEach(chapter => {
        chapters = (chapter.chapterTitle || chapter.chapter_title) + ',' + chapters;
      });
      
      const result = await axios.post('/api/study-type-content', {
        courseId: course?.courseId,
        type: item.name,
        chapters: chapters.slice(0, -1),
      });
      
      console.log('result', result);
      await refreshData();
      toast.success('Generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={'/course/' + course?.courseId + item.path}>
      <div
        className={`border shadow-md rounded-lg p-5 flex flex-col items-center h-full ${
          !hasContent() && 'grayscale'
        }`}
      >
        {!hasContent() ? (
          <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">
            Generate
          </h2>
        ) : (
          <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
            Ready
          </h2>
        )}

        <Image src={item.icon} alt={item.name} width={50} height={50} />
        <h2 className="font-medium mt-3">{item.name}</h2>
        <p className="text-gray-500 text-sm text-center">{item.desc}</p>
        <div className="flex-grow" />

        <div className="flex w-full gap-2">
          {!hasContent() ? (
            <Button 
              className="mt-3 w-full" 
              variant="outline" 
              onClick={GenerateContent}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          ) : (
            <Button className="mt-3 w-full" variant="outline">
              View
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MaterialCardItem;