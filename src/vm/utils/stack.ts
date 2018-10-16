/*
 * Copyright (C) 2018 Matus Zamborsky & The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */
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
    const length = this.store.length;
    if (i >= length) {
      return;
    }

    if (j >= length) {
      return;
    }

    const temp = this.store[length - i - 1];
    this.store[length - i - 1] = this.store[length - j - 1];
    this.store[length - j - 1] = temp;
  }

  copyTo(stack: Stack<T>) {
    stack.store = [...stack.store, ...this.store];
  }
}
