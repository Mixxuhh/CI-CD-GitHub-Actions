import React, { useState } from "react";
import type { Question } from "../models/Question.js";
import { getQuestions } from "../services/questionApi.js";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await getQuestions();

      const questionsWithIds = data.map((q, index) => ({
        ...q,
        _id: q._id || `question-${index}`,
      }));

      setQuestions(questionsWithIds);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowScore(false);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (selectedAnswerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answers[selectedAnswerIndex].isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={fetchQuestions}>
          Try Again
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="text-center">
        <h2>Quiz Complete!</h2>
        <p>
          You scored {score} out of {questions.length}
        </p>
        <button className="btn btn-primary" onClick={fetchQuestions}>
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <button className="btn btn-primary" onClick={fetchQuestions}>
          Start Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p data-testid="question">{currentQuestion.question}</p>
      <div className="answers">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            className="btn btn-outline-primary m-2"
            onClick={() => handleAnswerClick(index)}
            data-testid="answer-option"
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
