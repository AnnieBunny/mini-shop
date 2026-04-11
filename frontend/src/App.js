import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import SuccessPaymentPage from './components/SuccessPaymentPage';
import CancelPaymentPage from './components/CancelPaymentPage';

function App() {
  return (
    <Router>
      <div>
        

        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/success" element={<SuccessPaymentPage />} /> 
          <Route path="/cancel" element={<CancelPaymentPage />} /> 


        </Routes>
      </div>
    </Router>
  );
}

export default App;