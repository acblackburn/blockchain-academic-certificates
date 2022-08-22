import makeBlockie from 'ethereum-blockies-base64';

const connectWallet = async () => {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

const Topbar = (props) => {
  let button;
  if (props.isConnected) {
    button = <WalletConnectedButton />;
  }
  else {
    button = <ConnectWalletButton />;
  }


  return (
    <div className="sticky w-full top-0 h-20 flex justify-between items-center bg-white shadow z-50">
      <h1 className="ml-8 text-slate-500 font-bold">
        blockchain-academic-certificates
      </h1>
      <div className="flex flex-row items-center h-full">
        {button}
        {props.isConnected &&
          <a 
            href={"https://etherscan.io/address/" + props.account}
            className="mr-4 text-slate-500 font-bold hover:underline"
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

const WalletConnectedButton = () => {
  return (
    <button
      className="mr-4 px-4 py-2 text-slate-100 font-bold bg-green-700 rounded-full"
      disabled
    >
      Wallet Connected
    </button>

  );
}

const ConnectWalletButton = () => {
  return (
    <button
      onClick={connectWallet}
      className="mr-6 px-4 py-2 text-slate-200 font-bold bg-blue-700 rounded-full hover:bg-blue-500"
      >
      Connect Wallet
    </button>
  );
}

export default Topbar;