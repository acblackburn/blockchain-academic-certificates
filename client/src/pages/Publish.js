import { useState, useEffect, useRef } from 'react';
import Gun from 'gun';
import keccak256 from 'keccak256';
import Web3 from 'web3';
import { MerkleTree } from 'merkletreejs';
import { create } from 'ipfs-http-client';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';

function Publish(props) {

  const [file, setFile] = useState(null);
  const [CIDs, setCIDs] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const fileInputRef = useRef("");
  const [publishStatus, setPublishStatus] = useState(0);

  // create ETH web3 object
  const web3 = new Web3(Web3.givenProvider);

  const auth =
    'Basic ' + Buffer.from(process.env.REACT_APP_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_IPFS_API_KEY).toString('base64');

  // create object to access IPFS infura dedicated gateway
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

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

    // return () => {
    //   certificatesData.off();
    // };
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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setSubmitDisabled(true);
    try {
      // Load VerifyCertificate solidity contract
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      const contract = new web3.eth.Contract(VerifyCertificate.abi, networkData.address, { from: window.ethereum.selectedAddress });

      // Add uploaded file to IPFS
      const fileAdded = await client.add(file);

      if (CIDs.includes(fileAdded.path)) {
        alert("This certificate has already been published!");
      } else {
        // Hash all CIDs into leaves array and add the hashed CID of the new certificate
        const leaves = CIDs.map(CID => keccak256(CID));
        leaves.push(keccak256(fileAdded.path));

        // Create merkle tree using leaves array
        const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
        
        // Get the new merkle root and call the set method from the smart contract to save to the blockchain
        const newRoot = merkleTree.getHexRoot();
        await contract.methods.setRoot(newRoot).send();

        // Add new certificate metadata to gunDB
        const newCertificate = gun.get(fileAdded.path).put({studentAccount: "exampleStudentAccount", uploaderAccount: "exampleUploaderAccount"});
        certificatesData.set(newCertificate);
      }
    } catch (error) {
      console.log(error.message);
    }
    // Clear file input
    fileInputRef.current.value = "";
  }

  return (
    <div class="my-20 flex justify-center w-full">
      <form onSubmit={handleFileUpload} class="w-3/5 flex flex-col justify-center bg-white shadow-md rounded px-8 py-8">
        <div class="flex justify-center">
          <input type="file" onChange={retrieveFile} ref={fileInputRef}
          class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-600"
          />
          <input type="submit" value="Publish" disabled={submitDisabled} class="shadow bg-indigo-600 hover:bg-indigo-400 disabled:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold mx-5 py-2 px-4 rounded" />
        </div>
      </form>
    </div>
  );
}

export default Publish;