import * as Long from 'long';

export function safeAdd(x: Long, y: Long) {
  if (y.gt(Long.MAX_UNSIGNED_VALUE.subtract(x))) {
    throw new Error('overflow detected');
  }
  return x.add(y);
}
