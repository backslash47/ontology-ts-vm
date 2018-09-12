import * as Long from 'long';
import { Address } from './common/address';
import { LedgerStore } from './core/ledgerStore';
import { DeployCode } from './core/payload/deployCode';
import { ST_CONTRACT } from './core/state/dataEntryPrefix';
import { StateStore } from './core/state/stateStore';
import { Transaction } from './core/transaction';
import { RuntimeLedgerStore } from './smartcontract/runtime/runtimeLedgerStore';
import { RuntimeStateStore } from './smartcontract/runtime/runtimeStateStore';
import { SmartContract } from './smartcontract/smartContract';

export interface EnvironmentOptions {
  ledgerStore?: LedgerStore;
  store?: StateStore;
}

export interface ExecuteOptions {
  time?: number;
  tx?: Transaction;
  gas?: Long;
}

export class ScEnvironment {
  ledgerStore: LedgerStore;
  store: StateStore;

  constructor({ ledgerStore = new RuntimeLedgerStore(), store = new RuntimeStateStore() }: EnvironmentOptions = {}) {
    this.ledgerStore = ledgerStore;
    this.store = store;
  }

  deployContract(contract: Buffer) {
    const address = Address.parseFromVmCode(contract);

    const deployCode = new DeployCode({ code: contract });
    this.store.add(ST_CONTRACT, address.toArray(), deployCode);

    return address.toArray();
  }

  execute(code: Buffer, { time = 10, tx = new Transaction(), gas = Long.fromNumber(100000) }: ExecuteOptions = {}) {
    const sc = new SmartContract({
      time,
      tx,
      gas,
      stateStore: this.store
    });

    const vmService = sc.newExecuteEngine(code);

    const result = vmService.invoke();
    const notifications = sc.getNotifications();

    return { result, notifications };
  }
}
