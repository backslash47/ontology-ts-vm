import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { loadContract, deployAndInvoke } from '../utils';

describe('Concat test', () => {
  test('test Concat1', async () => {
    const contract = loadContract('./test/python/compiled/concatTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');
  });

  test('test Concat2', async () => {
    const contract = loadContract('./test/python/compiled/concatTest2.avm');

    let response = await deployAndInvoke(contract, 'concat', ['hello', 'world']);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await deployAndInvoke(contract, 'blah', ['hello', 'world']);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke(contract, 'concat', ['blah']);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke(contract, 'concat', ['hello', 'world', 'third']);
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await deployAndInvoke(contract, 'concat', [1, 'neo']);
    expect(response.result.getByteArray().toString()).toBe('\x01neo');

    response = await deployAndInvoke(contract, 'concat', ['', 'neo']);
    expect(response.result.getByteArray().toString()).toBe('neo');
  });

  test('test Take', async () => {
    const contract = loadContract('./test/python/compiled/takeTest.avm');

    let response = await deployAndInvoke(contract, 2);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('he');

    response = await deployAndInvoke(contract, 0);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke(contract, 12);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld12');

    await expect(deployAndInvoke(contract, 40)).rejects.toBeTruthy();

    await expect(deployAndInvoke(contract, -2)).rejects.toBeTruthy();
  });
});
