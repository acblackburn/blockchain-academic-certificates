import MerkleTree from 'merkletreejs'
import keccak256 from 'keccak256';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';
const Hash = require('ipfs-only-hash');

function Verify(props) {

  const [contract, setContract] = useState(0);
  const [merkleTree, setMerkleTree] = useState(0);
  const [data, setData] = useState('');
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(0);

  const web3 = new Web3(Web3.givenProvider);

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    }
  }

  const verifyFile = async (e) => {
    e.preventDefault();
    try {
      const fileCID = await Hash.of(file);
      const leaf = keccak256(fileCID);
      const proof = merkleTree.getHexProof(leaf);
      setVerifiedStatus(await contract.methods.verify(proof, leaf).call());
      console.log(leaf);
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  const verifyData = async (e) => {
    e.preventDefault();
    const leaf = keccak256(data);
    const root = merkleTree.getHexRoot();
    console.log(root.toString('hex'));
    const proof = merkleTree.getHexProof(leaf);
    setVerifiedStatus(await contract.methods.verify(proof, leaf).call());
  }

  useEffect(() => {
    const loadContract = async () => {
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      setContract(new web3.eth.Contract(VerifyCertificate.abi, networkData.address));
    }
    
    fetch("/hashes")
      .then((res) => res.json())
      .then((leaves) => {
        leaves = leaves.map(leaf => Buffer.from(leaf, 'hex'));
        console.log(leaves);
        setMerkleTree(new MerkleTree(leaves, keccak256, { sort: true }));
      });

    loadContract();
  }, [])

  return (
    <div class="my-20 flex justify-center w-full">
      <form onSubmit={verifyData} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <label>
            <input type="text" value={data} onChange={e => setData(e.target.value)} 
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
            placeholder="e.g. abc"
            />
          </label>
          <input type="submit" value="Verify" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
        {verifiedStatus !== 0 &&
        <div>
        {verifiedStatus ? 
          <h2 class="flex justify-center text-xl text-green-600 font-bold mt-5">Certificate has been verified as real</h2>
          : 
          <h2 class="flex justify-center text-xl text-red-600 font-bold mt-5">Certificate has been verified as fake</h2>}
        </div>}
      </form>
      <form onSubmit={verifyFile} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <input type="file" onChange={retrieveFile} 
        class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
        />
        <input type="submit" value="Upload" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
      </form>
      {verifiedStatus !== 0 &&
        <div>
        {verifiedStatus ? 
          <h2 class="flex justify-center text-xl text-green-600 font-bold mt-5">Certificate has been verified as real</h2>
          : 
          <h2 class="flex justify-center text-xl text-red-600 font-bold mt-5">Certificate has been verified as fake</h2>}
        </div>}
    </div>
  );
}

export default Verify;