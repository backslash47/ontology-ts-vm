import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from './stateValue';

export class StateBase implements StateValue {
  stateVersion: number;

  serialize(w: Writer) {
    w.writeUint8(this.stateVersion);
  }

  deserialize(r: Reader) {
    try {
      this.stateVersion = r.readByte();
    } catch (e) {
      throw new Error(`[StateBase], StateBase Deserialize failed: ${e}`);
    }
  }
}
