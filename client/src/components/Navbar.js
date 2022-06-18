
function Navbar() {
  return (
    <div className="fixed top-0 h-12 w-screen m-0 flex flex-row justify-between items-center bg-gray-800">
      <h1 className="ml-4 text-slate-200 font-bold">
        blockchain-academic-credentials
      </h1>
      <div className="flex flex-row items-center">
        <button className="mr-4 px-2 py-1 text-slate-200 font-bold bg-blue-500 rounded-full hover:bg-blue-700">
          Connect Wallet
        </button>
        <h1 className="mr-4 text-slate-200 font-bold">
          0x0
        </h1>
      </div>
    </div>
  );
}

export default Navbar;