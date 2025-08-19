# @zenith/pqc-sdk

Chain-agnostic Post-Quantum Cryptography SDK for Web3 (L2-first).

## Features (MVP)
- PQ key generation (via pluggable provider; liboqs recommended)
- PQ signing/verification (Dilithium2, Falcon512)
- Chain-aware hashing (Keccak256 for EVM)
- Calldata tail packing (`algoID + pubKey + signature`)
- On-chain PQ key registry helpers (Ethers.js)

## Install (local dev)
```bash
npm install
npm run build
```
> Production setup: add a real liboqs provider implementation and publish to npm.

## Quickstart
```ts
import { ZenithPQC, algorithms, makeCommitment } from "@zenith/pqc-sdk";
import { Hex, toHex } from "./src/utils/hex";

// Initialize with mock provider (for dev). Swap with LibOQSProvider in production.
const zen = new ZenithPQC({ hashFn: 'keccak256' });

const key = await zen.generateKey(algorithms.falcon512);
const msg = new TextEncoder().encode("hello");
const sig = await zen.sign(msg, key);

const ok = await zen.verify(msg, key.pubKey, sig, key.algo);
console.log("verified:", ok);

const commitment = makeCommitment(key.pubKey); // store on-chain via registry
```

## On-chain (EVM) – PQ Registry ABI
- `registerKey(uint16 algoID, bytes32 commitment)`
- `revokeKey(bytes32 commitment)`
- `getKey(address acct) -> (uint16 algoID, bytes32 commitment, uint8 policyFlags)`

See `contracts/PQRegistry.sol` for a reference implementation.

## Notes
- This repo ships with a **MockPQCProvider** to unblock integration without liboqs.
- For production, implement `LibOQSProvider` and wire to liboqs-node / WASM.
