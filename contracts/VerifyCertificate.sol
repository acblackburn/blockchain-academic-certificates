// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VerifyCertificate {

  function verify(
    bytes32[] memory proof,
    bytes32 root,
    bytes32 leaf
    ) public pure returns (bool) {
    return MerkleProof.verify(proof, root, leaf);
  }

}