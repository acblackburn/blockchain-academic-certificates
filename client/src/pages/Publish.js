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
      
      fetch("/CIDs")
      .then((res) => res.json())
      .then((CIDs) => {
        const leaves = CIDs.map(CID => keccak256(CID));
        leaves.push(keccak256(fileAdded.path));
        setMerkleTree(new MerkleTree(leaves, keccak256, { sort: true }));
      });

      const newRoot = merkleTree.getHexRoot();
      console.log(newRoot);
      contract.methods.setRoot(newRoot).send();

      fetch('/CID', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({CID: fileAdded.path}),
      })
    } catch (error) {
      console.log(error.message);
    }
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
      <form onSubmit={handleFileUpload} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <input type="file" onChange={retrieveFile} 
          class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
          />
          <input type="submit" value="Publish" class="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
      </form>
    </div>
  );
}

export default Publish;