import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256';
import { useState, useEffect, useRef } from 'react';
import Gun from 'gun';
import Web3 from 'web3';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';
const Hash = require('ipfs-only-hash');

function Verify(props) {

  const [file, setFile] = useState(null);
  const [CIDs, setCIDs] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [verifiedStatus, setVerifiedStatus] = useState(0);
  const fileInputRef = useRef("");

  // create ETh web3 object
  const web3 = new Web3(Web3.givenProvider);

  // Init connection to gunDB with relay server and get certificatesData set
  const gun = Gun({peers: ['http://localhost:3001/gun']});
  const certificatesData = gun.get('certificatesData');

  useEffect(() => {
    // Load all certificate CIDs from gunDB
    certificatesData.map().once((node, CID) => {
      if (node && !CIDs.includes(CID)) {
        setCIDs(CIDs.concat(CID));  
      }
    });

    return () => {
      certificatesData.off();
    };
  })

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
      setSubmitDisabled(false);
    }
  }

  const verifyFile = async (e) => {
    e.preventDefault();
    setSubmitDisabled(true);
    try {
      // Load VerifyCertificate solidity contract
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      const contract = new web3.eth.Contract(VerifyCertificate.abi, networkData.address);

      // Get CID of uploaded file and the CID hash
      const fileCID = await Hash.of(file);
      const leaf = keccak256(fileCID);

      // Create a merkle tree using the CIDs
      const merkleTree = new MerkleTree(CIDs.map(CID => keccak256(CID)), keccak256, { sort: true });

      // Generate proof using new data and merkle tree
      const proof = merkleTree.getHexProof(leaf);

      // Call verify method from the smart contract
      setVerifiedStatus(await contract.methods.verify(proof, leaf).call());
    } catch (error) {
      console.log(error.message);
    }
    // Clear file input
    fileInputRef.current.value = "";
  }

  return (
    <div class="my-20 flex justify-center w-full bg-slate-50">
      <form onSubmit={verifyFile} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <input type="file" onChange={retrieveFile} ref={fileInputRef} 
          class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
          />
          <input type="submit" value="Verify" disabled={submitDisabled} class="shadow bg-indigo-600 hover:bg-indigo-400 disabled:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
        {verifiedStatus !== 0 &&
          <div>
            {verifiedStatus ? 
              <h2 class="flex justify-center text-xl text-green-600 font-bold mt-5">Certificate has been verified as real</h2>
              : 
              <h2 class="flex justify-center text-xl text-red-600 font-bold mt-5">Certificate has been verified as fake</h2>}
          </div>}
      </form>
    </div>
  );
}

export default Verify;