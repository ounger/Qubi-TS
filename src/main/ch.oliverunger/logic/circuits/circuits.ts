import {QUBIT_STATE_ZERO} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";
import {bit} from "../math/truth-table";
import {QubitRegister} from "../../model/qubit-register";
import {rotateArray} from "../../util";

/**
 * Quantum Random Number Generator (QRNG)
 */
export function qrng(): bit {
    return had(QUBIT_STATE_ZERO).measure();
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

