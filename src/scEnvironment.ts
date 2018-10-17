/*
 * Copyright (C) 2018 Matus Zamborsky & The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as Long from 'long';
import { Address } from './common/address';
import { LedgerStore } from './core/ledgerStore';
import { DeployCode } from './core/payload/deployCode';
import { ST_CONTRACT } from './core/state/dataEntryPrefix';
import { StateStore } from './core/state/stateStore';
import { Transaction } from './core/transaction';
import { Inspect } from './smartcontract/context';
import { RuntimeLedgerStore } from './smartcontract/runtime/runtimeLedgerStore';
import { RuntimeStateStore } from './smartcontract/runtime/runtimeStateStore';
import { SmartContract } from './smartcontract/smartContract';
import { Wallet } from './wallet';

export interface EnvironmentOptions {
  ledgerStore?: LedgerStore;
  store?: StateStore;
}

export interface ExecuteOptions {
  time?: number;
  tx?: Transaction;
  gas?: Long;
  inspect?: Inspect;
  wallet?: Wallet;
  enableSecurity?: boolean;
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

    this.ledgerStore.deployContract(address, deployCode);

    return address.toArray();
  }

  async execute(
    code: Buffer,
    {
      time = 10,
      tx = new Transaction(),
      gas = Long.fromNumber(100000),
      inspect,
      wallet,
      enableSecurity
    }: ExecuteOptions = {}
  ) {
    if (wallet !== undefined) {
      wallet.signTransaction(tx);
    }

    const sc = new SmartContract({
      time,
      tx,
      gas,
      stateStore: this.store,
      store: this.ledgerStore,
      enableSecurity
    });

    const vmService = sc.newExecuteEngine(code);

    const result = await vmService.invoke({ inspect });
    const notifications = sc.getNotifications();
    const logs = sc.getLogs();

    return { result, notifications, logs };
  }
}
