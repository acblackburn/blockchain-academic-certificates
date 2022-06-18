import { useState } from "react";
import Web3 from 'web3';

function Navbar() {

  const [account, setAccount] = useState(0);
  const [isConnected, setConnected] = useState(false);

  async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    setAccount(account);
    setConnected(true);
  }

  return (
    <div className="fixed top-0 h-12 w-screen m-0 flex flex-row justify-between items-center bg-gray-800">
      <h1 className="ml-4 text-slate-200 font-bold">
        blockchain-academic-credentials
      </h1>
      <div className="flex flex-row items-center">
        <button
          onClick={getAccount}
          className="mr-4 px-2 py-1 text-slate-200 font-bold bg-blue-500 rounded-full hover:bg-blue-700"
          >
          Connect Wallet
        </button>
        {isConnected &&
          <h1 className="mr-4 text-slate-200 font-bold">
            {account}
          </h1>
        }
    
      </div>
    </div>
  );
}

export default Navbar;