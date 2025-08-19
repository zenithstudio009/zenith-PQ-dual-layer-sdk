// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PQRegistry.sol";

library PQVerify {
    struct PQTail { 
        uint16 algoID;
        bytes pubKey;
        bytes signature;
    }

    // Parse a compact tail appended to calldata (see SDK encodeTail).
    // For MVP, pass it in as a separate argument (bytes tail) and decode here.
    function decodeTail(bytes calldata tail) internal pure returns (PQTail memory t) {
        // MVP: ABI-encoded (uint16, bytes, bytes)
        (uint16 algo, bytes memory pk, bytes memory sig) = abi.decode(tail, (uint16, bytes, bytes));
        t.algoID = algo; t.pubKey = pk; t.signature = sig;
    }

    function checkCommitment(address sender, IPQRegistry reg, PQTail memory t) internal view returns (bool) {
        (uint16 algoID, bytes32 commit, ) = reg.getKey(sender);
        require(algoID == t.algoID, "algo mismatch");
        require(keccak256(t.pubKey) == commit, "pubkey mismatch");
        return true;
    }
}
