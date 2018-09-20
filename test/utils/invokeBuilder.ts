import * as Long from 'long';
import { ProgramBuilder } from '../../src/common/program';
import { APPCALL, PACK } from '../../src/vm/opCode';
import { ByteArrayType } from '../../src/vm/types/byteArray';
import { IntegerType } from '../../src/vm/types/integer';
import { MapType } from '../../src/vm/types/map';
import { StructType } from '../../src/vm/types/struct';
import { Writer } from '../../src/vm/utils/writer';

export type ParameterType = 'Boolean' | 'Integer' | 'Long' | 'ByteArray' | 'Struct' | 'Map' | 'String';

export interface Parameter {
  type: ParameterType;
  value: any;
}

export function invokeMethod(contractHash: Buffer, method: string, parameters: Parameter[]) {
  const builder: ProgramBuilder = new ProgramBuilder();

  parameters.reverse().forEach(({ type, value }) => {
    switch (type) {
      case 'Boolean':
        builder.pushBool(value);
        break;

      case 'Integer':
        builder.pushNum(value);
        break;

      case 'String':
        builder.pushBytes(new Buffer(value, 'hex'));
        break;

      case 'ByteArray':
        builder.pushBytes(value);
        break;

      case 'Map':
        const mapBytes = getMapBytes(value);
        builder.pushBytes(mapBytes);
        break;

      case 'Struct':
        const structBytes = getStructBytes(value);
        builder.pushBytes(structBytes);
        break;
      default:
        throw new Error('Unsupported param type: ' + type);
    }
  });

  builder.pushNum(parameters.length);
  builder.writeOpCode(PACK);
  builder.pushBytes(new Buffer(method));

  builder.writeOpCode(APPCALL);
  builder.writeBytes(contractHash);

  return builder.getProgram();
}

function getStructBytes(val: any[]) {
  const writer = new Writer();

  writer.writeUint8(StructType.id);
  writer.writeUint8(val.length);

  for (const v of val) {
    if (typeof v === 'string') {
      // consider as hex string
      writer.writeUint8(ByteArrayType.id);
      writer.writeBytes(new Buffer(v, 'hex'));
    } else if (typeof v === 'number') {
      writer.writeUint8(ByteArrayType.id);
      writer.writeVarUint(Long.fromNumber(v));
    } else {
      throw new Error('Invalid params');
    }
  }

  return writer.getBytes();
}

function getMapBytes(val: Map<string, Parameter>) {
  const writer = new Writer();

  writer.writeUint8(MapType.id);
  writer.writeUint8(val.size);

  for (const k of val.keys()) {
    writer.writeUint8(ByteArrayType.id);
    writer.writeString(k);

    const p = val.get(k);
    if (p && p.type === 'ByteArray') {
      writer.writeUint8(ByteArrayType.id);
      writer.writeBytes(p.value);
    } else if (p && p.type === 'String') {
      writer.writeUint8(ByteArrayType.id);
      writer.writeString(p.value);
    } else if (p && p.type === 'Integer') {
      writer.writeUint8(IntegerType.id);
      writer.writeVarUint(Long.fromNumber(p.value));
    } else if (p && p.type === 'Long') {
      writer.writeUint8(IntegerType.id);
      writer.writeVarUint(p.value);
    } else {
      throw new Error('Invalid params');
    }
  }
  return writer.getBytes();
}
