import { ArrayType } from '../../../src/vm/types/array';

describe('Array test', () => {
  test('Test self array', async () => {
    const a = new ArrayType();
    const b = new ArrayType([a]);
    a.add(b);

    expect(a.equals(b)).toBeFalsy();
  });
});
