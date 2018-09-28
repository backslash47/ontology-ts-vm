import 'babel-polyfill';
import { RuntimeStateStore } from '../../src/smartcontract/runtime/runtimeStateStore';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Storage test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/storageTest.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke({ contract, store }, 'sput', 'something', 'blah');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('blah');

    response = await deployAndInvoke({ contract, store }, 'sdel', 'something', 'blah');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');
  });

  test('test 2', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/storageTest.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke({ contract, store }, 'sput', 100, 10000000000);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(10000000000);

    response = await deployAndInvoke({ contract, store }, 'sdel', 100, 10000000000);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');
  });
});
