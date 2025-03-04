import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuizPage1 from './pages/QuizPage1';
import HomePage from './pages/HomePage';
import QuizPage2 from './pages/QuizPage2';

function App() {

  // eslint-disable-next-line
  const [alert, setAlert] = useState(null);
  // eslint-disable-next-line
  const [role, setRole] = useState(null);

  // Fetch role from localStorage on initial load
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
  }, []);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type: type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <BrowserRouter>
      <div className="App">
          <section className='quiz-container'>
                <Routes>
                    <Route path='/' element={<HomePage showAlert={showAlert}/> }/>
                    <Route path='/slot_1' element={<QuizPage1 showAlert={showAlert}/>} />
                    <Route path='/slot_2' element={<QuizPage2 showAlert={showAlert}/>} />
                </Routes>
          </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
