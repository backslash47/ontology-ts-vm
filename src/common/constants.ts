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
import { TracedError } from './error';

export const ONT_NAME = 'ONT Token';
export const ONT_SYMBOL = 'ONT';
export const ONT_DECIMALS = 1;
export const ONT_TOTAL_SUPPLY = Long.fromString('1000000000');

export const ONG_NAME = 'ONG Token';
export const ONG_SYMBOL = 'ONG';
export const ONG_DECIMALS = 9;
export const ONG_TOTAL_SUPPLY = Long.fromString('1000000000000000000');

export const GENESIS_BLOCK_TIMESTAMP = new Date(2018, 6, 30, 0, 0, 0, 0).getTime();

// ont/ong unbound model constants
export const UNBOUND_TIME_INTERVAL = 31536000;

export const UNBOUND_GENERATION_AMOUNT = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export const UNBOUND_DEADLINE = (() => {
  let count = Long.fromNumber(0);
  for (const m of UNBOUND_GENERATION_AMOUNT) {
    count = count.add(m);
  }
  count = count.mul(Long.fromNumber(UNBOUND_TIME_INTERVAL));

  const numInterval = UNBOUND_GENERATION_AMOUNT.length;

  if (
    UNBOUND_GENERATION_AMOUNT[numInterval - 1] !== 1 ||
    !(
      count.subtract(Long.fromNumber(UNBOUND_TIME_INTERVAL)).lessThan(ONT_TOTAL_SUPPLY) &&
      ONT_TOTAL_SUPPLY.lessThanOrEqual(count)
    )
  ) {
    throw new TracedError('incompatible constants setting');
  }

  return UNBOUND_TIME_INTERVAL * numInterval - count.subtract(ONT_TOTAL_SUPPLY).toNumber();
})();
