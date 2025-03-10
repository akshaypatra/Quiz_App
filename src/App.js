import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuizPage1 from './pages/QuizPage1';
import HomePage from './pages/HomePage';
import QuizPage2 from './pages/QuizPage2';
import QuizPage3 from './pages/QuizPage3';
import QuizPage4 from './pages/QuizPage4';
import QuizPage5 from './pages/QuizPage5';
import QuizPage6 from './pages/QuizPage6';
import QuizPage7 from './pages/QuizPage7';
import QuizPage8 from './pages/QuizPage8';
import QuizPage9 from './pages/QuizPage9';
import QuizPage10 from './pages/QuizPage10';


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
        <section className='header-container'>
            <div className='header-div-1'>
              <img className='dimagi-dangal-logo' src="./images/Dimaagi_Dangal__2_-removebg-preview.png" alt="yuvarth" />
              <h1 className='glow-text'>Dimaagi Dangal</h1>
            </div>
        </section>
         <section className='content-container'>
            <div className="persona-logo-div">
              <img className='persona-logo' src="./images/persona-logo2.png" alt="yuvarth" />
            </div>
            <div className='quiz-container1'>
                  <Routes>
                      <Route path='/' element={<HomePage showAlert={showAlert}/> }/>
                      <Route path='/slot_1' element={<QuizPage1 showAlert={showAlert}/>} />
                      <Route path='/slot_2' element={<QuizPage2 showAlert={showAlert}/>} />
                      <Route path='/slot_3' element={<QuizPage3 showAlert={showAlert}/>} />
                      <Route path='/slot_4' element={<QuizPage4 showAlert={showAlert}/>} />
                      <Route path='/slot_5' element={<QuizPage5 showAlert={showAlert}/>} />
                      <Route path='/slot_6' element={<QuizPage6 showAlert={showAlert}/>} />
                      <Route path='/slot_7' element={<QuizPage7 showAlert={showAlert}/>} />
                      <Route path='/slot_8' element={<QuizPage8 showAlert={showAlert}/>} />
                      <Route path='/slot_9' element={<QuizPage9 showAlert={showAlert}/>} />
                      <Route path='/slot_10' element={<QuizPage10 showAlert={showAlert}/>} />
                      

                  </Routes>
            </div>
            
            <div className="Yuvarth-logo-div">
              <img className='Yuvarth-logo' src="./images/Dimaagi_Dangal__1_-removebg-preview.png" alt="yuvarth" />
            </div>
          </section>
          <section>
          <p className='glow-text2'>Organised By YUVARTH</p>
          <p style={{textAlign:"center"}}>Business and Entrepreneurship Club of MIT ADT</p>
          </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
