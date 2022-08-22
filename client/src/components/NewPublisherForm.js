import { useState, useRef } from "react";
import keccak256 from 'keccak256';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';

const NewPublisherForm = (props) => {

  const [newPublisherAccount, setNewPublisherAccount] = useState("");
  const textInputRef = useRef("");

  const addNewPublisher = async (e) => {
    e.preventDefault();
    // Load VerifyCertificate solidity contract
    const networkId = await props.web3.eth.net.getId();
    const networkData = VerifyCertificate.networks[networkId];
    const contract = new props.web3.eth.Contract(VerifyCertificate.abi, networkData.address, { from: window.ethereum.selectedAddress });

    // Send inherited grantRole method from AccessControl OpenZeppelin smart contract
    const role = "0x" + keccak256("PUBLISHER_ROLE").toString('hex');
    console.log(role);
    await contract.methods.grantRole(role, newPublisherAccount).send();
    textInputRef.current.value = "";
  }

  return (
    <div class="my-10 flex justify-center w-full">
      <form onSubmit={addNewPublisher} class="flex flex-row mx-20 p-10 justify-center bg-white drop-shadow">
        <div class="flex flex-col mx-2">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            New Publisher Blockchain Account
          </label>
          <input type="text" onChange={e => setNewPublisherAccount(e.target.value)} ref={textInputRef}
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-violet-500"
            />
        </div>
        <input type="submit" value="Add" disabled={newPublisherAccount === ""}
          class="shadow mt-6 bg-violet-500 hover:bg-violet-400 disabled:bg-violet-200 focus:shadow-outline focus:outline-none text-white font-bold mx-2 py-2 px-4 rounded"
        />
      </form>
    </div>
  );
}

export default NewPublisherForm;