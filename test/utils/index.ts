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
import * as bigInt from 'big-integer';
import { readFileSync } from 'fs';
import * as Long from 'long';
import { bigIntToBytes } from '../../src/common/utils';
import { EnvironmentOptions, ExecuteOptions, ScEnvironment } from '../../src/scEnvironment';
import { InspectData } from '../../src/smartcontract/context';
import { invokeContract } from './invokeBuilder';

export function loadContract(path: string) {
  const codeBuffer = readFileSync(path);
  const codeString = codeBuffer.toString();
  return new Buffer(codeString, 'hex');
}

export function opLogger(data: InspectData) {
  // tslint:disable-next-line:no-console
  console.log('' + data.contexts.length + ' ' + data.contractAddress.toArray().toString('hex') + ': ' + data.opName);
  return Promise.resolve(true);
}

export function strToHex(value: string) {
  return new Buffer(value).toString('hex');
}

export function num2hex(num: Long) {
  return bigIntToBytes(bigInt(num.toString())).toString('hex');
}

export function hexToStr(value: string) {
  return new Buffer(value, 'hex').toString();
}

export interface DeployAndInvokeOptions extends EnvironmentOptions, ExecuteOptions {
  contract: Buffer;
}

export async function deployAndInvoke(options: DeployAndInvokeOptions, ...params: any[]) {
  const { contract, ledgerStore, store, ...rest } = options;

  const env = new ScEnvironment({ ledgerStore, store });
  const address = env.deployContract(contract);

  const call = invokeContract(address, ...params);
  return await env.execute(call, { ...rest, inspect: opLogger });
}
