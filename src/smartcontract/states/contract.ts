import { Address } from '../../common/address';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';

export interface ContractOptions {
  version: number;
  address: Address;
  method: string;
  args: Buffer;
}

export class Contract {
  static deserialize(r: Reader): Contract {
    const version = r.readByte();

    const address = new Address();
    address.deserialize(r);

    const method = r.readVarBytes();
    const args = r.readVarBytes();

    return new Contract({
      version,
      address,
      method: method.toString(),
      args
    });
  }
  version: number;
  address: Address;
  method: string;
  args: Buffer;

  constructor({ version, address, method, args }: ContractOptions) {
    this.version = version;
    this.address = address;
    this.method = method;
    this.args = args;
  }

  serialize(w: Writer) {
    w.writeUint8(this.version);

    this.address.serialize(w);

    w.writeVarBytes(new Buffer(this.method));
    w.writeVarBytes(new Buffer(this.args));
  }
}
