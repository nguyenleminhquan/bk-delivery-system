import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error, Landing, Login, ProtectedRoute, Register, SharedLayout } from './pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Authorize from 'pages/Authorize';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path='/*' 
            element={
              <ProtectedRoute>
                <SharedLayout />
                <div className='routes'>
                  <Authorize />
                </div>
              </ProtectedRoute>
            } 
          >
          </Route>
          <Route path='landing' element={<Landing />} ></Route>
          <Route path='login' element={<Login />} ></Route>
          <Route path='register' element={<Register />} ></Route>
          <Route path='*' element={<Error />} ></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position='top-center' />
    </div>
  );
}

export default App;