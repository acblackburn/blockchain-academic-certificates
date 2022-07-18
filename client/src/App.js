import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Verify from './pages/Verify';
import Publish from './pages/Publish';
import Navbar from './components/Navbar';

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

    // mount account change event listener
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // cleanup once component unmounts
    return function cleanup() {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

  return (
    <div class="bg-slate-200 h-screen">
      <BrowserRouter>
        <Navbar account={account} isConnected={isConnected} />
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Home(props) {
  return <h2>Home</h2>
}

export default App;