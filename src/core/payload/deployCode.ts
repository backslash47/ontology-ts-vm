import { StateValue } from '../state/stateValue';

export class DeployCode implements StateValue {
  private code: Buffer;
  private needStorage: boolean;
  private name: string;
  private version: string;
  private author: string;
  private email: string;
  private description: string;

  serialize(w: any) {
    throw new Error('Unsuported');
  }

  deserialize(r: any) {
    throw new Error('Unsuported');
  }

  getCode() {
    return this.code;
  }
}

export function isDeployCode(item: StateValue): item is DeployCode {
  return item instanceof DeployCode;
}
