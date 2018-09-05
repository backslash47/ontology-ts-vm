import { Address } from '../common/address';
import { LedgerStore } from '../core/ledgerStore';
import { isDeployCode } from '../core/payload/deployCode';
import { ST_CONTRACT } from '../core/state/dataEntryPrefix';
import { StateItem } from '../core/state/stateStore';
import { Transaction } from '../core/transaction';
import { PublicKey } from '../crypto/publicKey';
import { Signature } from '../crypto/signature';
import { NotifyEventInfo } from '../event/notifyEvents';
import { MAX_BYTEARRAY_SIZE } from '../vm/consts';
import { ExecutionContext } from '../vm/executionContext';
import { evaluationStackCount, peekStackItem, popByteArray, pushData } from '../vm/func/common';
import { ExecutionEngine, FAULT } from '../vm/interfaces/engine';
import * as O from '../vm/opCode';
import { isArrayType } from '../vm/types/array';
import { StackItem } from '../vm/types/stackItem';
import { isStructType } from '../vm/types/struct';
import { CloneCache } from './cloneCache';
import { MAX_STACK_SIZE, OPCODE_GAS } from './consts';
import { ContextRef, VmService } from './context';
import * as errors from './errors';
import { gasPrice } from './gasCost';
import { ServiceMap } from './serviceMap';

const BYTE_ZERO_20: Buffer = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

interface NeoVmServiceOptions {
  store: LedgerStore;
  cloneCache: CloneCache;
  contextRef: ContextRef;
  code: Buffer;
  tx: Transaction;
  time: number;
  height: number;
  engine: ExecutionEngine;
}

export class NeoVmService implements VmService {
  private store: LedgerStore;
  private cloneCache: CloneCache;
  private contextRef: ContextRef;

  private notifications: NotifyEventInfo[];
  private code: Buffer;
  private tx: Transaction;
  private time: number;
  private height: number;
  private engine: ExecutionEngine;

  constructor(options: NeoVmServiceOptions) {
    this.store = options.store;
    this.cloneCache = options.cloneCache;
    this.contextRef = options.contextRef;
    this.code = options.code;
    this.tx = options.tx;
    this.time = options.time;
    this.height = options.height;
    this.engine = options.engine;
  }

  getTx() {
    return this.tx;
  }

  getTime() {
    return this.time;
  }

  getEngine() {
    return this.engine;
  }

  getContextRef() {
    return this.contextRef;
  }

  getCloneCache() {
    return this.cloneCache;
  }

  getStore() {
    return this.store;
  }

