import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const quizQuestions = [
    {
      question: "What is a 'palindrome'?",
      options: ["A type of insect", "A type of flower", "A word that reads the same backward as forward", "A word that reads the same backward as forward"],
      answer: "A word that reads the same backward as forward"
    },
    {
      question: "What does the word 'ubiquitous' mean?",
      options: ["Rare", "Unique", "Common", "Everywhere"],
      answer: "Everywhere"
    },
    {
      question: "What is an 'oxymoron'?",
      options: ["A type of animal", "A type of plant", "A figure of speech that contradicts itself", "A figure of speech that contradicts itself"],
      answer: "A figure of speech that contradicts itself"
    },
    {
      question: "What is the meaning of 'ambiguous'?",
      options: ["Clear", "Simple", "Unclear", "Unclear"],
      answer: "Unclear"
    },
    {
      question: "Who was the first person to set foot on the moon?",
      options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Alan Shepard"],
      answer: "Neil Armstrong"
    },
    {
      question: "Which country's space agency is known as Roscosmos?",
      options: ["USA", "Russia", "China", "Japan"],
      answer: "Russia"
    },
    {
      question: "What is a 'simile'?",
      options: ["A type of poem", "A type of song", "A comparison using 'like' or 'as'", "A comparison using 'like' or 'as'"],
      answer: "A comparison using 'like' or 'as'"
    },
    {
      question: "If you have two coins totalling 35 cents, and one of them is not a dime, what are the two coins?",
      options: ["25 and 10", "30 and 5", "20 and 15", "25 and 20"],
      answer: "25 and 10"
    },
    {
      question: "What has a head and a tail, but no body?",
      options: ["A coin", "A snake", "A fish", "A rope"],
      answer: "A coin"
    },
    {
      question: "What has one horn and one eye?",
      options: ["A rhinoceros", "A unicorn", "A cyclops", "A bicycle"],
      answer: "A cyclops"
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
          <h2>Enter Your Name</h2>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your Name" 
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
