import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, strToHex, testAndBuild } from '../utils';

describe('BinOps test', () => {
  test('BinOpsTest', async () => {
    const contract = loadContract('./test/python/compiled/binOpsTest.avm');

    let response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('&') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 4 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(4);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('|') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 3 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(7);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('|') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 8 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(12);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('^') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 4 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(0);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('^') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 2 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(6);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('>>') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 0 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(16);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('>>') },
      { type: 'Integer', value: 11 },
      { type: 'Integer', value: 1 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(5);

    await expect(
      testAndBuild(contract, [
        { type: 'String', value: strToHex('<<') },
        { type: 'Integer', value: 16 },
        { type: 'Integer', value: -2 }
      ])
    ).rejects.toBeTruthy();

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('<<') },
      { type: 'Integer', value: 4 },
      { type: 'Integer', value: 5 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(128);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('%') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 2 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(0);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('%') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 11 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(5);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('//') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 2 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(8);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('//') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 7 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('/') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 7 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('~') },
      { type: 'Integer', value: 16 },
      { type: 'Integer', value: 0 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-17);

    response = await testAndBuild(contract, [
      { type: 'String', value: strToHex('~') },
      { type: 'Integer', value: -3 },
      { type: 'Integer', value: 0 }
    ]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);
  });
});
