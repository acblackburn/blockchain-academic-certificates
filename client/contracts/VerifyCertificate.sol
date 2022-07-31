// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VerifyCertificate {

  bytes32 root;

  function verify(
    bytes32[] memory proof,
    bytes32 leaf
    ) public view returns (bool) {
    bytes32 _root = root;
    return MerkleProof.verify(proof, _root, leaf);
  }

  function setRoot(bytes32 _root) public {
    root = _root;
  }

}