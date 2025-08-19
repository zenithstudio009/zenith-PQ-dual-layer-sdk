import { PQCProvider, PQKey, AlgoID, PQSignature, ChainCtx } from './types';
import { keccakHex, sha3Hex } from './chain/hashing';
import { appendTail } from './utils/calldata';
import { MockPQCProvider } from './crypto/provider-mock';

export class ZenithPQC {
  private provider: PQCProvider;
  private chain: ChainCtx;

  constructor(chain: ChainCtx, provider?: PQCProvider) {
    this.chain = chain;
    this.provider = provider ?? new MockPQCProvider();
  }

  static withMock(opts: ChainCtx) { return new ZenithPQC(opts, new MockPQCProvider()); }

  async generateKey(algo: AlgoID): Promise<PQKey> {
    return this.provider.generateKey(algo);
  }

  async sign(msg: Uint8Array, key: PQKey): Promise<Uint8Array> {
    return this.provider.sign(key.algo, key.secretKey, msg);
  }

  async verify(msg: Uint8Array, pubKey: Uint8Array, sig: Uint8Array, algo: AlgoID): Promise<boolean> {
    return this.provider.verify(algo, pubKey, msg, sig);
  }

  hashMessage(data: Uint8Array | string): Uint8Array {
    const hex = typeof data === 'string' ? data : '0x' + Buffer.from(data).toString('hex');
    const d = this.chain.hashFn === 'keccak256' ? keccakHex(hex) : sha3Hex(hex);
    return Uint8Array.from(Buffer.from(d.slice(2), 'hex'));
  }

  appendSignatureTail(callDataHex: string, s: PQSignature): string {
    return appendTail(callDataHex, s);
  }
}
