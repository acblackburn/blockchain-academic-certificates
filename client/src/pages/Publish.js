import React from 'react';
import { useState, useEffect } from 'react';
import keccak256 from 'keccak256';
import Web3 from 'web3';
import MerkleTree from 'merkletreejs';
import { create } from 'ipfs-http-client';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';

function Publish(props) {

  const [contract, setContract] = useState(0);
  const [merkleTree, setMerkleTree] = useState(0);
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [publishStatus, setPublishStatus] = useState(0);

  const web3 = new Web3(Web3.givenProvider);
  const client = create('https://ipfs.infura.io:5001/api/v0');

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const fileAdded = await client.add(file);
      console.log("Added file:", fileAdded.path);
      const CIDhash = keccak256(fileAdded.path).toString('hex');
      console.log(CIDhash);
    } catch (error) {
      console.log(error.message);
    }
  }

  const submitData = async (e) => {
    e.preventDefault();

    fetch("/hashes")
      .then((res) => res.json())
      .then((leaves) => {
        leaves = leaves.map(leaf => Buffer.from(leaf, 'hex'));
        leaves.push(keccak256(data));
        setMerkleTree(new MerkleTree(leaves, keccak256, { sort: true }));
      });

    const newRoot = merkleTree.getHexRoot();
    console.log(newRoot);
    contract.methods.setRoot(newRoot).send();

    fetch('/hash', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(keccak256(data)),
    })
    .then((res) => {
      console.log(res.body);
      setData('');
      return res.json();
    });

  }

  useEffect(() => {
    const loadContract = async () => {
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      setContract(new web3.eth.Contract(VerifyCertificate.abi, networkData.address, { from: window.ethereum.selectedAddress }));
    }

    loadContract();
  }, [])

  return (
    <div class="my-20 flex justify-center w-full">
      <form onSubmit={submitData} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <label>
            <input type="text" value={data} onChange={e => setData(e.target.value)} 
            class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
            placeholder="e.g. abc"
            />
          </label>
          <input type="submit" value="Publish" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
        {/* {verifiedStatus !== 0 &&
        <div>
        {verifiedStatus ? 
          <h2 class="flex justify-center text-xl text-green-600 font-bold mt-5">Certificate has been verified as real</h2>
          : 
          <h2 class="flex justify-center text-xl text-red-600 font-bold mt-5">Certificate has been verified as fake</h2>}
        </div>} */}
      </form>
      <form onSubmit={handleFileUpload} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <input type="file" onChange={retrieveFile} 
        class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
        />
        <input type="submit" value="Upload" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
      </form>
    </div>
    
  );
}

export default Publish;