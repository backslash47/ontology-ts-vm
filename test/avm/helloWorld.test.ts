import 'babel-polyfill';
import { readFileSync } from 'fs';
import * as Long from 'long';
import { ProgramBuilder } from '../../src/common/program';
import { LedgerStore } from '../../src/core/ledgerStore';
import { DeployCode } from '../../src/core/payload/deployCode';
import { ST_CONTRACT } from '../../src/core/state/dataEntryPrefix';
import { StateStore } from '../../src/core/state/stateStore';
import { Transaction } from '../../src/core/transaction';
import { NeoVmService } from '../../src/smartcontract/neoVmService';
import { RuntimeStateStore } from '../../src/smartcontract/runtime/runtimeStateStore';
import { SmartContract } from '../../src/smartcontract/smartContract';
import { APPCALL, PACK, PUSH0 } from '../../src/vm/opCode';
import { Writer } from '../../src/vm/utils/writer';

// tslint:disable : no-console
// tslint:disable : max-line-length
describe('Hello world test', () => {
  test('Simple execute', async () => {
    const codeBuffer = readFileSync('./test/avm/simpleFalse.avm');
    const codeString = codeBuffer.toString();
    const code = new Buffer(codeString, 'hex');
    const deployCode = new DeployCode({ code });

    const stateStore = new RuntimeStateStore();
    stateStore.add(ST_CONTRACT, new Buffer('1cff5924c1b004ad69618151260ec50b03e6c8e1', 'hex'), deployCode);

    const sc = new SmartContract({
      time: 10,
      tx: new Transaction(),
      gas: Long.fromNumber(100000),
      stateStore
    });

    const vmService = sc.newExecuteEngine(
      scCall(new Buffer('1cff5924c1b004ad69618151260ec50b03e6c8e1', 'hex'), 'Hello')
    );

    const result = vmService.invoke();
    console.log(result);
  });
});

function scCall(contractHash: Buffer, method: string) {
  const b = new ProgramBuilder();

  // params
  b.writeOpCode(PUSH0);
  b.writeOpCode(PACK);
  b.pushBytes(new Buffer(method));
  b.writeOpCode(APPCALL);
  b.writeBytes(contractHash);

  return b.getProgram();
}
