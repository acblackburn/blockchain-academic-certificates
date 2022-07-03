import MerkleTree from 'merkletreejs'
import sha256 from 'crypto-js/sha256';

function MerkleTreeDisplay(props) {

  const leaves = ['a', 'b', 'c', 'd', 'e'].map(x => sha256(x));
  const tree = new MerkleTree(leaves);
  const root = tree.getRoot().toString('hex');
  const goodLeaf = sha256('c');
  const goodProof = tree.getProof(goodLeaf);
  console.log("Verifying legitimate leaf...")
  console.log(tree.verify(goodProof, goodLeaf, root));
  const badLeaf = sha256('x');
  const badProof = tree.getProof(badLeaf);
  console.log("Verifying bad leaf...");
  console.log(tree.verify(badProof, badLeaf, root));
  
  return (
    <div>
      {tree.toString()};
    </div>
  );
}

export default MerkleTreeDisplay;
