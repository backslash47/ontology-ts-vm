import { Address } from '../../../../common/address';

export const BYTE_FALSE = new Buffer('\x00');
export const BYTE_TRUE = new Buffer('\x01');

export const OntContractAddress = Address.parseFromBytes(new Buffer('0000000000000000000000000000000000000001', 'hex'));
export const OngContractAddress = Address.parseFromBytes(new Buffer('0000000000000000000000000000000000000002', 'hex'));
export const OntIDContractAddress = Address.parseFromBytes(
  new Buffer('0000000000000000000000000000000000000003', 'hex')
);
export const ParamContractAddress = Address.parseFromBytes(
  new Buffer('0000000000000000000000000000000000000004', 'hex')
);
export const AuthContractAddress = Address.parseFromBytes(
  new Buffer('0000000000000000000000000000000000000006', 'hex')
);
export const GovernanceContractAddress = Address.parseFromBytes(
  new Buffer('0000000000000000000000000000000000000007', 'hex')
);
