import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import Home from './components/Home';
import Register from "./components/Register";
import Login from "./components/Login";
import SuccessPaymentPage from './components/SuccessPaymentPage';
import CancelPaymentPage from './components/CancelPaymentPage';

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<SuccessPaymentPage />} />
          <Route path="/cancel" element={<CancelPaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;