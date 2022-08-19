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
    <div class="flex flex-col w-full justify-center">
      <div class="mt-14 mx-20">
        <h1 class="text-4xl">Verify a Certificate</h1>
        <p class="pt-6">
          If you're an employer and an applicant has provided you with a Higher Education certificate such as
          a Degree Certificate or Transcript, please use the form below to verify its authenticity.
        </p>
        <p class="pt-6">
        Simply select the file for the form below and click <strong>Verify</strong>. This will check the file
        details against the blockchain to validate its authenticity!
        </p>
      </div>
      <div class="flex justify-center w-full mt-10">
        <form onSubmit={verifyFile} class="flex flex-col mx-20 p-10 justify-center bg-white drop-shadow">
          <div class="flex justify-center">
            <div class="flex flex-col mx-2">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                File
              </label>
              <input type="file" onChange={retrieveFile} ref={fileInputRef} 
              class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-violet-500"
              />
            </div>
            <input type="submit" value="Verify" disabled={submitDisabled} class="shadow mt-6 bg-violet-500 hover:bg-violet-400 disabled:bg-violet-200 focus:shadow-outline focus:outline-none text-white font-bold mx-2 py-2 px-4 rounded" />
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
    </div>
  );
}

export default Verify;