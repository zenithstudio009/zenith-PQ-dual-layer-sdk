import { describe, it, expect } from 'vitest';
import { ZenithPQC } from '../src/zenith';
import { algorithms } from '../src/types';

describe('ZenithPQC mock flow', () => {
  it('generates, signs, verifies', async () => {
    const zen = ZenithPQC.withMock({ hashFn: 'keccak256' });
    const key = await zen.generateKey(algorithms.falcon512);
    const msg = new TextEncoder().encode('hello');
    const sig = await zen.sign(msg, key);
    const ok = await zen.verify(msg, key.pubKey, sig, key.algo);
    expect(ok).toBe(true);
  });
});
