import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MerkleTreeDisplay from './components/MerkleTree';

function App() {
  const [account, setAccount] = useState(window.ethereum.selectedAddress);
  const [isConnected, setConnected] = useState(account != null);

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
  }, []);

  return (
    <BrowserRouter className="flex flex-col">
      <Navbar account={account} isConnected={isConnected} />
      <Routes>
        <Route path="/verify" element={<Verify />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/" element={<Home />} />
      </Routes>
      {/* <MerkleTreeDisplay /> */}
    </BrowserRouter>
  );
}

function Home(props) {
  return <h2>Home</h2>
}

function Verify(props) {
  return <h2>Verify</h2>
}

function Publish(props) {
  return <h2>Publish</h2>
}

export default App;