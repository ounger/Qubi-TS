import {QubitRegister} from "../../model/qubit-register";
import {bit, getAllRowsWith1InCol, getTruthtableCol} from "../math/truth-table";
import {degsToRads} from "../math/util";
import {Complex, MINUS_1} from "../../model/math/complex";

// TODO Controlled Gates but c shall be 0

export function x(reg: QubitRegister, q: number) {
    mct(reg, [], q);
}

/**
 * The Controlled Pauli-X gate (CNOT, CX) is a multi-qubit operation, where one qubit acts as a control and one qubit acts as a target qubit.
 * It performs a NOT operation on the target qubit only when the control qubit is in ket(1).
 */
export function cx(reg: QubitRegister, controlQubit: number, targetQubit: number) {
    mct(reg, [controlQubit], targetQubit);
}

/**
 * The Toffoli gate (CCNOT, CCX) acts like {@link cx}, but with two control qubits.
 */
export function ccx(reg: QubitRegister, firstControlQubit: number, secondControlQubit: number, targetQubit: number) {
    mct(reg, [firstControlQubit, secondControlQubit], targetQubit);
}

/**
 * The Multi-Control Toffoli (MCT) acts like {@link cx}, but with an arbitrary number of control qubits.
 */
export function mct(reg: QubitRegister, controlQubits: number[], targetQubit: number) {
    const numQubits = reg.numQubits;
    const numStates = reg.states.length;
    let ttCols: bit[][] = new Array<bit[]>(controlQubits.length).fill([]).map((_, index) => {
        return getTruthtableCol(numQubits, controlQubits[index]);
    });
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let state = 0; state < numStates; state++) {
        if (!changedSwapPartnerStatesIndices.includes(state) && ttCols.every(ttCol => ttCol[state] === 1)) {
            let swapPartnerStateIndex = state + Math.pow(2, numQubits - 1 - targetQubit);
            swapStates(reg, state, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

function swapStates(reg: QubitRegister, oneStateIndex: number, anotherStateIndex: number) {
    let temp = reg.states[oneStateIndex];
    reg.states[oneStateIndex] = reg.states[anotherStateIndex];
    reg.states[anotherStateIndex] = temp;
}

export function swap(reg: QubitRegister, q0: number, q1: number) {
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
export function phaseT(reg: QubitRegister, q: number) {
    phase(reg, q, 45);
}

/**
 * Phase shift by Math.PI / 2 (90°)
 */
export function phaseS(reg: QubitRegister, q: number) {
    phase(reg, q, 90);
}

/**
 * Phase shift by Math.PI (180°)
 */
export function phaseZ(reg: QubitRegister, q: number) {
    phase(reg, q, 180);
}

export function phase(reg: QubitRegister, q: number, angleDegrees: number) {
    const phi = degsToRads(angleDegrees);
    const expOfiTimesAngle: Complex = new Complex(Math.cos(phi), Math.sin(phi));
    for (let state of getAllRowsWith1InCol(reg.numQubits, q)) {
        reg.states[state] = reg.states[state].mul(expOfiTimesAngle);
    }
}

/**
 * Equals {@link cphase} with 45°
 */
export function ct(reg: QubitRegister, q0: number, q1: number) {
    cphase(reg, q0, q1, 45);
}

/**
 * Equals {@link cphase} with 90°
 */
export function cs(reg: QubitRegister, q0: number, q1: number) {
    cphase(reg, q0, q1, 90);
}

/**
 * Equals {@link cphase} with 180°
 */
export function cz(reg: QubitRegister, q0: number, q1: number) {
    cphase(reg, q0, q1, 180);
}

/**
 * CPHASE only acts when its control qubit is ket(1), and when it does,
 * it only affects target qubit states having value ket(1).
 * Because of this symmetry between its inputs, its irrelevant which qubit
 * we consider to be the control and which we consider to be the target.
 */
export function cphase(reg: QubitRegister, q0: number, q1: number, angleDegrees: number) {
    const phi = degsToRads(angleDegrees);
    const expOfiTimesAngle: Complex = new Complex(Math.cos(phi), Math.sin(phi));
    const ttColQ0 = getTruthtableCol(reg.numQubits, q0);
    const ttColQ1 = getTruthtableCol(reg.numQubits, q1);
    for(let state = 0; state < reg.states.length; state++) {
        if(ttColQ0[state] === 1 && ttColQ1[state] === 1) {
            reg.states[state] = reg.states[state].mul(expOfiTimesAngle);
        }
    }
}

export function cswap() {
    // TODO
}

export function hadamard(reg: QubitRegister, q: number) {
    // TODO
}




