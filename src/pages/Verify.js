import MerkleTree from 'merkletreejs'
import keccak256 from 'keccak256';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import VerifyCertificate from '../contracts_build/contracts/VerifyCertificate.json';

function Verify(props) {

  const [contract, setContract] = useState(0);
  const [merkleTree, setMerkleTree] = useState(0);
  const [data, setData] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(0);

  const verifyData = async (e) => {
    e.preventDefault();
    const root = merkleTree.getHexRoot();
    const leaf = keccak256(data);
    const proof = merkleTree.getHexProof(leaf);
    setVerifiedStatus(await contract.methods.verify(proof, root, leaf).call());
  }

  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    const loadContract = async () => {
      const networkId = await web3.eth.net.getId();
      const networkData = VerifyCertificate.networks[networkId];
      setContract(new web3.eth.Contract(VerifyCertificate.abi, networkData.address));
    }
    
    // load merkleTree data
    const leaves = ['a', 'b', 'c', 'd', 'e'].map(leaf => keccak256(leaf));
    setMerkleTree(new MerkleTree(leaves, keccak256));

    loadContract();
  }, [])

  return (
    <form onSubmit={verifyData}>
      <label>
        Data to verify:
        <input type="text" value={data} onChange={e => setData(e.target.value)} />
      </label>
      <input type="submit" value="Verify"/>
    </form>
  );
}

export default Verify;