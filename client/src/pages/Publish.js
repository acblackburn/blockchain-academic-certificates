import { useState, useEffect, useRef } from 'react';
import Gun from 'gun';
import keccak256 from 'keccak256';
import Web3 from 'web3';
import { MerkleTree } from 'merkletreejs';
import { create } from 'ipfs-http-client';
import PublishedCertificatesTable from '../components/PublishedCertificatesTable';
import NewPublisherForm from '../components/NewPublisherForm';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';

const Publish = (props) => {

  const [canPublish, setCanPublish] = useState(false);
  const [file, setFile] = useState(null);
  const [CIDs, setCIDs] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentAccount, setSelectedStudentAccount] = useState("");
  const fileInputRef = useRef("");

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
  const studentAccounts = gun.get('studentAccounts');

  useEffect(() => {
    // Check if account has smart contract publishing rights
    const canPublish = async () => {
      // Load VerifyCertificate solidity contract
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      const contract = new web3.eth.Contract(VerifyCertificate.abi, networkData.address, { from: window.ethereum.selectedAddress });

      // Call inherited hasRole method from AccessControl OpenZeppelin smart contract
      const role = "0x" + keccak256("PUBLISHER_ROLE").toString('hex');
      console.log(role);
      setCanPublish(await contract.methods.hasRole(role, props.account).call());
      console.log(canPublish.current);
    }
    canPublish();

    // Load all certificate CIDs from gunDB
    certificatesData.map().once((node, CID) => {
      if (node && !CIDs.includes(CID)) {
        setCIDs(CIDs.concat(CID));  
      }
    });

    // Load all connected account's published certificates' metadata from gunDB
    certificatesData.map(certificate => {
      if (certificate) {
        if (certificate.uploaderAccount === props.account) {
          return certificate;
        }
      }
      return undefined;
    }).once((metadata, _CID) => {
      if (metadata && !certificates.some(({CID}) => CID === _CID)) {
        setCertificates(certificates.concat(
          {
            CID: _CID,
            studentAccount: metadata.studentAccount,
            dateAdded: metadata.dateAdded
          }
        ));
      }
    });

    // Load all students from gunDB
    studentAccounts.map().once((student, _account) => {
      if (student && !students.some(({account}) => account === _account)) {
        setStudents(students.concat({account: _account, name: student.name}));
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
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
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
        const newCertificate = gun.get(fileAdded.path).put(
          {
            studentAccount: selectedStudentAccount,
            uploaderAccount: props.account,
            dateAdded: new Date().toLocaleString()
          });
        certificatesData.set(newCertificate);
      }
    } catch (error) {
      console.log(error.message);
    }
    // Clear file input
    fileInputRef.current.value = "";
  }

  const removeCertificate = async (CIDToDelete) => {
    try {
      // Load VerifyCertificate solidity contract
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      const contract = new web3.eth.Contract(VerifyCertificate.abi, networkData.address, { from: window.ethereum.selectedAddress });

      // Create leaves array excluding CID to be deleted
      const updatedCIDs = CIDs.filter(CID => CID !== CIDToDelete);
      const leaves = updatedCIDs.map(leaf => keccak256(leaf));

      // Create merkle tree using leaves array
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });

      // Get the new merkle root and call the set method from the smart contract to save to the blockchain
      const newRoot = merkleTree.getHexRoot();
      await contract.methods.setRoot(newRoot).send();

      // remove CID from gun.js 
      certificatesData.get(CIDToDelete).put(null);

      // Remove CID from CIDs array in state
      setCIDs(CIDs.filter(CID => CID !== CIDToDelete));

      // Remove certificate from certificates array in state
      setCertificates(certificates.filter(certificate => certificate.CID !== CIDToDelete));
  
      // unpin from IPFS client
      await client.pin.rm(CIDToDelete);

    } catch (error) {
      console.log(error);
    }
  }

  if (canPublish) {
    return (
      <div class="flex flex-col w-full justify-center">
        <div class="mt-14 mx-20">
          <h1 class="text-4xl">Publish a New Certificate</h1>
          <p class="pt-6">
            Simply select the certificate file and associated student from the form below and
            click <strong>submit</strong> to publish the certificate to the blockchain!
          </p>
          <p class="pt-6 font-bold">
            PLEASE NOTE: Your connected blockchain account WILL be charged gas fees when publishing.
            MetaMask will preview the cost to you upon publishing, at which point you can finalise
            the transaction.
          </p>
        </div>
        <div class="mt-10 flex justify-center w-full">
          <form onSubmit={handleFileUpload} class="flex flex-row mx-20 p-10 justify-center bg-white drop-shadow">
            <div class="flex flex-col mx-2">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                File
              </label>
              <input type="file" onChange={retrieveFile} ref={fileInputRef}
                class="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-violet-500"
                />
            </div>
            <div class="flex flex-col mx-2">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Student
              </label>
              <select
                onChange={e => setSelectedStudentAccount(e.target.value)} value={selectedStudentAccount}
                class="bg-gray-200 border-2 border-gray-200 rounded w-full h-full py-2 px-4 text-gray-700 focus:bg-white focus:outline-none focus:border-violet-500"
              >
                {students.map(student => {
                  return (
                    <option key={student.account} value={student.account}>
                      {student.account.substring(0,5)}...{student.account.substring(38.42)} ({student.name})
                    </option>
                  );
                  })}
                  <option value="" disabled selected>Select a student</option>
              </select>
            </div>
            <input type="submit" value="Publish" disabled={(file === null) || (selectedStudentAccount === "")} 
              class="shadow mt-6 bg-violet-500 hover:bg-violet-400 disabled:bg-violet-200 focus:shadow-outline focus:outline-none text-white font-bold mx-2 py-2 px-4 rounded"
            />
          </form>
        </div>
        <div class="mt-14 mx-20">
          <h1 class="text-4xl">Published Certificates</h1>
          <p class="pt-6">
            Listing all certificates published by blockchain account: <strong>{props.account.substring(0,5)}...{props.account.substring(38.42)}</strong>
          </p>
        </div>
        <PublishedCertificatesTable certificates={certificates} removeCertificate={removeCertificate} />
        <div class="mt-14 mx-20">
          <h1 class="text-4xl">Grant Publishing Permissions to New Blockchain Account</h1>
          <p class="pt-6">
            Use this form to grant publishing permissions to new blockchain accounts. <strong>Please note: This action should only be performed once you 
            have confirmed the account with the new institution.</strong>
          </p>
          <p class="pt-6 font-bold text-red-600">
            WARNING: Granting this permission will allow the new account to modify data on the blockchain, as well and grant permissions to new accounts.
            Only grant permissions to accounts that are fully trusted.
          </p>
        </div>
        <NewPublisherForm web3={web3}/>
      </div>
    );
  } else {
    return (
      <div class="flex flex-col w-full justify-center">
        <div class="mt-14 mx-20">
          <h1 class="text-4xl">Publish a New Certificate</h1>
          <p class="pt-6 text-lg text-red-600">
            Blockchain account: <strong>{props.account.substring(0,5)}...{props.account.substring(38.42)}</strong> does not have permission to publish new certificates.
          </p>
          <p class="pt-6 text-lg font-bold">
            If you are a new institution, please contact one of the current institutions to enquire about joining this decentralised application.
          </p>
          <p class="pt-6 text-lg">
            Institutions currently using this application include:
            <ul>
              <li class="my-4 list-disc">University of Birmingham</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }
  
}

export default Publish;