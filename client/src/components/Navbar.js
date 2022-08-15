import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';

async function connectWallet() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

function Navbar(props) {
  let button;
  if (props.isConnected) {
    button = <WalletConnectedButton />;
  }
  else {
    button = <ConnectWalletButton />;
  }


  return (
    <div className="sticky w-full top-0 h-20 flex justify-between items-center bg-white shadow">
      <nav>
        <Link to="/" className="ml-8 text-slate-200 font-bold">
          blockchain-academic-certificates
        </Link>
      </nav>
      <div className="flex flex-row items-center h-full">
        {button}
        {props.isConnected &&
          <a 
            href={"https://etherscan.io/address/" + props.account}
            className="mr-4 text-slate-200 font-bold hover:underline"
            >
            {props.account.substring(0,5)}...{props.account.substring(38.42)}
          </a>
        }
        {props.isConnected &&
        <div className="h-full mr-6 py-4">
          <img src={makeBlockie(props.account)} className="h-full rounded-md" alt="account blockie" />
        </div>
        }
      </div>
    </div>
  );
}

function WalletConnectedButton() {
  return (
    <button
      className="mr-4 px-4 py-2 text-slate-200 font-bold bg-green-700 rounded-full"
      disabled
    >
      Wallet Connected
    </button>

  );
}

function ConnectWalletButton() {
  return (
    <button
      onClick={connectWallet}
      className="mr-4 px-2 py-1 text-slate-200 font-bold bg-blue-500 rounded-full hover:bg-blue-700"
      >
      Connect Wallet
    </button>
  );
}

export default Navbar;