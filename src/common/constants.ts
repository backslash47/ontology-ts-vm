import * as Long from 'long';

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
    throw new Error('incompatible constants setting');
  }

  return UNBOUND_TIME_INTERVAL * numInterval - count.subtract(ONT_TOTAL_SUPPLY).toNumber();
})();
