import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const quizQuestions = [
  {
    "question": "Which planet is known for its beautiful rings?",
    "options": ["Jupiter", "Saturn", "Uranus", "Neptune"],
    "answer": "Saturn"
  },
  {
    "question": "Which Indian scientist is known as the 'Father of the Indian Space Program'?",
    "options": ["C.V. Raman", "Homi Bhabha", "Vikram Sarabhai", "Satyendra Nath Bose"],
    "answer": "Vikram Sarabhai"
  },
  {
    "question": "What is the chemical formula of water?",
    "options": ["H2O", "CO2", "O2", "NaCl"],
    "answer": "H2O"
  },
  {
    "question": "Who is the current Prime Minister of the United Kingdom (as of 2024)?",
    "options": ["Boris Johnson", "Rishi Sunak", "Keir Starmer", "Theresa May"],
    "answer": "Rishi Sunak"
  },
  {
    "question": "Which country has the highest number of time zones?",
    "options": ["USA", "Russia", "France", "China"],
    "answer": "France"
  },
  {
    "question": "Which Indian city is known as the 'City of Joy'?",
    "options": ["Mumbai", "Chennai", "Kolkata", "Hyderabad"],
    "answer": "Kolkata"
  },
  {
    "question": "Which blood type is known as the universal donor?",
    "options": ["A", "B", "O-", "AB+"],
    "answer": "O-"
  },
  {
    "question": "Which country is the largest producer of coffee?",
    "options": ["India", "Colombia", "Vietnam", "Brazil"],
    "answer": "Brazil"
  },
  {
    "question": "Which was the first Indian movie to win an Oscar?",
    "options": ["Lagaan", "Mother India", "Gandhi", "Slumdog Millionaire"],
    "answer": "Gandhi"
  },
  {
    "question": "What is the study of fossils called?",
    "options": ["Geology", "Paleontology", "Archaeology", "Anthropology"],
    "answer": "Paleontology"
  }
];

  
  
  


const QuizPage6 = () => {
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
  
  const slot = "Slot 6"; // Default slot
  
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
      <h1>Dimaagi Dangal Quiz {slot}</h1>
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

export default QuizPage6;
