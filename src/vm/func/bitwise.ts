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
import { popBigInt, popStackItem, pushData } from './common';

export function opInvert(e: ExecutionEngine) {
  const i = popBigInt(e);
  pushData(e, i.not());
}

export function opEqual(e: ExecutionEngine) {
  const b1 = popStackItem(e);
  const b2 = popStackItem(e);
  pushData(e, b1.equals(b2));
}
