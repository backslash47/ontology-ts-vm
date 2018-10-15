import * as bigInt from 'big-integer';
import { createHash } from 'crypto';

// tslint:disable:no-bitwise

export function bigIntToBytes(data: bigInt.BigInteger) {
  let bs = data.toArray(256).value;

  if (data.isZero()) {
    return new Buffer('');
  }

  const b = bs[0];

  if (data.isNegative()) {
    for (let i = 0; i < bs.length; i++) {
      bs[i] = 255 ^ bs[i];
    }

    const temp = bigInt.fromArray(bs, 256);
    const temp2 = temp.add(bigInt.one);
    bs = temp2.toArray(256).value;

    bs = bs.reverse();

    if (b >> 7 === 1) {
      bs = bs.concat(255);
    }
  } else {
    bs = bs.reverse();
    if (b >> 7 === 1) {
      bs = bs.concat(0);
    }
  }

  return new Buffer(bs);
}

export function bigIntFromBytes(ba: Buffer): bigInt.BigInteger {
  const l = ba.length;
  if (l === 0) {
    return bigInt.zero;
  }

  let bytes = Array.from(ba.subarray(0));
  bytes = bytes.reverse();

  if (bytes[0] >> 7 === 1) {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = 255 ^ bytes[i];
    }

    const temp = bigInt.fromArray(bytes, 256);
    const temp2 = temp.add(bigInt(1));
    bytes = temp2.toArray(256).value;
    return bigInt.fromArray(bytes, 256).negate();
  }

  return bigInt.fromArray(bytes, 256);
}

export function reverseBuffer(src: Buffer) {
  const buffer = Buffer.allocUnsafe(src.length);

  for (let i = 0, j = src.length - 1; i <= j; ++i, --j) {
    buffer[i] = src[j];
    buffer[j] = src[i];
  }

  return buffer;
}

export function sha256(data: Buffer) {
  const sh = createHash('sha256');
  sh.update(data);
  return sh.digest();
}

export function md160(data: Buffer) {
  const sh = createHash('ripemd160');
  sh.update(data);
  return sh.digest();
}
