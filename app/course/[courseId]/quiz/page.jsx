"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StepProgress from "../_components/StepProgress";
import QuizCardItem from "./_components/QuizCardItem";

function Quiz() {
  const { courseId } = useParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState();
  const [stepCount, setStepCount] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const [isCorrectAns, setIsCorrectAns] = useState(null);
  const [correctAns, setCorrectAns] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15); // Timer for each question
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    GetQuiz();
  }, []);

  useEffect(() => {
    if (timer > 0 && isCorrectAns === null && !quizCompleted) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !quizCompleted) {
      handleTimeout();
    }
  }, [timer, isCorrectAns, quizCompleted]);

  const GetQuiz = async () => {
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
      studyType: "Quiz",
    });
    setQuizData(result.data);
    setQuiz(result.data?.content?.questions || []); // Ensure quiz is an empty array if no questions
    console.log(result);
  };

  const checkAnswer = (userAnswer, currentQuestion) => {
    if (userAnswer === currentQuestion?.correctAnswer) {
      setIsCorrectAns(true);
      setCorrectAns(currentQuestion?.correctAnswer);
      setScore((prev) => prev + 10); // Add 10 points for correct answer
      return;
    }
    setIsCorrectAns(false);
    setCorrectAns(currentQuestion?.correctAnswer);
  };

  const handleTimeout = () => {
    setIsCorrectAns(false);
    setCorrectAns(quiz[stepCount]?.correctAnswer); // Show correct answer on timeout
  };

  const resetSelection = () => {
    setTimer(15); // Reset timer for the next question
    setIsCorrectAns(null);
  };

  const nextStep = () => {
    if (stepCount < quiz.length - 1) {
      setStepCount(stepCount + 1);
      resetSelection();
    } else {
      setQuizCompleted(true); // Mark quiz as completed
    }
  };

  const restartQuiz = () => {
    setStepCount(0);
    setScore(0);
    setQuizCompleted(false);
    resetSelection();
  };

  const goBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  const currentQuestion = quiz[stepCount];

  if (quizCompleted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Quiz Completed! 🎉
          </h1>
          <p className="text-lg mb-2 text-center">
            You scored <span className="text-green-500 font-bold">{score}</span>{" "}
            out of {quiz.length * 10}.
          </p>
          <div className="text-center">
            <button className="btn btn-primary mt-5" onClick={restartQuiz}>
              Restart Quiz
            </button>
            <button
              className="btn btn-outline-primary mt-5 ml-3"
              onClick={goBackToCourse}
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-2xl text-center mb-4">Quiz</h2>

      <StepProgress
        data={quiz}
        stepCount={stepCount}
        setStepCount={(value) => setStepCount(value)}
      />

      <div className="mb-5 flex justify-between items-center">
        <p className="text-lg font-medium">
          Question {stepCount + 1} of {quiz.length}
        </p>
        <p className="text-lg font-medium text-red-500">Time: {timer}s</p>
        <p className="text-lg font-medium text-green-500">Score: {score}</p>
      </div>

      <div>
        {currentQuestion ? (
          <QuizCardItem
            quiz={currentQuestion}
            userSelectedOption={(v) => checkAnswer(v, currentQuestion)}
          />
        ) : (
          <div>Loading quiz...</div>
        )}
      </div>

      {isCorrectAns === false && (
        <div className="border p-3 border-red-700 bg-red-200 rounded-lg">
          <h2 className="font-bold text-lg text-red-600">Incorrect</h2>
          <p className="text-red-600">Correct answer is: {correctAns}</p>
        </div>
      )}

      {isCorrectAns === true && (
        <div>
          <div className="border p-3 border-green-700 bg-green-200 rounded-lg">
            <h2 className="font-bold text-lg text-green-600">Correct</h2>
            <p className="text-green-600">Your Option is Correct!</p>
          </div>
        </div>
      )}

      <div className="flex gap-5 items-center justify-between mt-5">
        <button
          className="btn btn-outline-secondary px-5 py-2 transition-all hover:bg-black hover:text-white"
          onClick={() => setStepCount(stepCount - 1)}
          disabled={stepCount === 0}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary px-5 py-2 transition-all hover:bg-black hover:text-white"
          onClick={nextStep}
          disabled={quizCompleted}
        >
          {stepCount === quiz.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
