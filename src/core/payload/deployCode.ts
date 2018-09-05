import { Interop } from '../../vm/interfaces/interop';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from '../state/stateValue';

export interface DeployCodeOptions {
  code: Buffer;
  needStorage: boolean;
  name: string;
  version: string;
  author: string;
  email: string;
  description: string;
}

export class DeployCode implements StateValue, Interop {
  private code: Buffer;
  private needStorage: boolean;
  private name: string;
  private version: string;
  private author: string;
  private email: string;
  private description: string;

  constructor(options: DeployCodeOptions) {
    this.code = options.code;
    this.needStorage = options.needStorage;
    this.name = options.name;
    this.author = options.author;
    this.email = options.email;
    this.description = options.description;
  }

  serialize(w: Writer) {
    throw new Error('Unsuported');
  }

  deserialize(r: Reader) {
    throw new Error('Unsuported');
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  getCode() {
    return this.code;
  }
}

export function isDeployCode(item: any): item is DeployCode {
  return item instanceof DeployCode;
}
