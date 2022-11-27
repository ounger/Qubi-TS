import {QubitsRegister} from "../../model/qubits-register";
import {bit, getAllRowsWith1InCol, getTruthtableCol} from "../math/truth-table";
import {degsToRads} from "../math/util";
import {Complex} from "../../model/math/complex";

// TODO Controlled Gates but c shall be 0

export function x(reg: QubitsRegister, targetQubit: number) {
    mct(reg, [], targetQubit);
}

/**
 * The Controlled Pauli-X gate (CNOT, CX) is a multi-qubit operation, where one qubit acts as a control and one qubit acts as a target qubit.
 * It performs a NOT operation on the target qubit only when the control qubit is in ket(1).
 */
export function cx(reg: QubitsRegister, controlQubit: number, targetQubit: number) {
    mct(reg, [controlQubit], targetQubit);
}

/**
 * The Toffoli gate (CCNOT, CCX) acts like {@link cx}, but with two control qubits.
 */
export function ccx(reg: QubitsRegister, firstControlQubit: number, secondControlQubit: number, targetQubit: number) {
    mct(reg, [firstControlQubit, secondControlQubit], targetQubit);
}

/**
 * The Multi-Control Toffoli (MCT) acts like {@link cx}, but with an arbitrary number of control qubits.
 */
export function mct(reg: QubitsRegister, controlQubits: number[], targetQubit: number) {
    const numQubits = reg.numQubits;
    const numStates = reg.states.length;
    let ttCols: bit[][] = new Array<bit[]>(controlQubits.length).fill([]).map((_, index) => {
        return getTruthtableCol(numQubits, controlQubits[index]);
    });
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let i = 0; i < numStates; i++) {
        if (!changedSwapPartnerStatesIndices.includes(i) && ttCols.every(ttCol => ttCol[i] === 1)) {
            let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1 - targetQubit);
            swapStates(reg, i, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

function swapStates(reg: QubitsRegister, oneStateIndex: number, anotherStateIndex: number) {
    let iState = reg.states[oneStateIndex];
    reg.states[oneStateIndex] = reg.states[anotherStateIndex];
    reg.states[anotherStateIndex] = iState;
}

export function swap(reg: QubitsRegister, q0: number, q1: number) {
    // Swap q0 and q1 if q0 > q1
    let temp = q0;
    q0 = Math.min(q0, q1);
    q1 = Math.max(temp, q1);

    const numQubits = reg.numQubits;
    let ttColQ0 = getTruthtableCol(numQubits, q0);
    let ttColQ1 = getTruthtableCol(numQubits, q1);
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let i = 0; i < reg.states.length; i++) {
        if (ttColQ0[i] !== ttColQ1[i] && !changedSwapPartnerStatesIndices.includes(i)) {
            // Position of swapPartner is: index + sum {i = q0 + 1 to q1} 2^(numQubits - 1 - i)
            // This Summation is equivalent to the following expression.
            // See: https://www.wolframalpha.com/input?i=sum+x%3Da%2B1+to+b+2%5E%28n-1-x%29
            let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1) * (Math.pow(2, -q0) - Math.pow(2, -q1));
            swapStates(reg, i, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

/**
 * Phase shift by Math.PI / 4 (45°)
 */
export function phaseT(reg: QubitsRegister, q: number) {
    phase(reg, q, 45);
}

/**
 * Phase shift by Math.PI / 2 (90°)
 */
export function phaseS(reg: QubitsRegister, q: number) {
    phase(reg, q, 90);
}

/**
 * Phase shift by Math.PI (180°)
 */
export function phaseZ(reg: QubitsRegister, q: number) {
    phase(reg, q, 180);
}

export function phase(reg: QubitsRegister, q: number, angleDegrees: number) {
    const phi = degsToRads(angleDegrees);
    const expOfiTimesAngle: Complex = new Complex(Math.cos(phi), Math.sin(phi));
    for (let i of getAllRowsWith1InCol(reg.numQubits, q)) {
        reg.states[i] = reg.states[i].mul(expOfiTimesAngle);
    }
}

export function hadamard(reg: QubitsRegister, q: number) {
    // TODO
}

export function cz() {
    // TODO
}

export function cphase() {
    // TODO
}

export function cswap() {
    // TODO
}




