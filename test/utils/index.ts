import { readFileSync } from 'fs';
import { ExecuteOptions, ScEnvironment, EnvironmentOptions } from '../../src/scEnvironment';
import { InspectData } from '../../src/smartcontract/context';
import { invokeContract } from './invokeBuilder';

export function loadContract(path: string) {
  const codeBuffer = readFileSync(path);
  const codeString = codeBuffer.toString();
  return new Buffer(codeString, 'hex');
}

export function opLogger(data: InspectData) {
  // tslint:disable-next-line:no-console
  // console.log('' + data.contexts.length + ' ' + data.contractAddress.toArray().toString('hex') + ': ' + data.opName);
  return Promise.resolve(true);
}

export function strToHex(value: string) {
  return new Buffer(value).toString('hex');
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
