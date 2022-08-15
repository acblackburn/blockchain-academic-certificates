import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Publish from './pages/Publish';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import GunTest from './pages/GunTest';
import View from './pages/View';

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
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  });

  return (
      <BrowserRouter>
        <div class="flex bg-slate-100">
          <Sidebar />
          <div class="flex-1">
          <Topbar account={account} isConnected={isConnected} />
          <Routes>
            <Route path="/verify" element={<Verify />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/gun-test" element={<GunTest />} />
            <Route path="/view" element={<View />} />
            <Route path="/" element={<Home />} />
          </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;