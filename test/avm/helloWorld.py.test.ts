import 'babel-polyfill';
import { ScEnvironment } from '../../src/scEnvironment';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, opLogger, strToHex } from '../utils';
import { invokeMethod } from '../utils/invokeBuilder';

describe('Hello world Python test', () => {
  test('Hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.py.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    const call = invokeMethod(address, 'Hello', [{ type: 'String', value: strToHex('World') }]);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBigInteger().toNumber()).toBe(33);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toBe(strToHex('World'));
  });

  test('No hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.py.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    // call wrong method
    const call = invokeMethod(address, 'Hallo', [{ type: 'String', value: strToHex('World') }]);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeFalsy();
    expect(notifications).toHaveLength(0);
  });
});
