import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { loadContract, strToHex, testAndBuild, testAndBuildMethod } from '../utils';

describe('Concat test', () => {
  test('test Concat1', async () => {
    const contract = loadContract('./test/python/compiled/concatTest.avm');

    const response = await testAndBuild(contract, []);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');
  });

  test('test Concat2', async () => {
    const contract = loadContract('./test/python/compiled/concatTest2.avm');

    let response = await testAndBuildMethod(contract, 'concat', [
      { type: 'String', value: strToHex('hello') },
      { type: 'String', value: strToHex('world') }
    ]);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await testAndBuildMethod(contract, 'blah', [
      { type: 'String', value: strToHex('hello') },
      { type: 'String', value: strToHex('world') }
    ]);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await testAndBuildMethod(contract, 'concat', [{ type: 'String', value: strToHex('blah') }]);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await testAndBuildMethod(contract, 'concat', [
      { type: 'String', value: strToHex('hello') },
      { type: 'String', value: strToHex('world') },
      { type: 'String', value: strToHex('third') }
    ]);
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await testAndBuildMethod(contract, 'concat', [
      { type: 'Integer', value: 1 },
      { type: 'String', value: strToHex('neo') }
    ]);
    expect(response.result.getByteArray().toString()).toBe('\x01neo');

    response = await testAndBuildMethod(contract, 'concat', [
      { type: 'String', value: '' },
      { type: 'String', value: strToHex('neo') }
    ]);
    expect(response.result.getByteArray().toString()).toBe('neo');
  });

  test('test Take', async () => {
    const contract = loadContract('./test/python/compiled/takeTest.avm');

    let response = await testAndBuild(contract, [{ type: 'Integer', value: 2 }]);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('he');

    response = await testAndBuild(contract, [{ type: 'Integer', value: 0 }]);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await testAndBuild(contract, [{ type: 'Integer', value: 12 }]);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld12');

    await expect(testAndBuild(contract, [{ type: 'Integer', value: 40 }])).rejects.toBeTruthy();

    await expect(testAndBuild(contract, [{ type: 'Integer', value: -2 }])).rejects.toBeTruthy();
  });
});
