import * as Long from 'long';

export function bigIntFromBytes(bytes: Buffer): Long {
  let data = Array.from(bytes.subarray(0));
  const b = data[data.length - 1];
  if (b >> 7 === 1) {
    data = data.concat(Array(8 - data.length).fill(255));
  }
  return Long.fromBytesLE(data);
}

export function bigIntToBytes(value: Long) {
  let data = value.toBytesLE();
  const negData = value.neg().toBytesLE();
  let stop;
  if (value.isNegative()) {
    stop = 255;
  } else {
    stop = 0;
  }
  let b = stop;
  let pos = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] !== stop) {
      b = value.isNegative() ? negData[i] : data[i];
      pos = i + 1;
      break;
    }
  }
  data = data.slice(0, pos);
  if (b >> 7 === 1) {
    data.push(value.isNegative() ? 255 : 0);
  }
  return new Buffer(data);
}
