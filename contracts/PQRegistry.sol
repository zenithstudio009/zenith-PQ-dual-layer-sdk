// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPQRegistry {
    event KeyRegistered(address indexed acct, uint16 algoID, bytes32 pkCommitment, uint64 validFrom);
    event KeyRevoked(address indexed acct, bytes32 pkCommitment, uint64 revokedAt);
    event PolicyUpdated(address indexed acct, uint8 policyFlags);

    function registerKey(uint16 algoID, bytes32 pkCommitment) external;
    function revokeKey(bytes32 pkCommitment) external;
    function getKey(address acct) external view returns (uint16 algoID, bytes32 pkCommitment, uint8 policyFlags);
}

contract PQRegistry is IPQRegistry {
    struct Entry { uint16 algoID; bytes32 commitment; uint8 policy; }

    mapping(address => Entry) private entries;

    function registerKey(uint16 algoID, bytes32 pkCommitment) external override {
        entries[msg.sender] = Entry(algoID, pkCommitment, entries[msg.sender].policy);
        emit KeyRegistered(msg.sender, algoID, pkCommitment, uint64(block.timestamp));
    }

    function revokeKey(bytes32 pkCommitment) external override {
        require(entries[msg.sender].commitment == pkCommitment, "commitment mismatch");
        entries[msg.sender].commitment = bytes32(0);
        emit KeyRevoked(msg.sender, pkCommitment, uint64(block.timestamp));
    }

    function setPolicy(uint8 policyFlags) external {
        entries[msg.sender].policy = policyFlags;
        emit PolicyUpdated(msg.sender, policyFlags);
    }

    function getKey(address acct) external view override returns (uint16 algoID, bytes32 pkCommitment, uint8 policyFlags) {
        Entry memory e = entries[acct];
        return (e.algoID, e.commitment, e.policy);
    }
}
