import * as AR from './func/arithmetic';
import * as A from './func/array';
import { opEqual, opInvert } from './func/bitwise';
import { opThrow, opThrowIfNot } from './func/exceptions';
import { opCall, opJmp, opNop, opRet } from './func/flowControl';
import { opHash } from './func/hash';
import { opPushData } from './func/pushData';
import { opCat, opLeft, opRight, opSize, opSubStr } from './func/splice';
import * as S from './func/stack';
import * as V from './func/validate';
import { ExecutionEngine } from './interfaces/engine';
import * as O from './opCode';

export interface OpExec {
  opCode: O.OpCode;
  name: string;
  exec?: (e: ExecutionEngine) => void;
  validator?: (e: ExecutionEngine) => void;
}

export const OpExecList: Map<O.OpCode, OpExec> = new Map([
  // control flow
  [O.PUSH0, { opCode: O.PUSH0, name: 'PUSH0', exec: opPushData }],
  [O.PUSHBYTES1, { opCode: O.PUSHBYTES1, name: 'PUSHBYTES1', exec: opPushData }],
  [O.PUSHBYTES75, { opCode: O.PUSHBYTES75, name: 'PUSHBYTES75', exec: opPushData }],
  [O.PUSHDATA1, { opCode: O.PUSHDATA1, name: 'PUSHDATA1', exec: opPushData }],
  [O.PUSHDATA2, { opCode: O.PUSHDATA2, name: 'PUSHDATA2', exec: opPushData }],
  [O.PUSHDATA4, { opCode: O.PUSHDATA4, name: 'PUSHDATA4', exec: opPushData, validator: V.validatorPushData4 }],
  [O.PUSHM1, { opCode: O.PUSHM1, name: 'PUSHM1', exec: opPushData }],
  [O.PUSH1, { opCode: O.PUSH1, name: 'PUSH1', exec: opPushData }],
  [O.PUSH2, { opCode: O.PUSH2, name: 'PUSH2', exec: opPushData }],
  [O.PUSH3, { opCode: O.PUSH3, name: 'PUSH3', exec: opPushData }],
  [O.PUSH4, { opCode: O.PUSH4, name: 'PUSH4', exec: opPushData }],
  [O.PUSH5, { opCode: O.PUSH5, name: 'PUSH5', exec: opPushData }],
  [O.PUSH6, { opCode: O.PUSH6, name: 'PUSH6', exec: opPushData }],
  [O.PUSH7, { opCode: O.PUSH7, name: 'PUSH7', exec: opPushData }],
  [O.PUSH8, { opCode: O.PUSH8, name: 'PUSH8', exec: opPushData }],
  [O.PUSH9, { opCode: O.PUSH9, name: 'PUSH9', exec: opPushData }],
  [O.PUSH10, { opCode: O.PUSH10, name: 'PUSH10', exec: opPushData }],
  [O.PUSH11, { opCode: O.PUSH11, name: 'PUSH11', exec: opPushData }],
  [O.PUSH12, { opCode: O.PUSH12, name: 'PUSH12', exec: opPushData }],
  [O.PUSH13, { opCode: O.PUSH13, name: 'PUSH13', exec: opPushData }],
  [O.PUSH14, { opCode: O.PUSH14, name: 'PUSH14', exec: opPushData }],
  [O.PUSH15, { opCode: O.PUSH15, name: 'PUSH15', exec: opPushData }],
  [O.PUSH16, { opCode: O.PUSH16, name: 'PUSH16', exec: opPushData }],

  // Control
  [O.NOP, { opCode: O.NOP, name: 'NOP', exec: opNop }],
  [O.JMP, { opCode: O.JMP, name: 'JMP', exec: opJmp }],
  [O.JMPIF, { opCode: O.JMPIF, name: 'JMPIF', exec: opJmp }],
  [O.JMPIFNOT, { opCode: O.JMPIFNOT, name: 'JMPIFNOT', exec: opJmp }],
  [O.CALL, { opCode: O.CALL, name: 'CALL', exec: opCall, validator: V.validateCall }],
  [O.RET, { opCode: O.RET, name: 'RET', exec: opRet }],
  [O.APPCALL, { opCode: O.APPCALL, name: 'APPCALL' }],
  // [O.TAILCALL, {opCode: O.TAILCALL, name: 'TAILCALL', exec: opAppCall},
  [O.SYSCALL, { opCode: O.SYSCALL, name: 'SYSCALL' }],

  // Stack ops
  [
    O.DUPFROMALTSTACK,
    {
      opCode: O.DUPFROMALTSTACK,
      name: 'DUPFROMALTSTACK',
      exec: S.opToDupFromAltStack,
      validator: V.validateAltStackCount1
    }
  ],
  [O.TOALTSTACK, { opCode: O.TOALTSTACK, name: 'TOALTSTACK', exec: S.opToAltStack, validator: V.validateCount1 }],
  [
    O.FROMALTSTACK,
    {
      opCode: O.FROMALTSTACK,
      name: 'FROMALTSTACK',
      exec: S.opFromAltStack,
      validator: V.validateAltStackCount1
    }
  ],
  [O.XDROP, { opCode: O.XDROP, name: 'XDROP', exec: S.opXDrop, validator: V.validateXDrop }],
  [O.XSWAP, { opCode: O.XSWAP, name: 'XSWAP', exec: S.opXSwap, validator: V.validateXSwap }],
  [O.XTUCK, { opCode: O.XTUCK, name: 'XTUCK', exec: S.opXTuck, validator: V.validateXTuck }],
  [O.DEPTH, { opCode: O.DEPTH, name: 'DEPTH', exec: S.opDepth }],
  [O.DROP, { opCode: O.DROP, name: 'DROP', exec: S.opDrop, validator: V.validateCount1 }],
  [O.DUP, { opCode: O.DUP, name: 'DUP', exec: S.opDup, validator: V.validateCount1 }],
  [O.NIP, { opCode: O.NIP, name: 'NIP', exec: S.opNip, validator: V.validateCount2 }],
  [O.OVER, { opCode: O.OVER, name: 'OVER', exec: S.opOver, validator: V.validateCount2 }],
  [O.PICK, { opCode: O.PICK, name: 'PICK', exec: S.opPick, validator: V.validatePick }],
  [O.ROLL, { opCode: O.ROLL, name: 'ROLL', exec: S.opRoll, validator: V.validateRoll }],
  [O.ROT, { opCode: O.ROT, name: 'ROT', exec: S.opRot, validator: V.validateCount3 }],
  [O.SWAP, { opCode: O.SWAP, name: 'SWAP', exec: S.opSwap, validator: V.validateCount2 }],
  [O.TUCK, { opCode: O.TUCK, name: 'TUCK', exec: S.opTuck, validator: V.validateCount2 }],

  // Splice
  [O.CAT, { opCode: O.CAT, name: 'CAT', exec: opCat, validator: V.validateCat }],
  [O.SUBSTR, { opCode: O.SUBSTR, name: 'SUBSTR', exec: opSubStr, validator: V.validateSubStr }],
  [O.LEFT, { opCode: O.LEFT, name: 'LEFT', exec: opLeft, validator: V.validateLeft }],
  [O.RIGHT, { opCode: O.RIGHT, name: 'RIGHT', exec: opRight, validator: V.validateRight }],
  [O.SIZE, { opCode: O.SIZE, name: 'SIZE', exec: opSize, validator: V.validateCount1 }],

  // Bitwiase logic
  [O.INVERT, { opCode: O.INVERT, name: 'INVERT', exec: opInvert, validator: V.validateCount1 }],
  [O.AND, { opCode: O.AND, name: 'AND', exec: AR.opBigIntZip, validator: V.validateCount2 }],
  [O.OR, { opCode: O.OR, name: 'OR', exec: AR.opBigIntZip, validator: V.validateCount2 }],
  [O.XOR, { opCode: O.XOR, name: 'XOR', exec: AR.opBigIntZip, validator: V.validateCount2 }],
  [O.EQUAL, { opCode: O.EQUAL, name: 'EQUAL', exec: opEqual, validator: V.validateCount2 }],

  // Arithmetic
  [O.INC, { opCode: O.INC, name: 'INC', exec: AR.opBigInt, validator: V.validateInc }],
  [O.DEC, { opCode: O.DEC, name: 'DEC', exec: AR.opBigInt, validator: V.validateDec }],
  [O.SIGN, { opCode: O.SIGN, name: 'SIGN', exec: AR.opSign, validator: V.validateSign }],
  [O.NEGATE, { opCode: O.NEGATE, name: 'NEGATE', exec: AR.opBigInt, validator: V.validateCount1 }],
  [O.ABS, { opCode: O.ABS, name: 'ABS', exec: AR.opBigInt, validator: V.validateCount1 }],
  [O.NOT, { opCode: O.NOT, name: 'NOT', exec: AR.opNot, validator: V.validateCount1 }],
  [O.NZ, { opCode: O.NZ, name: 'NZ', exec: AR.opNz, validator: V.validateCount1 }],
  [O.ADD, { opCode: O.ADD, name: 'ADD', exec: AR.opBigIntZip, validator: V.validateAdd }],
  [O.SUB, { opCode: O.SUB, name: 'SUB', exec: AR.opBigIntZip, validator: V.validateSub }],
  [O.MUL, { opCode: O.MUL, name: 'MUL', exec: AR.opBigIntZip, validator: V.validateMul }],
  [O.DIV, { opCode: O.DIV, name: 'DIV', exec: AR.opBigIntZip, validator: V.validateDiv }],
  [O.MOD, { opCode: O.MOD, name: 'MOD', exec: AR.opBigIntZip, validator: V.validateMod }],
  [O.SHL, { opCode: O.SHL, name: 'SHL', exec: AR.opBigIntZip, validator: V.validateShiftLeft }],
  [O.SHR, { opCode: O.SHR, name: 'SHR', exec: AR.opBigIntZip, validator: V.validateShift }],
  [O.BOOLAND, { opCode: O.BOOLAND, name: 'BOOLAND', exec: AR.opBoolZip, validator: V.validateCount2 }],
  [O.BOOLOR, { opCode: O.BOOLOR, name: 'BOOLOR', exec: AR.opBoolZip, validator: V.validateCount2 }],
  [O.NUMEQUAL, { opCode: O.NUMEQUAL, name: 'NUMEQUAL', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.NUMNOTEQUAL, { opCode: O.NUMNOTEQUAL, name: 'NUMNOTEQUAL', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.LT, { opCode: O.LT, name: 'LT', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.GT, { opCode: O.GT, name: 'GT', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.LTE, { opCode: O.LTE, name: 'LTE', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.GTE, { opCode: O.GTE, name: 'GTE', exec: AR.opBigIntComp, validator: V.validateCount2 }],
  [O.MIN, { opCode: O.MIN, name: 'MIN', exec: AR.opBigIntZip, validator: V.validateCount2 }],
  [O.MAX, { opCode: O.MAX, name: 'MAX', exec: AR.opBigIntZip, validator: V.validateCount2 }],
  [O.WITHIN, { opCode: O.WITHIN, name: 'WITHIN', exec: AR.opWithIn, validator: V.validateCount3 }],

  // Crypto
  [O.SHA1, { opCode: O.SHA1, name: 'SHA1', exec: opHash, validator: V.validateCount1 }],
  [O.SHA256, { opCode: O.SHA256, name: 'SHA256', exec: opHash, validator: V.validateCount1 }],
  [O.HASH160, { opCode: O.HASH160, name: 'HASH160', exec: opHash, validator: V.validateCount1 }],
  [O.HASH256, { opCode: O.HASH256, name: 'HASH256', exec: opHash, validator: V.validateCount1 }],
  [O.VERIFY, { opCode: O.VERIFY, name: 'VERIFY' }],
  // [O.CHECKSIG,      {opCode: O.CHECKSIG, name: 'CHECKSIG', exec: opCheckSig, validator: validateCount2},
  // tslint:disable-next-line:max-line-length
  // [O.CHECKMULTISIG, {opCode: O.CHECKMULTISIG, name: 'CHECKMULTISIG', exec: opCheckMultiSig, validator: validateCount2},

  // Array
  [O.ARRAYSIZE, { opCode: O.ARRAYSIZE, name: 'ARRAYSIZE', exec: A.opArraySize, validator: V.validateCount1 }],
  [O.PACK, { opCode: O.PACK, name: 'PACK', exec: A.opPack, validator: V.validatePack }],
  [O.UNPACK, { opCode: O.UNPACK, name: 'UNPACK', exec: A.opUnpack, validator: V.validateUnpack }],
  [O.PICKITEM, { opCode: O.PICKITEM, name: 'PICKITEM', exec: A.opPickItem, validator: V.validatePickItem }],
  [O.SETITEM, { opCode: O.SETITEM, name: 'SETITEM', exec: A.opSetItem, validator: V.validatorSetItem }],
  [O.NEWARRAY, { opCode: O.NEWARRAY, name: 'NEWARRAY', exec: A.opNewArray, validator: V.validateNewArray }],
  [O.NEWMAP, { opCode: O.NEWMAP, name: 'NEWMAP', exec: A.opNewMap }],
  [O.NEWSTRUCT, { opCode: O.NEWSTRUCT, name: 'NEWSTRUCT', exec: A.opNewStruct, validator: V.validateNewStruct }],
  [O.APPEND, { opCode: O.APPEND, name: 'APPEND', exec: A.opAppend, validator: V.validateAppend }],
  [O.REVERSE, { opCode: O.REVERSE, name: 'REVERSE', exec: A.opReverse, validator: V.validatorReverse }],
  [O.REMOVE, { opCode: O.REMOVE, name: 'REMOVE', exec: A.opRemove, validator: V.validatorRemove }],
  [O.HASKEY, { opCode: O.HASKEY, name: 'HASKEY', exec: A.opHasKey, validator: V.validatorHasKey }],

  // Exceptions
  [O.THROW, { opCode: O.THROW, name: 'THROW', exec: opThrow }],
  [O.THROWIFNOT, { opCode: O.THROWIFNOT, name: 'THROWIFNOT', exec: opThrowIfNot, validator: V.validatorThrowIfNot }]
]);
