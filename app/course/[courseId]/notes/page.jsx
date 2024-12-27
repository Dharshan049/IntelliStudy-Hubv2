'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);
  const router = useRouter();
  const [voices, setVoices] = useState([]);
  
  useEffect(() => {
    GetNotes();
    // Load voices once after component mounts
    const synth = window.speechSynthesis;
    synth.onvoiceschanged = () => {
      setVoices(synth.getVoices());
    };
  }, []);

  const GetNotes = async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'notes',
      });
      const cleanedNotes = result.data.map((note) => ({
        ...note,
        notes: note.notes.replace(/```html|```/g, ''),
      }));
      setNotes(cleanedNotes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    for (let i = 0; i < notes.length; i++) {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '700px';
      tempDiv.style.fontSize = '18px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.innerHTML = notes[i].notes;
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      document.body.removeChild(tempDiv);

      if (i > 0) pdf.addPage();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
    }
    pdf.save(`Course_${courseId}_Notes.pdf`);
  };

  const stripHtml = (htmlText) => {
    return htmlText.replace(/<\/?[^>]+(>|$)/g, '');
  };

  // Function to remove emojis from text
  const removeEmojis = (text) => {
    return text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu,
      ''
    );
  };

  const detectLanguage = (text) => {
    // Simple detection based on character sets
    if (/[\u0B80-\u0BFF]/.test(text)) {
      return 'ml-IN'; // Malayalam
    } else if (/[\u0B00-\u0B7F]/.test(text)) {
      return 'ta-IN'; // Tamil
    } else if (/[\u00C0-\u00FF\u0100-\u017F]/.test(text)) {
      return 'de-DE'; // German
    }
    return 'en-US'; // Default to English
  };

  const readText = (text) => {
    const words = stripHtml(text).split(' ').filter(word => word.trim() !== '');
    const cleanedText = removeEmojis(words.join(' ')); // Remove emojis from text for speech

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    const detectedLanguage = detectLanguage(cleanedText);
    const selectedVoice = voices.find(voice => voice.lang === detectedLanguage);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn('Voice not found for the detected language');
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const currentWordIndex = words.findIndex(
          word => event.charIndex >= stripHtml(word).length
        );
        setHighlightedWordIndex(currentWordIndex);
      }
    };

    speechSynthesis.speak(utterance);
    setReading(true);

    utterance.onend = () => setReading(false);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setReading(false);
  };

  const currentNote = notes[stepCount];
  const isLastStep = stepCount === notes.length - 1;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (notes.length === 0) {
    return <div>No notes available for this course.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-5 items-center mb-6">
        {stepCount !== 0 && (
          <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)}>
            Previous
          </Button>
        )}

        <div className="flex gap-2 flex-1">
          {notes.map((item, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full ${index < stepCount ? 'bg-primary' : 'bg-gray-500'}`}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)} disabled={isLastStep}>
          Next
        </Button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md">
        {currentNote && (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Note {stepCount + 1}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: currentNote.notes,
                }}
                className="prose mb-4"
              />
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="secondary"
                onClick={reading ? stopReading : () => readText(currentNote.notes)}
                className={`${
                  reading
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                } px-4 py-2 rounded-md transition-colors duration-300`}
              >
                {reading ? 'Stop Reading' : 'Read Text'}
              </Button>
            </div>

            {isLastStep && (
              <div className="flex items-center gap-10 flex-col justify-center">
                <h2 className="mt-5 text-lg font-semibold">End of Notes</h2>
                <Button onClick={() => router.back()}>Go to Course Page</Button>
                <Button variant="primary" onClick={generatePDF}>
                  Generate PDF
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewNotes;
