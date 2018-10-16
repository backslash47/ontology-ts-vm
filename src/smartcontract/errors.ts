/*
 * Copyright (C) 2018 Matus Zamborsky & The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */
export const ERR_CHECK_STACK_SIZE = new Error('[NeoVmService] vm over max stack size!');
export const ERR_EXECUTE_CODE = new Error('[NeoVmService] vm execute code invalid!');
export const ERR_GAS_INSUFFICIENT = new Error('[NeoVmService] gas insufficient');
export const VM_EXEC_STEP_EXCEED = new Error('[NeoVmService] vm execute step exceed!');
export const CONTRACT_NOT_EXIST = new Error('[NeoVmService] Get contract code from db fail');
export const DEPLOYCODE_TYPE_ERROR = new Error('[NeoVmService] DeployCode type error!');
export const VM_EXEC_FAULT = new Error('[NeoVmService] vm execute state fault!');
