import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AddBooking,ViewBooking} from './index';
import NavBar from '../components/layout/NavBar';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AppNavigator = () => {
  return (
    <>
       <BrowserRouter>
          <NavBar />
          <div className='container'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/add-booking" element={<AddBooking />} />
            <Route path="/view-booking" element={<ViewBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </div>
      </BrowserRouter>
    </>


  )
}

export default AppNavigator