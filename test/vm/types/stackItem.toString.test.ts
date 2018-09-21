import * as Long from 'long';
import { bigIntToBytes } from '../../../src/common/utils';
import { ArrayType } from '../../../src/vm/types/array';
import { BooleanType } from '../../../src/vm/types/boolean';
import { ByteArrayType } from '../../../src/vm/types/byteArray';
import { IntegerType } from '../../../src/vm/types/integer';
import { InteropType } from '../../../src/vm/types/interop';
import { MapType } from '../../../src/vm/types/map';
import { StackItem } from '../../../src/vm/types/stackItem';
import { StructType } from '../../../src/vm/types/struct';

// tslint:disable:max-line-length

describe('StackItem toString test', () => {
  test('Boolean', async () => {
    const a = new BooleanType(false);
    const b = new BooleanType(true);

    expect(a.toString()).toBe('Boolean(false)');
    expect(b.toString()).toBe('Boolean(true)');
  });

  test('Integer', async () => {
    const a = new IntegerType(Long.ONE);
    const b = new IntegerType(Long.ZERO);
    const c = new IntegerType(Long.fromString('9175052165852779861'));

    expect(a.toString()).toBe('Integer(1)');
    expect(b.toString()).toBe('Integer(0)');
    expect(c.toString()).toBe('Integer(9175052165852779861)');
  });

  test('ByteArray', async () => {
    const a = new ByteArrayType(new Buffer('', 'hex'));
    const b = new ByteArrayType(new Buffer('01', 'hex'));
    const c = new ByteArrayType(new Buffer('01020304', 'hex'));

    expect(a.toString()).toBe('ByteArray(0x)');
    expect(b.toString()).toBe('ByteArray(0x01)');
    expect(c.toString()).toBe('ByteArray(0x01020304)');
  });

  test('Struct', async () => {
    const first = new BooleanType(true);
    const second = new IntegerType(Long.fromString('9175052165852779861'));
    const third = new ByteArrayType(new Buffer('01020304', 'hex'));
    const fourth = new StructType([]);
    const fifth = new IntegerType(Long.fromString('10'));
    const sixth = new StructType([fifth]);

    const a = new StructType([first, second, third, fourth, sixth]);

    expect(a.toString()).toBe(
      'Struct([Boolean(true), Integer(9175052165852779861), ByteArray(0x01020304), Struct([]), Struct([Integer(10)])])'
    );
  });

  test('Array', async () => {
    const first = new BooleanType(true);
    const second = new IntegerType(Long.fromString('9175052165852779861'));
    const third = new ByteArrayType(new Buffer('01020304', 'hex'));
    const fourth = new ArrayType([]);
    const fifth = new IntegerType(Long.fromString('10'));
    const sixth = new ArrayType([fifth]);

    const a = new ArrayType([first, second, third, fourth, sixth]);

    expect(a.toString()).toBe(
      'Array([Boolean(true), Integer(9175052165852779861), ByteArray(0x01020304), Array([]), Array([Integer(10)])])'
    );
  });

  test('Map', async () => {
    const first = new BooleanType(true);
    const second = new IntegerType(Long.fromString('9175052165852779861'));
    const third = new ByteArrayType(new Buffer('01020304', 'hex'));
    const fourth = new ArrayType([]);
    const fifth = new IntegerType(Long.fromString('10'));
    const sixth = new ArrayType([fifth]);
    const seventh = new IntegerType(Long.ONE);

    const map: Map<StackItem, StackItem> = new Map();
    map.set(first, second);
    map.set(third, fourth);
    map.set(seventh, sixth);

    const a = new MapType(map);

    expect(a.toString()).toBe(
      'Map({Boolean(true): Integer(9175052165852779861), ByteArray(0x01020304): Array([]), Integer(1): Array([Integer(10)])})'
    );
  });

  test('Interop', async () => {
    const a = new InteropType({
      toArray() {
        return new Buffer('0001', 'hex');
      }
    });

    expect(a.toString()).toBe('Interop(0001)');
  });
});
