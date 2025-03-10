import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const quizQuestions = [
  {
    "question": "Who was the first man to walk on the Moon?",
    "options": ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
    "answer": "Neil Armstrong"
  },
  {
    "question": "What is the currency of Japan?",
    "options": ["Yuan", "Won", "Yen", "Rupee"],
    "answer": "Yen"
  },
  {
    "question": "Which is the most spoken language in the world?",
    "options": ["English", "Spanish", "Mandarin Chinese", "Hindi"],
    "answer": "Mandarin Chinese"
  },
  {
    "question": "Which city is known as the 'Silicon Valley of India'?",
    "options": ["Hyderabad", "Pune", "Bangalore", "Chennai"],
    "answer": "Bangalore"
  },
  {
    "question": "Who discovered penicillin?",
    "options": ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Joseph Lister"],
    "answer": "Alexander Fleming"
  },
  {
    "question": "Which Mughal emperor built the Taj Mahal?",
    "options": ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
    "answer": "Shah Jahan"
  },
  {
    "question": "Which Indian state has the largest population?",
    "options": ["Maharashtra", "Uttar Pradesh", "West Bengal", "Bihar"],
    "answer": "Uttar Pradesh"
  },
  {
    "question": "What does USB stand for in technology?",
    "options": ["Universal Serial Bus", "Ultra Speed Band", "United System Backup", "Universal Software Bridge"],
    "answer": "Universal Serial Bus"
  },
  {
    "question": "What is the national bird of India?",
    "options": ["Kingfisher", "Peacock", "Eagle", "Parrot"],
    "answer": "Peacock"
  },
  {
    "question": "Which vitamin is known as the 'sunshine vitamin'?",
    "options": ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    "answer": "Vitamin D"
  }
];
  
  


const QuizPage4 = () => {
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizStartTime, setQuizStartTime] = useState(null);
  // eslint-disable-next-line
  const [quizEndTime, setQuizEndTime] = useState(null);
  // eslint-disable-next-line
  const [quizDuration, setQuizDuration] = useState("");
  
  const slot = "Slot 4"; // Default slot
  
  const emailSentRef = useRef(false);

  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !emailSentRef.current) {
      submitQuiz(score);
    }
    // eslint-disable-next-line
  }, [timeLeft, step]);

  // Prevent Copy, Cut, Paste, and Right-Click
  useEffect(() => {
    const disableCopy = (e) => e.preventDefault();
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("paste", disableCopy);
    document.addEventListener("contextmenu", (e) => e.preventDefault()); // Disable right-click

    return () => {
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("paste", disableCopy);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  const handleStartQuiz = () => {
    if (name.trim() !== "") {
      setStep(2);
    }
  };

  const handleBeginQuiz = () => {
    setQuizStartTime(new Date());
    setStep(3);
  };

  const handleAnswerClick = (option) => {
    if (quizCompleted) return;

    setScore((prevScore) => {
      const newScore = option === quizQuestions[currentQuestion].answer ? prevScore + 1 : prevScore;

      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitQuiz(newScore);
      }

      return newScore;
    });
  };

  const submitQuiz = (finalScore) => {
    if (emailSentRef.current) return;
    emailSentRef.current = true;

    setQuizCompleted(true);
    const endTime = new Date();
    setQuizEndTime(endTime);

    const duration = Math.floor((endTime - quizStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}m ${seconds}s`;
    setQuizDuration(formattedDuration);

    sendResults(formattedDuration, finalScore);
  };

  const sendResults = (formattedDuration, finalScore) => {
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      {
        participant_name: name,
        participant_slot: slot, // Using default "Slot 1"
        user_score: `${finalScore}/${quizQuestions.length}`,
        quiz_duration: formattedDuration,
        admin_email: "akshay.patra114@gmail.com",
      },
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );
  };
  return (
    <div style={{ textAlign: "center", padding: "20px" }} className="quiz-container">
      <h1>Dimagi Dangal Quiz {slot}</h1>
      {step === 1 && (
        <div>
          <p className="name-input-header">Enter Your ID</p>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your ID" 
          />
          <button onClick={handleStartQuiz}>Next</button>
        </div>
      )}
      {step === 2 && (
      <div>
        <h2>Quiz Rules</h2>
        <div className="quiz-rules">
          <p>1. The quiz is timed (10 minutes).</p>
          <p>2. You cannot go back to previous questions.</p>
          <p>3. The quiz auto-submits when time runs out.</p>
        </div>
        <button onClick={handleBeginQuiz}>Start Quiz</button>
      </div>
    )}
      {step === 3 && !quizCompleted && (
        <div>
          <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
          <h3>Quiz Start Time: {quizStartTime?.toLocaleTimeString()}</h3>
          <div className="quiz-question">{quizQuestions[currentQuestion].question}</div>
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              style={{ display: "block", margin: "10px auto", padding: "10px" }}
              onClick={() => handleAnswerClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {quizCompleted && (
        <div className="result">Quiz Completed! Your Score: {score}/{quizQuestions.length}</div>
      )}
    </div>
  );
};

export default QuizPage4;
