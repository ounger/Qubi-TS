/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from './qubit-register';
import {Bit, getAllRowsWith1InCol, getTTBitAt, getTTCol} from '../../math/truth-table';
import {degsToRads} from '../../math/math-util';
import {Complex} from '../../math/complex';
import {
    getRot1Gate,
    getRotXGate,
    getRotYGate,
    getRotZGate,
    HADAMARD_GATE,
    RNOT_GATE,
    RNOT_INVERSE_GATE
} from '../single-qubit/qubit-gates';

// TODO Die Wurzel kuerzen! SQRT = getSqrt(digitFractions)

// TODO Kann man sich irgendwie States Berechnung sparen die sowieso null sind?

// TODO Sparse Matrices?

/**
 * @param q Index of the qubit in the register
 * @param by Controlled by 0 or 1
 */
export type ControlQubit = [q: number, by: Bit];

export function x(reg: QubitRegister, q: number) {
    mct(reg, [], q);
}

/**
 * The Controlled Pauli-X gate (CNOT, CX) is a multi-qubit operation, where one qubit acts as a control and one qubit acts as a target qubit.
 * It performs a NOT operation on the target qubit only when the control qubit is in ket(1).
 */
export function cx(reg: QubitRegister, control: ControlQubit, target: number) {
    mct(reg, [control], target);
}

/**
 * The Toffoli gate (CCNOT, CCX) acts like {@link cx}, but with two control qubits.
 */
export function ccx(reg: QubitRegister, controls: ControlQubit[], target: number) {
    if (controls.length !== 2) {
        throw new Error("CCX expects exactly two control qubits!");
    }
    mct(reg, controls, target);
}

/**
 * The Multi-Control Toffoli (MCT) acts like {@link cx}, but with an arbitrary number of control qubits.
 */
export function mct(reg: QubitRegister, controls: ControlQubit[], target: number) {
    const numQubits = reg.numQubits;
    const numStates = reg.getStates().length;
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let state = 0; state < numStates; state++) {
        if (!changedSwapPartnerStatesIndices.includes(state)
            && controls.every(control => getTTBitAt(numQubits, state, control[0]) === control[1])) {
            let swapPartnerStateIndex = state + Math.pow(2, numQubits - 1 - target);
            swapStates(reg, state, swapPartnerStateIndex);
            changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
        }
    }
}

export function swap(reg: QubitRegister, q0: number, q1: number) {
    cswap(reg, null, q0, q1); // Delegate to cswap but without control qubit
}

/**
 * The Controlled-Swap Gate is also called Fredkin Gate.
 */
export function cswap(reg: QubitRegister, control: ControlQubit | null, target0: number, target1: number) {
    // Swap first and second target if firstTarget > secondTarget
    let temp = target0;
    target0 = Math.min(target0, target1);
    target1 = Math.max(temp, target1);

    const numQubits = reg.numQubits;
    let ttColControl = control !== null ? getTTCol(numQubits, control[0]) : new Array<Bit>();
    let ttColFirstTarget = getTTCol(numQubits, target0);
    let ttColSecondTarget = getTTCol(numQubits, target1);
    let changedSwapPartnerStatesIndices = new Array<number>();
    for (let i = 0; i < reg.getStates().length; i++) {
        if ((ttColControl.length === 0 || ttColControl[i] === control![1])
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
/**
 * Applies a hadamard gate to a qubit in a register.
 */
export function had(reg: QubitRegister, q: number) {
    applySingleQubitGate(reg, q, HADAMARD_GATE);
}

export function chad(reg: QubitRegister, control: ControlQubit, target: number) {
    applyControlledGate(reg, [control], target, HADAMARD_GATE);
}

export function mchad(reg: QubitRegister, controls: ControlQubit[], target: number) {
    applyControlledGate(reg, controls, target, HADAMARD_GATE);
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
    const regStatesNew = new Array<Complex>(numStates);
    const pow2QubitMinusColMinus1 = Math.pow(2, numQubits - q - 1);
    for (let state = 0; state < numStates; state++) {
        const appliedGateRow = gate[getTTBitAt(numQubits, state, q)];
        const appliedState0 = state - getTTBitAt(numQubits, state, q) * pow2QubitMinusColMinus1;
        const appliedState1 = appliedState0 + pow2QubitMinusColMinus1;
        regStatesNew[state] = appliedGateRow[0].mul(reg.getStates()[appliedState0])
            .add(appliedGateRow[1].mul(reg.getStates()[appliedState1]));
    }
    reg.setStates(regStatesNew);
}

function applyControlledGate(reg: QubitRegister, controls: ControlQubit[], target: number, gate: Complex[][]) {
    if (gate.length !== 2 || gate[0].length !== 2 || gate[1].length !== 2) {
        throw new Error("Not a single qubit gate!");
    }
    const numStates = reg.getStates().length;
    const numQubits = reg.numQubits;
    const regStatesNew = new Array<Complex>(numStates);
    const pow2QubitMinusColMinus1 = Math.pow(2, numQubits - target - 1);
    for (let state = 0; state < numStates; state++) {
        if (controls.every(c => getTTBitAt(numQubits, state, c[0]) === c[1])) {
            const appliedGateRow = gate[getTTBitAt(numQubits, state, target)];
            const appliedState0 = state - getTTBitAt(numQubits, state, target) * pow2QubitMinusColMinus1;
            const appliedState1 = appliedState0 + pow2QubitMinusColMinus1;
            regStatesNew[state] = appliedGateRow[0].mul(reg.getStates()[appliedState0])
                .add(appliedGateRow[1].mul(reg.getStates()[appliedState1]));
        } else {
            regStatesNew[state] = reg.getStates()[state];
        }
    }
    reg.setStates(regStatesNew);
}


