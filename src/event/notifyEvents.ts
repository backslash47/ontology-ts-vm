import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';

// NotifyEventInfo describe smart contract event notify info struct
export interface NotifyEventInfo {
  contractAddress: Address;
  states: any;
}

export interface LogEventInfo {
  contractAddress: Address;
  tx: Uint256;
  message: string;
}
