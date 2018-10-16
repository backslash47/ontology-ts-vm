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
import * as Long from 'long';
import * as C from '../../../../common/constants';

// startOffset : start timestamp offset from genesis block
// endOffset :  end timestamp offset from genesis block
export function calcUnbindOng(balance: Long, startOffset: number, endOffset: number): Long {
  let amount: Long = Long.ZERO;
  if (startOffset >= endOffset) {
    return Long.ZERO;
  }
  if (startOffset < C.UNBOUND_DEADLINE) {
    let ustart = startOffset / C.UNBOUND_TIME_INTERVAL;
    let istart = startOffset % C.UNBOUND_TIME_INTERVAL;
    if (endOffset >= C.UNBOUND_DEADLINE) {
      endOffset = C.UNBOUND_DEADLINE;
    }
    const uend = endOffset / C.UNBOUND_TIME_INTERVAL;
    const iend = endOffset % C.UNBOUND_TIME_INTERVAL;
    while (ustart < uend) {
      amount = amount.add(Long.fromNumber(C.UNBOUND_TIME_INTERVAL - istart).mul(C.UNBOUND_GENERATION_AMOUNT[ustart]));
      ustart++;
      istart = 0;
    }
    amount = amount.add(Long.fromNumber(iend - istart).mul(C.UNBOUND_GENERATION_AMOUNT[ustart]));
  }

  return amount.mul(balance);
}
