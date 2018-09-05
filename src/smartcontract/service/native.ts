import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

export function nativeInvoke(service: VmService, engine: ExecutionEngine) {
  throw new Error('Unsupported');
}
