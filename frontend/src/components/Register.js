import { useState, useContext } from "react";
import {AuthContext}  from "../../src/contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useNavigate } from "react-router-dom";

function Register() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
     
      const loginRes = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await loginRes.json();
      login(data.token);
       window.location.href = '/login';

    } else {
      alert("Registration failed");
    }
  };

  return (
    <>
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
  
    </form>
         <span>If you have already an acount: </span>
      <button onClick={() => {
                navigate("/login");
            }}>Login</button>
      </>
  );
}

export default Register;