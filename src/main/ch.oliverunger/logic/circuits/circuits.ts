import {Qubit, QUBIT_STATE_ZERO} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";
import {bit} from "../math/truth-table";
import {QubitRegister} from "../../model/qubit-register";
import {rotateArray} from "../../util";
import {STATE_ZERO} from "../../model/qubit-state";

/**
 * Quantum Random Number Generator (QRNG)
 */
export function qrng(): bit {
    const qubit = Qubit.ofState(STATE_ZERO);
    had(qubit);
    return qubit.measure();
}

export function increment(reg: QubitRegister) {
    add(reg, 1);
}

export function decrement(reg: QubitRegister) {
    sub(reg, 1);
}

export function add(reg: QubitRegister, summand: number) {
    rotateArray(reg.states, -summand);
}

export function sub(reg: QubitRegister, subtrahend: number) {
    rotateArray(reg.states, subtrahend);
}

