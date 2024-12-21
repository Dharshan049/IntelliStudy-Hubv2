"use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const LandingPage = () => {
  const router = useRouter();
  const {isSignedIn} = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="p-4 flex justify-end">
        <Link href="/sign-in">
          <Button variant="ghost">Sign In</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span>IntelliStudy Hub</span>{' '}
          <span className="text-blue-600">Learning Management System</span>
          <br />
          <span>using Generative AI</span>
        </h1>
        
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
        Unlock your potential with the power of AI: revolutionize your study routine and achieve mastery through personalized, intelligent learning tools
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/sign-up">
            <Button className="h-12 px-6 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/* Tech Stack Section */}
        <div className="mt-20 pb-20">
          <h2 className="text-2xl font-bold mb-6">Powered by Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <span>Next.js</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Stripe</span>
            <span>•</span>
            <span>Inngest</span>
            <span>•</span>
            <span>Neon DB</span>
            <span>•</span>
            <span>Clerk Auth</span>
            <span>•</span>
            <span>Gemini AI</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

