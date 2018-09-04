import { Address } from '../core/address';
import { LedgerStore } from '../core/ledgerStore';
import { Transaction } from '../core/transaction';
import { NotifyEventInfo } from '../event/notifyEvents';
import { VMEngine } from '../vm/vmEngine';
import { CloneCache } from './cloneCache';
import { MAX_EXECUTE_ENGINE, VM_STEP_LIMIT } from './consts';
import { Context, ContextRef, VmService } from './context';
import { NeoVmService } from './neoVmService';

/**
 * Config describe smart contract need parameters configuration
 */
export class Config {
  time: number; // current block timestamp
  height: number; // current block height
  tx: Transaction; // current transaction
}

export class SmartContract implements ContextRef {
  private contexts: Context[]; // all execute smart contract context
  private cloneCache: CloneCache; // state cache
  private store: LedgerStore; // ledger store
  private config: Config;
  private notifications: NotifyEventInfo[]; // all execute smart contract event notify info
  private gas: Long;
  private execStep: number;

  // PushContext push current context to smart contract
  pushContext(context: Context) {
    this.contexts.push(context);
  }

  /**
   * CurrentContext return smart contract current context
   */
  currentContext() {
    if (this.contexts.length < 1) {
      throw new Error();
    }
    return this.contexts[this.contexts.length - 1];
  }

  /**
   * CallingContext return smart contract caller context
   */
  callingContext() {
    if (this.contexts.length < 2) {
      return undefined;
    }
    return this.contexts[this.contexts.length - 2];
  }

  // EntryContext return smart contract entry entrance context
  entryContext() {
    if (this.contexts.length < 1) {
      return undefined;
    }
    return this.contexts[0];
  }

  // PopContext pop smart contract current context
  popContext() {
    if (this.contexts.length > 1) {
      this.contexts.pop();
    }
  }

  // PushNotifications push smart contract event info
  pushNotifications(notifications: NotifyEventInfo[]) {
    this.notifications.push(...notifications);
  }

  checkExecStep(): boolean {
    if (this.execStep >= VM_STEP_LIMIT) {
      return false;
    }
    this.execStep += 1;
    return true;
  }

  checkUseGas(gas: Long): boolean {
    if (this.gas.lt(gas)) {
      return false;
    }
    this.gas = this.gas.sub(gas);
    return true;
  }

  checkContexts(): boolean {
    if (this.contexts.length > MAX_EXECUTE_ENGINE) {
      return false;
    }
    return true;
  }

  /**
   * Execute is smart contract execute manager
   * According different vm type to launch different service
   * @param code
   */
  newExecuteEngine(code: Buffer): VmService {
    if (!this.checkContexts()) {
      throw new Error('engine over max limit!');
    }
    const service = new NeoVmService({
      store: this.store,
      cloneCache: this.cloneCache,
      contextRef: this,
      code,
      tx: this.config.tx,
      time: this.config.time,
      height: this.config.height,
      engine: new VMEngine()
    });
    return service;
  }

  /**
   * CheckWitness check whether authorization correct
   * If address is wallet address, check whether in the signature addressed list
   * Else check whether address is calling contract address
   * Param address: wallet address or contract address
   * @param this
   * @param
   * @param SmartContract
   */
  checkWitness(address: Address) {
    if (this.checkAccountAddress(address) || this.checkContractAddress(address)) {
      return true;
    }
    return false;
  }

  checkAccountAddress(address: Address): boolean {
    try {
      const addresses = this.config.tx.getSignatureAddresses();

      for (const v of addresses) {
        if (v.equals(address)) {
          return true;
        }
      }

      return false;
    } catch (e) {
      // log.Errorf("get signature address error:%v", err)
      return false;
    }
  }

  checkContractAddress(address: Address): boolean {
    const callingContext = this.callingContext();

    if (callingContext !== undefined && callingContext.contractAddress.equals(address)) {
      return true;
    }
    return false;
  }
}
