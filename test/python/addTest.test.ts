import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, testAndBuild } from '../utils';

describe('AddTest test', () => {
  test('AddTest', async () => {
    const contract = loadContract('./test/python/compiled/addTest.avm');

    let response = await testAndBuild(contract, [{ type: 'Integer', value: 2 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(4);

    response = await testAndBuild(contract, [{ type: 'Integer', value: 23234 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(23236);

    response = await testAndBuild(contract, [{ type: 'Integer', value: 0 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await testAndBuild(contract, [{ type: 'Integer', value: -112 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-110);
  });

  test('AddTest1', async () => {
    const contract = loadContract('./test/python/compiled/addTest1.avm');

    let response = await testAndBuild(contract, [
      { type: 'Integer', value: 1 },
      { type: 'Integer', value: 2 },
      { type: 'Integer', value: 3 },
      { type: 'Integer', value: 4 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(9);

    response = await testAndBuild(contract, [
      { type: 'Integer', value: 0 },
      { type: 'Integer', value: 0 },
      { type: 'Integer', value: 0 },
      { type: 'Integer', value: 2 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await testAndBuild(contract, [
      { type: 'Integer', value: -2 },
      { type: 'Integer', value: 3 },
      { type: 'Integer', value: -6 },
      { type: 'Integer', value: 2 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-2);
  });

  test('AddTest2', async () => {
    const contract = loadContract('./test/python/compiled/addTest2.avm');

    const response = await testAndBuild(contract, []);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(3);
  });

  test('AddTest4', async () => {
    const contract = loadContract('./test/python/compiled/addTest4.avm');

    const response = await testAndBuild(contract, [
      { type: 'Integer', value: 1 },
      { type: 'Integer', value: 2 },
      { type: 'Integer', value: 3 },
      { type: 'Integer', value: 4 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-9);
  });

  test('AddTestVoid', async () => {
    const contract = loadContract('./test/python/compiled/addTestVoid.avm');

    const response = await testAndBuild(contract, [{ type: 'Integer', value: 3 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('');
  });
});
