import { readFileSync } from 'fs';
import { InspectData } from '../../src/smartcontract/context';
import { OpCode } from '../../src/vm/opCode';

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

export function hexToStr(value: string) {
  return new Buffer(value, 'hex').toString();
}
