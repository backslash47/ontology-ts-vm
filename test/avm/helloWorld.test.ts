import 'babel-polyfill';
import { readFileSync } from 'fs';
import * as Long from 'long';
import { DeployCode } from '../../src/core/payload/deployCode';
import { ST_CONTRACT } from '../../src/core/state/dataEntryPrefix';
import { Transaction } from '../../src/core/transaction';
import { RuntimeStateStore } from '../../src/smartcontract/runtime/runtimeStateStore';
import { SmartContract } from '../../src/smartcontract/smartContract';
import { isIntegerType } from '../../src/vm/types/integer';

// tslint:disable : no-console
// tslint:disable : max-line-length
describe('Hello world test', () => {
  test('Hello', async () => {
    const codeBuffer = readFileSync('./test/avm/helloWorld.avm');
    const codeString = codeBuffer.toString();
    const code = new Buffer(codeString, 'hex');
    const deployCode = new DeployCode({ code });

    const stateStore = new RuntimeStateStore();
    stateStore.add(ST_CONTRACT, new Buffer('362cb5608b3eca61d4846591ebb49688900fedd0', 'hex'), deployCode);

    const sc = new SmartContract({
      time: 10,
      tx: new Transaction(),
      gas: Long.fromNumber(100000),
      stateStore
    });

    // call Hello method on contract 362cb5608b3eca61d4846591ebb49688900fedd0 with param World
    const callCode = new Buffer('05576f726c6451c10548656c6c6f67362cb5608b3eca61d4846591ebb49688900fedd0', 'hex');

    const vmService = sc.newExecuteEngine(callCode);

    const result = vmService.invoke();
    const notifications = sc.getNotifications();

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeTruthy();

    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toHaveLength(1);
    expect(notifications[0].states[0]).toBe(new Buffer('World').toString('hex'));
  });

  test('No hello', async () => {
    const codeBuffer = readFileSync('./test/avm/helloWorld.avm');
    const codeString = codeBuffer.toString();
    const code = new Buffer(codeString, 'hex');
    const deployCode = new DeployCode({ code });

    const stateStore = new RuntimeStateStore();
    stateStore.add(ST_CONTRACT, new Buffer('362cb5608b3eca61d4846591ebb49688900fedd0', 'hex'), deployCode);

    const sc = new SmartContract({
      time: 10,
      tx: new Transaction(),
      gas: Long.fromNumber(100000),
      stateStore
    });

    // call Hallo method on contract 362cb5608b3eca61d4846591ebb49688900fedd0 with param World
    const callCode = new Buffer('05576f726c6451c10548616c6c6f67362cb5608b3eca61d4846591ebb49688900fedd0', 'hex');

    const vmService = sc.newExecuteEngine(callCode);

    const result = vmService.invoke();
    const notifications = sc.getNotifications();

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeFalsy();

    expect(notifications).toHaveLength(0);
  });
});
