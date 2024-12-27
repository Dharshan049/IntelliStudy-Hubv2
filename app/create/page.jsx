"use client";

import React, { useEffect, useState } from 'react';
import SelectOption from './_components/SelectOption';
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false); 
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue,
        }));
    };

    console.log('formData', formData);

    const GenerateCourseOutline = async () => {
        const courseId = uuidv4();
        setLoading(true);
        const result = await axios.post('/api/generate-course-outline', {
            courseId: courseId,
            ...formData,
            createdBy: user?.primaryEmailAddress?.emailAddress,
        });
        setLoading(false);
        router.replace('/dashboard');
        toast("Course content being generated, click on Refresh button");
    };

    const languages = [
        { label: "English" },
        { label: "Tamil" },
        { label: "Malayalam" },
        { label: "Telugu" },
        { label: "Kannada" },
        { label: "Hindi" },
        { label: "Spanish" },
        { label: "French" },
        { label: "German" },
        { label: "Chinese" },
    ];

    return (
        <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
            <h2 className="font-bold text-4xl text-primary">Start Building Your Personal Study Material</h2>
            <p className="text-gray-500 text-lg">Fill all details to generate</p>

            <div className="mt-10">
                {step === 0 ? (
                    <SelectOption selectedStudyType={(value) => handleUserInput('studyType', value)} />
                ) : (
                    <TopicInput
                        setTopic={(value) => handleUserInput('topic', value)}
                        setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                    />
                )}
            </div>

            {step !== 0 && (
                <div className="mt-4">
                    <label>Language:</label>
                    <div className="relative">
                        <button
                            className="w-64 text-left bg-gray-200 p-2 rounded"
                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                        >
                            {formData.language || "Select Language"}
                        </button>
                        {languageDropdownOpen && (
                            <div className="absolute w-64 bg-white shadow rounded mt-1 max-h-40 overflow-y-auto z-10">
                                {languages.map((lang) => (
                                    <div
                                        key={lang.label}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleUserInput("language", lang.label);
                                            setLanguageDropdownOpen(false);
                                        }}
                                    >
                                        {lang.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-between w-full mt-32">
                {step !== 0 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                        Previous
                    </Button>
                ) : (
                    '-'
                )}
                {step === 0 ? (
                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                    <Button onClick={GenerateCourseOutline} disabled={loading}>
                        {loading ? (
                            <Loader className="animate-spin h-5 w-5 text-white" />
                        ) : (
                            'Generate'
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Create;
