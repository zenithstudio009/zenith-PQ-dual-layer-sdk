import { PQSignature } from '../types';
import { toHex } from './hex';

/** PQ tail ABI-free encoding (self-describing):
 *  0x || '5a50' (ASCII 'ZP') || version(1B) || algoID(2B) || pkLen(2B) || sigLen(2B) || pubKey || signature
 */
export type Tail = {
  magic: 'ZP';
  version: number; // 1
  algoID: number;  // e.g., 0x0001 dilithium2, 0x0002 falcon512
  pubKey: Uint8Array;
  sig: Uint8Array;
};

export function encodeTail(s: PQSignature, algoID: number): string {
  const head = new Uint8Array([0x5a, 0x50, 0x01, (algoID >> 8) & 0xff, algoID & 0xff]);
  const pkLen = new Uint8Array([ (s.pubKey.length >> 8) & 0xff, s.pubKey.length & 0xff ]);
  const sgLen = new Uint8Array([ (s.sig.length >> 8) & 0xff, s.sig.length & 0xff ]);
  const bytes = new Uint8Array(head.length + 2 + 2 + s.pubKey.length + s.sig.length);
  bytes.set(head, 0);
  bytes.set(pkLen, head.length);
  bytes.set(sgLen, head.length + 2);
  bytes.set(s.pubKey, head.length + 4);
  bytes.set(s.sig, head.length + 4 + s.pubKey.length);
  return toHex(bytes);
}

export function appendTail(callDataHex: string, s: PQSignature, algoID = 0x0002): string {
  const tail = encodeTail(s, algoID);
  // Simple concat; contracts should read from end or use separate arg for tail
  return (callDataHex + tail.slice(2)) as `0x${string}`;
}

export function makeCommitment(pubKey: Uint8Array): `0x${string}` {
  // Keccak commitment; contracts can verify keccak(pubKey) == stored commitment
  const hex = '0x' + Buffer.from(pubKey).toString('hex');
  const { keccak256 } = require('ethers');
  return keccak256(hex);
}
