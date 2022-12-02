/**
 * Quantum Random Number Generator (QRNG)
 */
import {QUBIT_STATE_ZERO} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";
import {bit} from "../math/truth-table";
import {QubitRegister} from "../../model/qubit-register";
import {mct} from "../gates/multi-qubit-gates";
import {range, rotateArray} from "../../util";

export function qrng(): bit {
  return had(QUBIT_STATE_ZERO).measure();
}

export function increment(reg: QubitRegister) {
    const numQubits = reg.numQubits;
    for(let qubit = 0; qubit < numQubits; qubit++) {
        const controls = range(qubit + 1, numQubits - 1);
        mct(reg, controls, qubit);
    }
}

export function decrement(reg: QubitRegister) {
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits; qubit++) {
        const controls = range(numQubits - qubit, numQubits - 1);
        const target = numQubits - 1 - qubit;
        mct(reg, controls, target);
    }
}

export function add(reg: QubitRegister, summand: number) {
    rotateArray(reg.states, -summand);
}

export function sub(reg: QubitRegister, subtrahend: number) {
    rotateArray(reg.states, subtrahend);
}

