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
