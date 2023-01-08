import {QubitRegister} from './qubit-register';
import {bit, getAllRowsWith1InCol, getTTBitAt, getTTCol} from '../../math/truth-table';
import {degsToRads} from '../../math/math-util';
import {Complex} from '../../math/complex';
import {HADAMARD_GATE} from '../single-qubit/qubit-gates';

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

export function swap(reg: QubitRegister, q0: number, q1: number) {
    cswap(reg, q0, q1); // Delegate to cswap but without control qubit
}

/**
 * The Controlled-Swap Gate is also called Fredkin Gate.
 */
export function cswap(reg: QubitRegister, target0: number, target1: number, control?: number, byZero = false) {
    // Swap first and second target if firstTarget > secondTarget
    let temp = target0;
    target0 = Math.min(target0, target1);
    target1 = Math.max(temp, target1);

    const numQubits = reg.numQubits;
    let ttColControl = control !== undefined ? getTTCol(numQubits, control) : new Array<bit>();
    let ttColFirstTarget = getTTCol(numQubits, target0);
    let ttColSecondTarget = getTTCol(numQubits, target1);
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let i = 0; i < reg.getStates().length; i++) {
        if ((ttColControl.length === 0 || ttColControl[i] === (byZero ? 0 : 1))
            && ttColFirstTarget[i] !== ttColSecondTarget[i] && !changedSwapPartnerStatesIndices.includes(i)) {
            let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1 - target0) - Math.pow(2, numQubits - 1 - target1);
            swapStates(reg, i, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

function swapStates(reg: QubitRegister, oneStateIndex: number, anotherStateIndex: number) {
    let temp = reg.getStates()[oneStateIndex];
    reg.getStates()[oneStateIndex] = reg.getStates()[anotherStateIndex];
    reg.getStates()[anotherStateIndex] = temp;
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
        reg.getStates()[state] = reg.getStates()[state].mul(expOfiTimesAngle);
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
    for (let state = 0; state < reg.getStates().length; state++) {
        if (ttColQ0[state] === 1 && ttColQ1[state] === 1) {
            reg.getStates()[state] = reg.getStates()[state].mul(expOfiTimesAngle);
        }
    }
}

// TODO Kann man sich irgendwie States Berechnung sparen die sowieso null sind?
/**
 * Applies a hadamard gate to a single qubit in a register.
 */
export function hadSingle(reg: QubitRegister, q: number) {
    const numStates = reg.getStates().length;
    const numQubits = reg.numQubits;
    let regStatesNew = new Array<Complex>(numStates);
    const twoPowQubitsMinusColMinus1 = Math.pow(2, numQubits - q - 1);
    for (let state = 0; state < numStates; state++) {
        const appliedHadRow = HADAMARD_GATE[getTTBitAt(numQubits, state, q)];
        const appliedState0 = state - getTTBitAt(numQubits, state, q) * twoPowQubitsMinusColMinus1;
        const appliedState1 = appliedState0 + twoPowQubitsMinusColMinus1;
        regStatesNew[state] = appliedHadRow[0].mul(reg.getStates()[appliedState0]).add(appliedHadRow[1].mul(reg.getStates()[appliedState1]));
    }
    for (let state = 0; state < numStates; state++) {
        reg.getStates()[state] = regStatesNew[state];
    }
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

export function rotx(reg: QubitRegister, q: number, angleDegrees: number) {
    // TODO
}

export function roty(reg: QubitRegister, q: number, angleDegrees: number) {
    // TODO
}

export function rotz(reg: QubitRegister, q: number, angleDegrees: number) {
    // TODO
}

export function rnot(reg: QubitRegister, q: number) {
    // TODO
}

export function rnotInverse(reg: QubitRegister, q: number) {
    // TODO
}


