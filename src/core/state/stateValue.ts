import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';

export interface StateValue {
  serialize(w: Writer): void;
  deserialize(r: Reader): void;
}