  // Invoke a smart contract
  invoke(): StackItem | undefined {
    if (this.code.length === 0) {
      throw errors.ERR_EXECUTE_CODE;
    }
    this.contextRef.pushContext({ contractAddress: Address.parseFromVmCode(this.code), code: this.code });
    this.engine.pushContext(new ExecutionContext(this.code));

    while (true) {
      // check the execution step count
      if (!this.contextRef.checkExecStep()) {
        throw errors.VM_EXEC_STEP_EXCEED;
      }
      // if (this.engine.getContexts().length === 0 || this.engine.getContext() === nil) {
      // 	break;
      // }
      if (this.engine.getContext().getInstructionPointer() >= this.engine.getContext().getCode().length) {
        break;
      }
      this.engine.executeCode();

      if (this.engine.getContext().getInstructionPointer() < this.engine.getContext().getCode().length) {
        if (!this.checkStackSize()) {
          throw errors.ERR_CHECK_STACK_SIZE;
        }
      }
      if (this.engine.getOpCode() >= O.PUSHBYTES1 && this.engine.getOpCode() <= O.PUSHBYTES75) {
        if (!this.contextRef.checkUseGas(OPCODE_GAS)) {
          throw errors.ERR_GAS_INSUFFICIENT;
        }
      } else {
        this.engine.validateOp();

        const price = gasPrice(this.engine, this.engine.getOpExec().name);
        if (!this.contextRef.checkUseGas(price)) {
          throw errors.ERR_GAS_INSUFFICIENT;
        }
      }
      switch (this.engine.getOpCode()) {
        case O.VERIFY:
          if (evaluationStackCount(this.engine) < 3) {
            throw new Error('[VERIFY] Too few input parameters ');
          }
          const pubKey = popByteArray(this.engine);
          const key = PublicKey.deserialize(pubKey);

          const sig = popByteArray(this.engine);
          const data = popByteArray(this.engine);

          const signature = Signature.deserialize(sig);
          if (!signature.verify(key, data)) {
            pushData(this.engine, false);
          } else {
            pushData(this.engine, true);
          }
          break;
        case O.SYSCALL:
          this.systemCall();
          break;
        case O.APPCALL:
          let address = this.engine
            .getContext()
            .getReader()
            .readBytes(20);
          if (address.compare(BYTE_ZERO_20) === 0) {
            if (evaluationStackCount(this.engine) < 1) {
              throw new Error(`[Appcall] Too few input parameters:${evaluationStackCount(this.engine)}`);
            }

            try {
              address = popByteArray(this.engine);
            } catch (e) {
              throw new Error(`[Appcall] pop contract address error:${e}`);
            }

            if (address.length !== 20) {
              throw new Error(`[Appcall] pop contract address len != 20:${address}`);
            }
          }

          const code = this.getContract(address);
          const service = this.contextRef.newExecuteEngine(code);
          this.engine.getEvaluationStack().copyTo(service.getEngine().getEvaluationStack());
          const result = service.invoke();

          if (result !== undefined) {
            pushData(this.engine, result);
          }
          break;
        default:
          const err = this.engine.stepInto();
          if (err !== undefined) {
            throw new Error(`[NeoVmService] vm execute error! ${err}`);
          }
          if (this.engine.getState() === FAULT) {
            throw errors.VM_EXEC_FAULT;
          }
      }
    }
    this.contextRef.popContext();
    this.contextRef.pushNotifications(this.notifications);
    if (this.engine.getEvaluationStack().count() !== 0) {
      return this.engine.getEvaluationStack().peek(0);
    }
  }

  /**
   * SystemCall provide register service for smart contract to interaction with blockchain
   */
  systemCall() {
    const serviceName = this.engine
      .getContext()
      .getReader()
      .readVarString(MAX_BYTEARRAY_SIZE);
    const service = ServiceMap.get(serviceName);
    if (service === undefined) {
      throw new Error(`[SystemCall] service not support: ${serviceName}`);
    }
    const price = gasPrice(this.engine, serviceName);

    if (!this.contextRef.checkUseGas(price)) {
      throw errors.ERR_GAS_INSUFFICIENT;
    }
    if (service.validator !== undefined) {
      try {
        service.validator(this.engine);
      } catch (e) {
        throw new Error(`[SystemCall] service validator error: ${e}`);
      }
    }

    try {
      service.execute(this, this.engine);
    } catch (e) {
      throw new Error(`[SystemCall] service execute error: ${e}`);
    }
  }

  /**
   * DUMMY: this method will call other SC.
   * Need to devise a way how to use it in test VM
   * @param address
   */
  getContract(address: Buffer): Buffer {
    let item: StateItem;
    try {
      item = this.cloneCache.getStore().tryGet(ST_CONTRACT, address);
    } catch (e) {
      throw new Error('[getContract] Get contract context error!');
    }

    // log.Debugf("invoke contract address:%x", scommon.ToArrayReverse(address))
    if (item === undefined) {
      throw errors.CONTRACT_NOT_EXIST;
    }
    const contract = item.value;

    if (!isDeployCode(contract)) {
      throw errors.DEPLOYCODE_TYPE_ERROR;
    }

    return contract.getCode();
  }

  checkStackSize(): boolean {
    let size = 0;
    const opCode = this.engine.getOpCode();

    if (opCode < O.PUSH16) {
      size = 1;
    } else {
      switch (opCode) {
        case O.DEPTH:
        case O.DUP:
        case O.OVER:
        case O.TUCK:
          size = 1;
          break;
        case O.UNPACK:
          if (this.engine.getEvaluationStack().count() === 0) {
            return false;
          }
          const item = peekStackItem(this.engine);
          if (isArrayType(item)) {
            size = item.count();
          } else if (isStructType(item)) {
            size = item.count();
          }
      }
    }
    size += this.engine.getEvaluationStack().count() + this.engine.getAltStack().count();
    if (size > MAX_STACK_SIZE) {
      return false;
    }
    return true;
  }

  addNotification(event: NotifyEventInfo) {
    this.notifications.push(event);
  }
}
