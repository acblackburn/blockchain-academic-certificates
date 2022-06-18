import { useState } from "react";
import makeBlockie from 'ethereum-blockies-base64';

function Navbar(props) {

  async function connectWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  return (
    <div className="fixed top-0 h-12 w-screen m-0 flex flex-row justify-between items-center bg-gray-800">
      <h1 className="ml-4 text-slate-200 font-bold">
        blockchain-academic-certificates
      </h1>
      <div className="flex flex-row items-center h-full">
        <button
          onClick={connectWallet}
          className="mr-4 px-2 py-1 text-slate-200 font-bold bg-blue-500 rounded-full hover:bg-blue-700"
          >
          Connect Wallet
        </button>
        {props.isConnected &&
          <a 
            href={"https://etherscan.io/address/" + props.account}
            className="mr-4 text-slate-200 font-bold hover:underline"
            >
            {props.account.substring(0,5)}...{props.account.substring(38.42)}
          </a>
        }
        {props.isConnected &&
        <div className="h-full mr-2 py-1">
          <img src={makeBlockie(props.account)} className="h-full rounded-md" />
        </div>
        }
      </div>
    </div>
  );
}

export default Navbar;