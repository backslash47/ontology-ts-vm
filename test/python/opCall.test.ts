import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('OpCall test', () => {
  test('test', async () => {
    const contract = loadContract('./test/python/compiled/opCallTest.avm');

    let response = await deployAndInvoke(contract, 'omin', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke(contract, 'omin', -4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-4);

    response = await deployAndInvoke(contract, 'omin', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke(contract, 'omax', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke(contract, 'omax', -4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke(contract, 'omax', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(16);

    response = await deployAndInvoke(contract, 'oabs', 0, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke(contract, 'oabs', -4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke(contract, 'sha1', 'abc', 4);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\xa9\x99>6G\x06\x81j\xba>%qxP\xc2l\x9c\xd0\xd8\x9d'
    );

    response = await deployAndInvoke(contract, 'sha256', 'abc', 4);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\xbax\x16\xbf\x8f\x01\xcf\xeaAA@\xde]\xae"#\xb0\x03a\xa3\x96\x17z\x9c\xb4\x10\xffa\xf2\x00\x15\xad'
    );

    response = await deployAndInvoke(contract, 'hash160', 'abc', 4);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\xbb\x1b\xe9\x8c\x14$D\xd7\xa5j\xa3\x98\x1c9B\xa9x\xe4\xdc3'
    );

    response = await deployAndInvoke(contract, 'hash256', 'abc', 4);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      'O\x8bB\xc2-\xd3r\x9bQ\x9b\xa6\xf6\x8d-\xa7\xcc[-`m\x05\xda\xedZ\xd5\x12\x8c\xc0>lcX'
    );
  });
});
