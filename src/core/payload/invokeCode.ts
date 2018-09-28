import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from '../state/stateStore';

export class InvokeCode implements StateValue {
  private code: Buffer;

  constructor(code: Buffer = new Buffer('')) {
    this.code = code;
  }

  serialize(w: Writer) {
    try {
      w.writeVarBytes(this.code);
    } catch (e) {
      throw new Error(`InvokeCode Code Serialize failed: ${e}`);
    }
  }

  deserialize(r: Reader) {
    try {
      const code = r.readVarBytes();

      this.code = code;
    } catch (e) {
      throw new Error(`InvokeCode Code Deserialize failed: ${e}`);
    }
  }
}
