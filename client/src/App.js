import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {

  // useEffect (() => {
  //   const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
  //   const account = accounts[0];
  // });

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Blockchain Academic Credentials
      </h1>
    </div>
  );
}

export default App;
