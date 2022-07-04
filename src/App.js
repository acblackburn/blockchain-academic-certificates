import React, { useState, useEffect } from 'react';
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
    <div className="flex flex-col">
      <Navbar account={account} isConnected={isConnected} />
      <MerkleTreeDisplay />
    </div>
  );
}

export default App;