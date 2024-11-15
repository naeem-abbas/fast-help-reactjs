import React, { useState } from 'react';
import { addData } from '../../api/index';
import { Routes } from '../../api/apiRoutes';
import {useNavigate} from 'react-router-dom';

const Register = () => {
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  const navigate=useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    const response = await addData(Routes.authRegister, { fullName, email, password });
    console.log(response);
    console.log(response.err);
    if (response?.errorMessage) {
      setRegistering(false);
      if(response.err.response.data?.errors?.email){
        alert("Email already exists!");
      }
      else{
        alert("Something went wrong!");  
      }
      
      return;
    }
  
    const { isRegistered, message } = response.data;
    if (!isRegistered) {
      alert('Registration failed!');
      setRegistering(false);
    } else {
      alert(message);
      setRegistering(false);
      navigate("/login");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
        <h4 className="text-primary">Register</h4>
        <hr />
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
        <hr />
        <div className="mb-3 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={registering}>
            {registering ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;