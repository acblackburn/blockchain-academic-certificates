// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VerifyContract
 * @author Alex Blackburn
 * @notice A smart contract that allows for the verification and publishing of academic documents with method access control
 */
contract VerifyCertificate is AccessControl {

  bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");
  bytes32 root;

  /// @dev Set PUBLISHER role as its own admin and role to root user
  constructor(address rootAddress) {
    _setRoleAdmin(PUBLISHER_ROLE, PUBLISHER_ROLE);
    _grantRole(PUBLISHER_ROLE, rootAddress);
  }

  /// @dev proof and leaf generated on client side, then calls MerkleProof contract using storage variable root.
  function verify(
    bytes32[] memory proof,
    bytes32 leaf
    ) public view returns (bool) {
    return MerkleProof.verify(proof, root, leaf);
  }

  /// @dev update merkle tree root. Must have publiser access rights
  function setRoot(bytes32 _root) public onlyRole(PUBLISHER_ROLE) {
    root = _root;
  }

}