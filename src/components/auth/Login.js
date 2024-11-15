import React, { useState } from 'react';

import {authLogin} from '../../api/index';
import { Routes } from '../../api/apiRoutes';

import {useNavigate} from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);

    const response = await authLogin(Routes.authLogin,{email,password});
    console.log(response);

    if(response?.errorMessage){
      setLoggingIn(false);
      console.log(response?.errorMessage);
      alert("Something went wrong!");
      return;
    }
    const {isLoggedIn,message,userId,userRole,userFullName}=response.data;
    if(!isLoggedIn){
      alert('Email or password is wrong!');
      localStorage.setItem("isLoggedIn","false");
      setLoggingIn(false);
    }

    else{
      //navigate
      alert(message);
      setLoggingIn(false);
      localStorage.setItem("isLoggedIn","true");
      localStorage.setItem("userId",userId);
      localStorage.setItem("userRole",userRole);
      localStorage.setItem("userFullName",userFullName);
      navigate("/add-booking");
    }

  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
        <h4 className="text-primary">Login</h4>
        <hr/>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <hr/>
        <div className="mb-3 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary" disabled={loggingIn}>
          {loggingIn ? 'Logging in...' : 'Login'}
        </button>
    </div>
      </form>
    </div>
  );
};

export default Login;