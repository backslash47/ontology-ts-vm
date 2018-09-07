import 'babel-polyfill';
import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

// tslint:disable : no-console
describe('Bytebuffer test', () => {
  test('Long interaction', async () => {
    const buffer = new ByteBuffer();

    buffer.writeUint64(Long.ZERO);
  });

  test('Capacity handling', async () => {
    const buffer = new ByteBuffer(4);

    buffer.writeInt32(0);
    buffer.flip();

    const result = new Buffer(buffer.toBuffer());

    expect(result.length).toBe(4);
  });
});
