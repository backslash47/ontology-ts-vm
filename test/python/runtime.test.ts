import 'babel-polyfill';
import { bigIntFromBytes } from '../../src/common/utils';
import { isBooleanType } from '../../src/vm/types/boolean';
import { isIntegerType } from '../../src/vm/types/integer';
import { Wallet } from '../../src/wallet';
import { deployAndInvoke, loadContract } from '../utils';

describe('Runtime test', () => {
  test('test', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/runtimeTest.avm');
    const wallet = new Wallet('2a400b882757e616ed238d0d289884544542f33407d26b01b53964d3a768539e');

    let response = await deployAndInvoke({ contract }, 'get_time', 1);
    expect(response.result.getBigInteger().toJSNumber()).toBe(10); // value should be the current timestamp

    response = await deployAndInvoke({ contract, wallet }, 'check_witness', wallet.address.toArray());
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 'log', 'hello');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
    expect(response.logs).toHaveLength(1);
    expect(response.logs[0].message).toBe('hello');

    response = await deployAndInvoke({ contract }, 'notify', 1234);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
    expect(response.notifications).toHaveLength(1);
    expect(bigIntFromBytes(new Buffer(response.notifications[0].states, 'hex')).toJSNumber()).toBe(1234);

    response = await deployAndInvoke({ contract }, 'get_trigger', 1234);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0); // always 0 for Ontology
  });
});
