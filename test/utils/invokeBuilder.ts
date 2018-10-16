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
import { ProgramBuilder } from '../../src/common/program';
import { APPCALL, PACK } from '../../src/vm/opCode';

export function invokeContract(contractHash: Buffer, ...parameters: any[]) {
  const builder: ProgramBuilder = new ProgramBuilder();

  parameters.reverse().forEach((parameter) => pushParam(parameter, builder));

  builder.writeOpCode(APPCALL);
  builder.writeBytes(contractHash);

  return builder.getProgram();
}

function pushParam(parameter: any, builder: ProgramBuilder) {
  if (typeof parameter === 'number') {
    builder.pushNum(parameter);
  } else if (typeof parameter === 'string') {
    builder.pushBytes(new Buffer(parameter));
  } else if (typeof parameter === 'boolean') {
    builder.pushBool(parameter);
  } else if (parameter instanceof Buffer) {
    builder.pushBytes(parameter);
  } else if (parameter instanceof Map) {
    // const mapBytes = getMapBytes(parameter);
    // builder.pushBytes(mapBytes);
  } else if (Array.isArray(parameter)) {
    pushStruct(parameter, builder);
  } else {
    throw new Error('Unsupported param type');
  }
}

function pushStruct(parameters: any[], builder: ProgramBuilder) {
  parameters.reverse().forEach((parameter) => pushParam(parameter, builder));

  builder.pushNum(parameters.length);
  builder.writeOpCode(PACK);
}

// function getMapBytes(val: Map<string, any>) {
//   const writer = new Writer();

//   writer.writeUint8(MapType.id);
//   writer.writeUint8(val.size);

//   for (const k of val.keys()) {
//     writer.writeUint8(ByteArrayType.id);
//     writer.writeString(k);

//     const p = val.get(k);
//     if (p && p.type === 'ByteArray') {
//       writer.writeUint8(ByteArrayType.id);
//       writer.writeBytes(p.value);
//     } else if (p && p.type === 'String') {
//       writer.writeUint8(ByteArrayType.id);
//       writer.writeString(p.value);
//     } else if (p && p.type === 'Integer') {
//       writer.writeUint8(IntegerType.id);
//       writer.writeVarUint(Long.fromNumber(p.value));
//     } else if (p && p.type === 'Long') {
//       writer.writeUint8(IntegerType.id);
//       writer.writeVarUint(p.value);
//     } else {
//       throw new Error('Invalid params');
//     }
//   }
//   return writer.getBytes();
// }
