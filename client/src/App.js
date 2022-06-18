import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import Navbar from './components/Navbar';

function App() {

  const [account, setAccount] = useState(0);
  const [isConnected, setConnected] = useState(false);

  useEffect (() => {
    // updates state every time there is a change to the account
    function handleAccountsChanged(accounts) {
      setAccount(accounts[0]);
      if (!accounts[0]) {
        setConnected(false);
      }
      else {
        setConnected(true);
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // cleanup once component unmounts
    return function cleanup() {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  });

  return (
    <div className="flex flex-col">
      <Navbar account={account} isConnected={isConnected} />
    </div>
  );
}

export default App;