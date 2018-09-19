export class Stack<T> {
  private store: T[];

  constructor() {
    this.store = [];
  }

  count(): number {
    return this.store.length;
  }

  push(val: T) {
    this.store.push(val);
  }

  pop(): T | undefined {
    return this.store.pop();
  }

  /**
   * Peek returns the element (n) far in the stack beginning from
   * the top of the stack.
   * 	n = 0 => will return the element on top of the stack.
   */
  peek(n: number): T | undefined {
    if (n >= this.store.length) {
      return undefined;
    }

    return this.store[this.store.length - n - 1];
  }

  /**
   * TODO: check if properly implemented.
   * @param index
   * @param t
   */
  insert(index: number, t: T | undefined) {
    if (t === undefined) {
      return;
    }

    if (index > this.store.length) {
      return;
    }

    index = this.store.length - index;

    this.store.splice(index, 0, t);
  }

  remove(index: number) {
    if (index >= this.store.length) {
      return undefined;
    }

    index = this.store.length - index;

    return this.store.splice(index - 1, 1)[0];
  }

  /**
   * Beware the index is from the end
   * @param index
   * @param t
   */
  set(index: number, t: T) {
    if (index >= this.store.length) {
      return;
    }

    this.store[index] = t;
  }

  swap(i: number, j: number) {
    if (i >= this.store.length) {
      return;
    }

    if (j >= this.store.length) {
      return;
    }

    const temp = this.store[i];
    this.store[i] = this.store[j];
    this.store[j] = temp;
  }

  copyTo(stack: Stack<T>) {
    stack.store = [...stack.store, ...this.store];
  }
}
