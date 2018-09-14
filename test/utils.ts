import { readFileSync } from 'fs';
import { InspectData } from '../src/smartcontract/context';
import { OpCode } from '../src/vm/opCode';

export function loadContract(path: string) {
  const codeBuffer = readFileSync(path);
  const codeString = codeBuffer.toString();
  return new Buffer(codeString, 'hex');
}

export function opLogger(data: InspectData) {
  // tslint:disable-next-line:no-console
  console.log(data.contractAddress.toArray().toString('hex') + ': ' + data.opName);
  return Promise.resolve(true);
}
