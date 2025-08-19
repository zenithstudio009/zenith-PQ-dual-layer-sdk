import { PQCProvider, AlgoID, PQKey } from '../types';

// WARNING: Mock provider for development only (NOT cryptographically secure).
function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(Math.max(a.length, b.length));
  for (let i = 0; i < out.length; i++) out[i] = (a[i % a.length] ^ b[i % b.length]) & 0xff;
  return out;
}

export class MockPQCProvider implements PQCProvider {
  async generateKey(algo: AlgoID): Promise<PQKey> {
    const sk = crypto.getRandomValues(new Uint8Array(32));
    const pk = crypto.getRandomValues(new Uint8Array(32));
    return { algo, pubKey: pk, secretKey: sk };
  }
  async sign(algo: AlgoID, sk: Uint8Array, msg: Uint8Array): Promise<Uint8Array> {
    return xor(sk, msg);
  }
  async verify(algo: AlgoID, pk: Uint8Array, msg: Uint8Array, sig: Uint8Array): Promise<boolean> {
    // In mock: we cannot reconstruct without sk; accept length match as "ok" for dev plumbing.
    return sig.length > 0 && msg.length > 0;
  }
}
