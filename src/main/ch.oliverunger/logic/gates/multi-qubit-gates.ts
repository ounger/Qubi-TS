import {QubitRegister} from "../../model/qubit-register";
import {bit, getAllRowsWith1InCol, getTTBitAt, getTTCol} from "../math/truth-table";
import {degsToRads} from "../math/util";
import {Complex} from "../../model/math/complex";
import {HADAMARD_GATE} from "./single-qubit-gates";

// TODO Controlled Gates but c shall be 0

// TODO Die Wurzel kuerzen! SQRT = getSqrt(digitFractions)

// TODO Sparse Matrices?

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
        return getTTCol(numQubits, controlQubits[index]);
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
    let ttColQ0 = getTTCol(numQubits, q0);
    let ttColQ1 = getTTCol(numQubits, q1);
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
    const ttColQ0 = getTTCol(reg.numQubits, q0);
    const ttColQ1 = getTTCol(reg.numQubits, q1);
    for (let state = 0; state < reg.states.length; state++) {
        if (ttColQ0[state] === 1 && ttColQ1[state] === 1) {
            reg.states[state] = reg.states[state].mul(expOfiTimesAngle);
        }
    }
}

export function cswap() {
    // TODO
}

// TODO Kann man sich irgendwie States Berechnung sparen die sowieso null sind?
export function hadSingle(reg: QubitRegister, q: number) {
    let states = reg.states.length;
    let regStatesNew = new Array<Complex>(states);
    let relevantStatesIndices = calcRelevantStatesIndices(reg.numQubits, q);
    for (let state = 0; state < states; state++) {
        const hadRowToApply = HADAMARD_GATE[getTTBitAt(reg.numQubits, state, q)];
        regStatesNew[state] = hadRowToApply[0].mul(reg.states[relevantStatesIndices[state][0]]).add(hadRowToApply[1].mul(reg.states[relevantStatesIndices[state][1]]));
    }
    for (let state = 0; state < states; state++) {
        reg.states[state] = regStatesNew[state];
    }
}

// TODO Remove export
/**
 *
 */
export function calcRelevantStatesIndices(numQubits: number, col: number): [state0Index: number, state1Index: number][] {
    const states = Math.pow(2, numQubits);
    const relevantStatesIndicesPerState = new Array<[state0Index: number, state1Index: number]>(states);
    const twoPowQubitsMinusCol = Math.pow(2, numQubits - col);
    const twoPowQubitsMinusColHalf = twoPowQubitsMinusCol / 2;
    for (let state = 0; state < states; state++) {
        const state0Index = Math.floor(state / twoPowQubitsMinusCol) * twoPowQubitsMinusCol + state % twoPowQubitsMinusColHalf;
        const state1Index = state0Index + twoPowQubitsMinusColHalf;
        relevantStatesIndicesPerState[state] = [state0Index, state1Index];
    }
    return relevantStatesIndicesPerState;
}

export function hadMulti(reg: QubitRegister, qubits: number[]) {
    // TODO
}

export function hadAll(reg: QubitRegister) {
    // TODO
}

// TODO Was ist mit den ROTX, ROTY etc. Funktionen




