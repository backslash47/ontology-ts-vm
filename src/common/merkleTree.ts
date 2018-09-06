import { createHash, Hash } from 'crypto';
import { Uint256 } from './uint256';

export function computeMerkleRoot(hashes: Uint256[]): Uint256 {
  if (hashes.length === 0) {
    return new Uint256();
  }

  let temp: Uint256;

  while (hashes.length !== 1) {
    const n = hashes.length / 2;

    let sha: Hash;
    for (let i = 0; i < n; i++) {
      sha = createHash('sha256');

      sha.update(hashes[2 * i].toArray());
      sha.update(hashes[2 * i + 1].toArray());
      temp = Uint256.parseFromBytes(sha.digest());

      sha = createHash('sha256');
      sha.update(temp.toArray());
      hashes[i] = Uint256.parseFromBytes(sha.digest());
    }
    if (hashes.length === 2 * n + 1) {
      sha = createHash('sha256');
      sha.update(hashes[2 * n].toArray());
      sha.update(hashes[2 * n].toArray());
      temp = Uint256.parseFromBytes(sha.digest());

      sha = createHash('sha256');
      sha.update(temp.toArray());
      hashes[n] = Uint256.parseFromBytes(sha.digest());

      hashes = hashes.slice(0, n + 1);
    } else {
      hashes = hashes.slice(0, n);
    }
  }

  return hashes[0];
}
