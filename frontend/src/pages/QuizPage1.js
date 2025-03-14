import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const quizQuestions = [
  {
    "question": "Which is the longest river in the world?",
    "options": ["Amazon River", "Yangtze River", "Mississippi River", "Nile River"],
    "answer": "Nile River"
  },
  {
    "question": "What is the capital of Maharashtra, India?",
    "options": ["Pune", "Nagpur", "Mumbai", "Nashik"],
    "answer": "Mumbai"
  },
  {
    "question": "Which planet is known as the 'Red Planet'?",
    "options": ["Earth", "Venus", "Mars", "Jupiter"],
    "answer": "Mars"
  },
  {
    "question": "Who is known as the 'Missile Man of India'?",
    "options": ["Vikram Sarabhai", "Dr. A.P.J. Abdul Kalam", "C.V. Raman", "Homi Bhabha"],
    "answer": "Dr. A.P.J. Abdul Kalam"
  },
  {
    "question": "What does CPU stand for in computers?",
    "options": ["Central Processing Unit", "Computer Power Utility", "Control Processing Unit", "Central Program Unit"],
    "answer": "Central Processing Unit"
  },
  {
    "question": "Which gas is most abundant in Earth's atmosphere?",
    "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
    "answer": "Nitrogen"
  },
  {
    "question": "Which Indian company owns the Tata Nano car?",
    "options": ["Mahindra", "Hyundai", "Tata Motors", "Maruti Suzuki"],
    "answer": "Tata Motors"
  },
  {
    "question": "Which country hosted the first modern Olympic Games in 1896?",
    "options": ["France", "United Kingdom", "Greece", "United States"],
    "answer": "Greece"
  },
  {
    "question": "Which Indian state has the highest literacy rate?",
    "options": ["Kerala", "Tamil Nadu", "Maharashtra", "Goa"],
    "answer": "Kerala"
  },
  {
    "question": "What does GDP stand for in economics?",
    "options": ["Gross Domestic Product", "General Debt Policy", "Government Development Plan", "Global Development Projection"],
    "answer": "Gross Domestic Product"
  }
];




const QuizPage1 = () => {
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
  
  const slot = "Slot 1"; // Default slot
  
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
  //   console.log("Service ID:", process.env.REACT_APP_EMAILJS_SERVICE_ID);
  // console.log("Template ID:", process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
  // console.log("Public Key:", process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
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

export default QuizPage1;
