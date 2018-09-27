import * as bigInt from 'big-integer';
import { IntegerType } from '../../../src/vm/types/integer';
import { MAX_STRUCT_DEPTH, StructType } from '../../../src/vm/types/struct';

describe('Struct test', () => {
  test('Test struct clone', async () => {
    const s = new StructType();
    let k = new StructType([new IntegerType(bigInt.one)]);
    for (let i = 0; i < MAX_STRUCT_DEPTH - 2; i++) {
      k = new StructType([k]);
    }
    s.add(k);

    s.clone();
  });
});
