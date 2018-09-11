import * as Long from 'long';
import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';

/**
 * LogEventArgs describe smart contract event log struct
 */
export interface LogEventArgs {
  txHash: Uint256;
  contractAddress: Address;
  message: string;
}

/**
 * FIXME: implement
 */
export function pushSmartCodeEvent(txHash: Uint256, errcode: Long, action: string, result: LogEventArgs) {
  throw new Error('Unsupported');
}

export const EVENT_LOG = 'Log';
