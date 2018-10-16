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
