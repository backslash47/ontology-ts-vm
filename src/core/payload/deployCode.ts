import { Interop } from '../../vm/interfaces/interop';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from '../state/stateStore';

export interface DeployCodeOptions {
  code: Buffer;
  needStorage?: boolean;
  name?: string;
  version?: string;
  author?: string;
  email?: string;
  description?: string;
}

export class DeployCode implements StateValue, Interop {
  private code: Buffer;
  // private needStorage: boolean; - unused
  // private name: string; - unused
  // private version: string; - unused
  // private author: string; - unused
  // private email: string; - unused
  // private description: string; - unused

  constructor(options: DeployCodeOptions = { code: new Buffer('') }) {
    this.code = options.code;
    // this.needStorage = options.needStorage; - unused
    // this.name = options.name; - unused
    // this.author = options.author; - unused
    // this.email = options.email; - unused
    // this.description = options.description; - unused
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
