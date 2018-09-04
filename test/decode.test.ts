import 'babel-polyfill';
import { readFileSync } from 'fs';
import { WasmParser } from '../src/wasm/wasmParser';

// tslint:disable : no-console
describe('Decoder test', () => {
  test('simple', async () => {
    // const input = readFileSync('./test/source.wast', 'utf8');
    const input = readFileSync('./test/source.wasm');
    const parser = new WasmParser();
    const module = parser.parseWasm(input);

    console.log(JSON.stringify(module, null, 2));
  });
});
