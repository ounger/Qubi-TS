import {QubitRegister} from './qubit-register';
import {bit, getTTCol} from '../../math/truth-table';
import {degsToRads} from '../../math/math-util';
import {Complex} from '../../math/complex';
import {
    getPhaseGate,
    getRot1Gate,
    getRotXGate,
    getRotYGate,
    getRotZGate,
    HADAMARD_GATE,
    PAULI_X_GATE,
    RNOT_GATE,
    RNOT_INVERSE_GATE
} from '../single-qubit/qubit-gates';

// TODO Controlled Gates but c shall be 0

// TODO Die Wurzel kuerzen! SQRT = getSqrt(digitFractions)

// TODO Sparse Matrices?

export function x(reg: QubitRegister, q: number) {
    applySingleQubitGate(reg, q, PAULI_X_GATE);
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
    const numStates = reg.getStates().length;
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
    let temp = reg.getStates()[oneStateIndex];
    reg.getStates()[oneStateIndex] = reg.getStates()[anotherStateIndex];
    reg.getStates()[anotherStateIndex] = temp;
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
    for (let i = 0; i < reg.getStates().length; i++) {
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
    applySingleQubitGate(reg, q, getPhaseGate(angleDegrees));
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
    for (let state = 0; state < reg.getStates().length; state++) {
        if (ttColQ0[state] === 1 && ttColQ1[state] === 1) {
            reg.getStates()[state] = reg.getStates()[state].mul(expOfiTimesAngle);
        }
    }
}

/**
 * The CSWAP Gate is also called Fredkin Gate.
 */
export function cswap(reg: QubitRegister, control: number, firstTargetQubit: number, secondTargetQubit: number, byZero = false) {
    // Swap firstTarget and secondTarget if firstTarget > secondTarget
    let temp = firstTargetQubit;
    firstTargetQubit = Math.min(firstTargetQubit, secondTargetQubit);
    secondTargetQubit = Math.max(temp, secondTargetQubit);

    const numQubits = reg.numQubits;
    let ttColControl = getTTCol(numQubits, control);
    let ttColFirstTarget = getTTCol(numQubits, firstTargetQubit);
    let ttColSecondTarget = getTTCol(numQubits, secondTargetQubit);
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let i = 0; i < reg.getStates().length; i++) {
        if (ttColControl[i] === (byZero ? 0 : 1) && ttColFirstTarget[i] !== ttColSecondTarget[i] && !changedSwapPartnerStatesIndices.includes(i)) {
            let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1 - firstTargetQubit) - Math.pow(2, numQubits - 1 - secondTargetQubit);
            swapStates(reg, i, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

// TODO Kann man sich irgendwie States Berechnung sparen die sowieso null sind?
/**
 * Applies a hadamard gate to a single qubit in a register.
 */
export function hadSingle(reg: QubitRegister, q: number) {
    applySingleQubitGate(reg, q, HADAMARD_GATE);
}

export function hadMulti(reg: QubitRegister, qubits: number[]) {
    // TODO
}

export function hadAll(reg: QubitRegister) {
    // TODO
}

export function chadSingle(reg: QubitRegister, controlQubit: number, targetQubit: number) {
    // TODO
}

export function chadMulti(reg: QubitRegister, controlQubit: number, targetQubits: number[]) {
    // TODO
}

export function chadAll(reg: QubitRegister, controlQubit: number) {
    // TODO
}

export function mchadSingle(reg: QubitRegister, controlQubits: number[], targetQubit: number) {
    // TODO
}

export function mchadMulti(reg: QubitRegister, controlQubits: number[], targetQubits: number[]) {
    // TODO
}

export function mchadAll(reg: QubitRegister, controlQubits: number[]) {
    // TODO
}

export function rot1(reg: QubitRegister, q: number, angleDegrees: number) {
    applySingleQubitGate(reg, q, getRot1Gate(angleDegrees));
}

export function rotX(reg: QubitRegister, q: number, angleDegrees: number) {
    applySingleQubitGate(reg, q, getRotXGate(angleDegrees));
}

export function rotY(reg: QubitRegister, q: number, angleDegrees: number) {
    applySingleQubitGate(reg, q, getRotYGate(angleDegrees));
}

export function rotZ(reg: QubitRegister, q: number, angleDegrees: number) {
    applySingleQubitGate(reg, q, getRotZGate(angleDegrees));
}

export function rnot(reg: QubitRegister, q: number) {
    applySingleQubitGate(reg, q, RNOT_GATE);
}

export function rnotInverse(reg: QubitRegister, q: number) {
    applySingleQubitGate(reg, q, RNOT_INVERSE_GATE);
}

function applySingleQubitGate(reg: QubitRegister, q: number, gate: Complex[][]) {
    if (gate.length !== 2 || gate[0].length !== 2 || gate[1].length !== 2) {
        throw new Error("Not a single qubit gate!");
    }
    const numStates = reg.getStates().length;
    const numQubits = reg.numQubits;
    // Reverse index of target qubit
    q = numQubits - 1 - q;
    const powTwoQubit = Math.pow(2, q);
    const powTwoQubitPlus1 = powTwoQubit * 2;
    const g00 = gate[0][0];
    const g01 = gate[0][1];
    const g10 = gate[1][0];
    const g11 = gate[1][1];
    for (let g = 0; g < numStates; g += powTwoQubitPlus1) {
        for (let i = g; i < g + powTwoQubit; i++) {
            const t1 = g00.mul(reg.getStates()[i]).add(g01.mul(reg.getStates()[i + powTwoQubit]));
            const t2 = g10.mul(reg.getStates()[i]).add(g11.mul(reg.getStates()[i + powTwoQubit]));
            reg.getStates()[i] = t1;
            reg.getStates()[i + powTwoQubit] = t2;
        }
    }
}

function applyControlledGate(reg: QubitRegister, controls: number[], targets: number[], gate: Complex[][]) {
    // TODO
}



