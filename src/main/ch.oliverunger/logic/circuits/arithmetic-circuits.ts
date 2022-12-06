import {QubitRegister} from "../../model/qubit-register";
import {rotateArray} from "../../util";

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