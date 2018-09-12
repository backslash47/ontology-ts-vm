import 'babel-polyfill';
import { ScEnvironment } from '../../src/scEnvironment';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract } from '../utils';

describe('Hello world test', () => {
  test('Hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    const call = Buffer.concat([new Buffer('05576f726c6451c10548656c6c6f67', 'hex'), address]);
    const { result, notifications } = env.execute(call);

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeTruthy();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toHaveLength(1);
    expect(notifications[0].states[0]).toBe(new Buffer('World').toString('hex'));
  });

  test('No hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    // call wrong method
    const call = Buffer.concat([new Buffer('05576f726c6451c10548616c6c6f67', 'hex'), address]);
    const { result, notifications } = env.execute(call);

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeFalsy();
    expect(notifications).toHaveLength(0);
  });
});
