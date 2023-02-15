import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error, Landing, Login, ProtectedRoute, Register, Sender, SharedLayout, Profile, CreateOrder } from './pages';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

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
            <Route path='create-order' element={<CreateOrder />}></Route>
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