import { pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

/**
 * GetCodeContainer push current transaction to vm stack
 */
export function getCodeContainer(service: VmService, engine: ExecutionEngine) {
  pushData(engine, service.getTx());
}

/**
 * GetExecutingAddress push current context to vm stack
 */
export function getExecutingAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().currentContext();
  if (context === undefined) {
    throw new Error('Current context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}

/**
 * GetExecutingAddress push previous context to vm stack
 */
export function getCallingAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().callingContext();
  if (context === undefined) {
    throw new Error('Calling context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}

/**
 * GetExecutingAddress push entry call context to vm stack
 */
export function getEntryAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().entryContext();
  if (context === undefined) {
    throw new Error('Entry context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}
