import 'babel-polyfill';
import { isBooleanType } from '../../src/vm/types/boolean';
import { deployAndInvoke, loadContract } from '../utils';

describe('CompareIn test', () => {
  test('test Compare In', async () => {
    const contract = loadContract('./test/python/compiled/compareInTest.avm');

    let response = await deployAndInvoke(contract, 1);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke(contract, 2);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke(contract, 3);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke(contract, 4);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke(contract, 5);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke(contract, 6);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke(contract, 7);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke(contract, 8);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke(contract, 9);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });
});
