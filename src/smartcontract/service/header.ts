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
import { isBlock } from '../../core/block';
import { Header, isHeader } from '../../core/header';
import { popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

/**
 * HeaderGetHash put header's hash to vm stack
 */
export function headerGetHash(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[HeaderGetHash] Wrong type!');
  }

  pushData(engine, data.getHash().toArray());
}

/**
 * HeaderGetVersion put header's version to vm stack
 */
export function headerGetVersion(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);
  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getVersion());
}

/**
 * HeaderGetPrevHash put header's prevblockhash to vm stack
 */
export function headerGetPrevHash(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getPrevBlockHash().toArray());
}

/**
 * HeaderGetMerkleRoot put header's merkleroot to vm stack
 */
export function headerGetMerkleRoot(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getTransactionsRoot().toArray());
}

/**
 * HeaderGetIndex put header's height to vm stack
 */
export function headerGetIndex(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getHeight());
}

/**
 * HeaderGetTimestamp put header's timestamp to vm stack
 */
export function headerGetTimestamp(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getTimestamp());
}

/**
 * HeaderGetConsensusData put header's consensus data to vm stack
 */
export function headerGetConsensusData(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getConsensusData());
}

/**
 * HeaderGetNextConsensus put header's consensus to vm stack
 */
export function headerGetNextConsensus(service: VmService, engine: ExecutionEngine) {
  const d = popInteropInterface(engine);

  let data: Header;
  if (isBlock(d)) {
    data = d.getHeader();
  } else if (isHeader(d)) {
    data = d;
  } else {
    throw new Error('[headerGetVersion] Wrong type!');
  }

  pushData(engine, data.getNextBookkeeper().toArray());
}
