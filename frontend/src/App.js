import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error, Landing, Login, ProtectedRoute, Register, Sender, SharedLayout, Profile } from './pages';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from 'pages/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Sender />}></Route>
            <Route path='profile' element={<Profile />}></Route>
            <Route path='home' element={<Home />}></Route>
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