import MerkleTree from 'merkletreejs'
import keccak256 from 'keccak256'
import Web3 from 'web3';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';
import { useState, useEffect } from 'react';

function MerkleTreeDisplay(props) {

  const [contract, setContract] = useState(false);

  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    const runContract = async () => {
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      const contract = new web3.eth.Contract(VerifyCertificate.abi, networkData.address);
      const leaves = ['a', 'b', 'c', 'd', 'e'].map(leaf => keccak256(leaf));
      const tree = new MerkleTree(leaves, keccak256);
      const root = tree.getHexRoot();
      const goodLeaf = keccak256('c');
      const goodProof = tree.getHexProof(goodLeaf);
      console.log("Verifying legitimate leaf...");
      console.log(await contract.methods.verify(goodProof, root, goodLeaf).call());
      const badLeaf = keccak256('x');
      const badProof = tree.getHexProof(badLeaf);
      console.log("Verifying bad leaf...");
      console.log(await contract.methods.verify(badProof, root, badLeaf).call());
    }

    runContract();
  }, [])
  
  return (
    <div>
      {contract._address}
    </div>
  );
}

export default MerkleTreeDisplay;
