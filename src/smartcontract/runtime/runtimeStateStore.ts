import { StateItem, StateStore, StateValue } from '../../core/state/stateStore';

export class RuntimeStateStore implements StateStore {
  data: Map<string, StateValue>;

  constructor() {
    this.data = new Map();
  }
  add(prefix: number, key: Buffer, value: StateValue): void {
    const k = buildWholeKey(prefix, key);

    this.data.set(k, value);
  }
  getOrAdd(prefix: number, key: Buffer, value: StateValue): StateValue {
    const k = buildWholeKey(prefix, key);

    if (this.data.has(k)) {
      return this.data.get(k)!;
    } else {
      this.add(prefix, key, value);
      return value;
    }
  }
  get(prefix: number, key: Buffer): StateItem {
    const k = buildWholeKey(prefix, key);

    const item = this.data.get(k);

    if (item === undefined) {
      throw new Error('StackItem not found');
    }

    return {
      prefix,
      key,
      value: item,
      state: 0
    };
  }
  delete(prefix: number, key: Buffer): void {
    const k = buildWholeKey(prefix, key);

    this.data.delete(k);
  }
  find(prefix: number, key: Buffer): StateItem[] {
    try {
      const item = this.get(prefix, key);
      return [item];
    } catch (e) {
      return [];
    }
  }
}

function buildWholeKey(prefix: number, key: Buffer): string {
  const prefixBuffer = new Buffer(1);
  prefixBuffer.writeUInt8(prefix, 0);

  return Buffer.concat([prefixBuffer, key]).toString('hex');
}
