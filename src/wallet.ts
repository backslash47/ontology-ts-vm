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
import { Address } from './common/address';
import { programFromParams, programFromPubKey } from './common/program';
import { sha256 } from './common/utils';
import { RawSig, Transaction } from './core/transaction';
import { PrivateKey } from './crypto/privateKey';
import { PublicKey } from './crypto/publicKey';
import { Writer } from './vm/utils/writer';

export class Wallet {
  privateKey: PrivateKey;
  publicKey: PublicKey;
  address: Address;

  constructor(privateKey: PrivateKey | string | Buffer) {
    if (privateKey instanceof PrivateKey) {
      this.privateKey = privateKey;
    } else {
      this.privateKey = new PrivateKey(privateKey);
    }

    this.publicKey = this.privateKey.getPublicKey();
    this.address = Address.fromPubKey(this.publicKey);
  }

  signTransaction(tx: Transaction) {
    const w = new Writer();
    tx.serialize(w);

    const hash = sha256(sha256(w.getBytes()));

    const signature = this.privateKey.sign(hash);

    const invokationSript = programFromParams([signature.serialize()]);
    const verificationScript = programFromPubKey(this.publicKey);

    const sig = new RawSig(invokationSript, verificationScript);
    tx.addSig(sig);
  }
}
