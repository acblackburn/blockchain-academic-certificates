import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Publish from './pages/Publish';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import GunTest from './pages/GunTest';
import View from './pages/View';
import Help from './pages/Help';

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
            <Route path="/verify" element={isConnected ? <Verify /> : <NoWalletConnected />} />
            <Route path="/publish" element={isConnected ? <Publish account={account} /> : <NoWalletConnected />} />
            <Route path="/gun-test" element={<GunTest />} />
            <Route path="/view" element={isConnected ? <View account={account} /> : <NoWalletConnected />} />
            <Route path="/help" element={<Help account={account} isConnected={isConnected} />} />
            <Route path="/" element={<Home />} />
          </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

const NoWalletConnected = (props) => {
  return (
    <div class="flex flex-col w-full justify-center">
      <div class="mt-14 mx-20">
        <h1 class="text-4xl">No Wallet Connected</h1>
        <p class="pt-6 text-xl">
          Please return to the <Link to="/" class="text-blue-600 font-bold hover:underline">Home Page</Link> for information on how to set up a MetaMask wallet.
        </p>
        <p class="pt-6 text-xl">
          If you already have a MetaMask account, please click the <strong>Connect Wallet</strong> button in the top right
        </p>
      </div>
    </div>
  )
}

export default App;