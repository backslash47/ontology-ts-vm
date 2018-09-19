import * as Long from 'long';
import { bigIntToBytes } from '../../../src/common/utils';
import { ArrayType } from '../../../src/vm/types/array';
import { BooleanType } from '../../../src/vm/types/boolean';
import { ByteArrayType } from '../../../src/vm/types/byteArray';
import { IntegerType } from '../../../src/vm/types/integer';
import { InteropType } from '../../../src/vm/types/interop';
import { MapType } from '../../../src/vm/types/map';
import { StructType } from '../../../src/vm/types/struct';

describe('StackItem test', () => {
  test('Test boolean equals', async () => {
    const a = new BooleanType(false);
    const b = new BooleanType(true);
    const c = new BooleanType(true);
    const d = new BooleanType(false);

    expect(a.equals(d)).toBeTruthy();
    expect(a.equals(a)).toBeTruthy();
    expect(b.equals(c)).toBeTruthy();
    expect(b.equals(b)).toBeTruthy();

    expect(a.equals(b)).toBeFalsy();
    expect(b.equals(d)).toBeFalsy();
  });

  test('Test array equals', async () => {
    const a = new ArrayType();
    const b = new ArrayType();

    expect(a.equals(b)).toBeFalsy();
    expect(a.equals(a)).toBeTruthy();

    const i = new IntegerType(Long.ZERO);
    const j = new IntegerType(Long.ZERO);
    const k = new IntegerType(Long.ONE);

    const m1 = new ArrayType([i, j, k]);
    const m2 = new ArrayType([i, j, k]);

    expect(m1.equals(m2)).toBeFalsy();
    expect(m1.equals(m1)).toBeTruthy();
  });

  test('Test integer equals', async () => {
    const i = new IntegerType(Long.ZERO);
    const j = new IntegerType(Long.ZERO);

    expect(i.equals(j)).toBeTruthy();
    const k = new IntegerType(Long.fromInt(100000));
    expect(i.equals(k)).toBeFalsy();
  });

  test('Test new ByteArray', async () => {
    const i = new ByteArrayType(new Buffer('abcde'));
    const j = new ByteArrayType(new Buffer(['a', 'b', 'c', 'd', 'e'].join('')));

    expect(i.equals(j)).toBeTruthy();

    const k = new ByteArrayType();
    expect(k.equals(new ByteArrayType())).toBeTruthy();
  });

  test('Test struct equals', async () => {
    const a = new StructType();
    const b = new StructType();

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    const i = new IntegerType(Long.ZERO);
    const j = new IntegerType(Long.ZERO);
    const k = new IntegerType(Long.ONE);

    const m1 = new StructType([i, j, k]);
    const m2 = new StructType([i, j, k]);

    expect(m1.equals(m2)).toBeTruthy();
    expect(m1.equals(m1)).toBeTruthy();
  });

  test('Test map equals', async () => {
    const a = new MapType();
    const b = new MapType();

    expect(a.equals(b)).toBeFalsy();
    expect(a.equals(a)).toBeTruthy();

    const k1 = new IntegerType(Long.ZERO);
    const k2 = new IntegerType(Long.ZERO);

    const v1 = new ByteArrayType(new Buffer('abcde'));
    const v2 = new ByteArrayType(new Buffer(['a', 'b', 'c', 'd', 'e'].join('')));

    a.add(k1, v1);
    b.add(k2, v2);

    expect(a.equals(b)).toBeFalsy();
    expect(b.equals(b)).toBeTruthy();
  });

  test('Test interop equals', async () => {
    const a = new InteropType();
    const b = new InteropType();

    expect(a.equals(b)).toBeFalsy();
  });

  test('Test cmp', async () => {
    const a = new BooleanType(false);
    const b = new IntegerType(Long.ZERO);
    const c = new BooleanType(true);
    const d = new BooleanType(Long.ONE);

    expect(a.equals(b)).toBeFalsy();
    expect(c.equals(d)).toBeTruthy();

    const arr = new ArrayType();
    const stt = new StructType();
    expect(arr.equals(stt)).toBeFalsy();
    arr.add(new IntegerType(Long.ZERO));
    stt.add(new IntegerType(Long.ZERO));
    expect(arr.equals(stt)).toBeFalsy();

    const ba = new ByteArrayType(bigIntToBytes(Long.ZERO));
    expect(ba.equals(b)).toBeTruthy();

    const k = new ByteArrayType();
    expect(c.equals(k)).toBeFalsy();
  });
});
