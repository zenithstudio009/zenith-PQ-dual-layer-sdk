export type Hex = `0x${string}`;

export function toHex(u8: Uint8Array): Hex {
  return ('0x' + Buffer.from(u8).toString('hex')) as Hex;
}

export function fromHex(hex: Hex): Uint8Array {
  return Uint8Array.from(Buffer.from(hex.slice(2), 'hex'));
}
