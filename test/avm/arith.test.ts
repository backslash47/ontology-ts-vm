import 'babel-polyfill';
import { ScEnvironment } from '../../src/scEnvironment';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, opLogger } from '../utils';

describe('Arith test', () => {
  test('Add', async () => {
    const contract = loadContract('./test/avm/arith.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    // call Add with params 3 and 4
    const call = Buffer.concat([new Buffer('545352c10341646467', 'hex'), address]);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBigInteger().toNumber()).toBe(7);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toHaveLength(1);
    expect(notifications[0].states[0]).toBe('07');
  });
});
