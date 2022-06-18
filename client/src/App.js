import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import Navbar from './components/Navbar';

function App() {

  // useEffect (() => {
  //   const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
  //   const account = accounts[0];
  // });

  return (
    <div className="flex flex-col">
      <Navbar/>
    </div>
  );
}

export default App;
