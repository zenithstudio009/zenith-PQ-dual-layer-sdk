import { keccak256 } from 'ethers';
import { sha3_256 } from 'js-sha3';

export function keccakHex(hexData: string): string {
  if (!hexData.startsWith('0x')) throw new Error('hex must start with 0x');
  return keccak256(hexData);
}

export function sha3Hex(hexData: string): string {
  if (!hexData.startsWith('0x')) throw new Error('hex must start with 0x');
  const bytes = Buffer.from(hexData.slice(2), 'hex');
  const digest = sha3_256.update(bytes).hex();
  return '0x' + digest;
}
