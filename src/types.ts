export type AlgoID = 'dilithium2' | 'falcon512' | 'sphincs128f';

export const algorithms = {
  dilithium2: 'dilithium2' as AlgoID,
  falcon512: 'falcon512' as AlgoID,
  sphincs128f: 'sphincs128f' as AlgoID,
};

export interface PQKey {
  algo: AlgoID;
  pubKey: Uint8Array;
  secretKey: Uint8Array;
}

export interface PQSignature {
  algo: AlgoID;
  pubKey: Uint8Array;
  sig: Uint8Array;
}

export interface PQCProvider {
  generateKey(algo: AlgoID): Promise<PQKey>;
  sign(algo: AlgoID, sk: Uint8Array, msg: Uint8Array): Promise<Uint8Array>;
  verify(algo: AlgoID, pk: Uint8Array, msg: Uint8Array, sig: Uint8Array): Promise<boolean>;
}

export interface ChainCtx {
  hashFn: 'keccak256' | 'sha3_256';
}
