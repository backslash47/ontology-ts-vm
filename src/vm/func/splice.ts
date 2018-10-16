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
import { ExecutionEngine } from '../interfaces/engine';
import { popByteArray, popInt, pushData } from './common';

export function opCat(e: ExecutionEngine) {
  const b2 = popByteArray(e);

  const b1 = popByteArray(e);

  const r = Buffer.concat([b1, b2]);
  pushData(e, r);
}

export function opSubStr(e: ExecutionEngine) {
  const count = popInt(e);
  const index = popInt(e);

  const arr = popByteArray(e);

  const b = arr.slice(index, index + count);
  pushData(e, b);
}

export function opLeft(e: ExecutionEngine) {
  const count = popInt(e);

  const s = popByteArray(e);
  const b = s.slice(0, count);
  pushData(e, b);
}

/**
 * TODO: check if correct
 * @param e
 */
export function opRight(e: ExecutionEngine) {
  const count = popInt(e);

  const arr = popByteArray(e);

  const b = arr.slice(arr.length - count, arr.length);
  pushData(e, b);
}

export function opSize(e: ExecutionEngine) {
  const b = popByteArray(e);
  pushData(e, b.length);
}
