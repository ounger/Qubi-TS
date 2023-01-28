/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

// noinspection DuplicatedCode

import {
    Qubit,
    QUBIT_STATE_L,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_ZERO
} from '../../../lib/quantum/single-qubit/qubit';
import {
    ccx,
    chad,
    cphase,
    cs,
    cswap,
    ct,
    cx,
    cz,
    had,
    mchad,
    phase,
    phaseS,
    phaseT,
    phaseZ,
    rnot,
    rnotInverse,
    rot1,
    rotX,
    rotY,
    rotZ,
    swap,
    x
} from '../../../lib/quantum/multi-qubit/multi-qubit-gates';
import {_0, _1, Complex, MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO} from '../../../lib/math/complex';
import {QubitRegister} from '../../../lib/quantum/multi-qubit/qubit-register';
import {expOfiTimesAngleDegrees} from '../../../lib/math/math-util';
import {expComplexArraysToBeCloseTo} from '../../test-util';
import {
    QubitState,
    STATE_L,
    STATE_MINUS,
    STATE_ONE,
    STATE_PLUS,
    STATE_R,
    STATE_ZERO
} from '../../../lib/quantum/single-qubit/qubit-state';
import {BELL_STATE_PHI_PLUS, BELL_STATE_PSI_PLUS} from "../../../lib/quantum/multi-qubit/bell-states";

const expOfiTimesAngle45Degrees = expOfiTimesAngleDegrees(45);
const expOfiTimesAngle90Degrees = expOfiTimesAngleDegrees(90);
const expOfiTimesAngle180Degrees = expOfiTimesAngleDegrees(180);

describe('CX Tests: 2 Qubits', () => {

    test('Simple State: |00> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |01> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |10> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |11>  -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Superposition State: |+0> -> Bell Pair Phi-Plus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual(BELL_STATE_PHI_PLUS);
    });

    test('Superposition State: |+1> -> Bell Pair Psi-Plus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual(BELL_STATE_PSI_PLUS);
    });

    test('Superposition State: |-0> -> Bell Pair Phi-Minus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ZERO);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0), MINUS_ONE_OF_SQRT_TWO]);
    });

    test('Superposition State: |-1> -> Bell State Psi-Minus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ONE);
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, Complex.ofRe(-0)]);
    });

    test('First Qubit Target, Second Qubit Control', () => {
        let reg = createExampleRegister2Qubits();
        cx(reg, [1, 1], 0);
        expect(reg.getStates()).toEqual([EX_REG_2Q_S0, EX_REG_2Q_S3, EX_REG_2Q_S2, EX_REG_2Q_S1]);
    });

});

describe('CX Tests: 3 Qubits', () => {

    test('First Qubit Control, Second Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [0, 1], 1);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S6, EX_REG_3Q_S7, EX_REG_3Q_S4, EX_REG_3Q_S5]);
    });

    test('First Qubit Target, Second Control', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [1, 1], 0);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S6, EX_REG_3Q_S7,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S2, EX_REG_3Q_S3]);
    });

    test('First Qubit Control, Third Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [0, 1], 2);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S5, EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('First Qubit Target, Third Control', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [2, 1], 0);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S5, EX_REG_3Q_S2, EX_REG_3Q_S7,
            EX_REG_3Q_S4, EX_REG_3Q_S1, EX_REG_3Q_S6, EX_REG_3Q_S3]);
    });

    test('Second Qubit Control, Third Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [1, 1], 2);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S3, EX_REG_3Q_S2,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('Thrid Qubit Control, Second Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, [2, 1], 1);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S3, EX_REG_3Q_S2, EX_REG_3Q_S1,
            EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6, EX_REG_3Q_S5]);
    });

});

describe('Swap Tests', () => {

    test('Simple State: |00> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |01> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Simple State: |10> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |11> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Superposition State: |+0> -> |0+>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0]);
    });

    test('Superposition State: |+1> -> |1+>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
    });

    test('Superposition State: |-0> -> |0->', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0)]);
    });

    test('Superposition State: |-1> -> |1->', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([_0, Complex.ofRe(-0), ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]);
    });

    test('Swap Qubit 1 and Qubit 0', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 1, 0);
        expect(reg.getStates()).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S2,
            EX_REG_2Q_S1,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 0 and Qubit 0', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 0, 0);
        expect(reg.getStates()).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S1,
            EX_REG_2Q_S2,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 1 and Qubit 1', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 0, 0);
        expect(reg.getStates()).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S1,
            EX_REG_2Q_S2,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 0 and Qubit 1', () => {
        let reg = createExampleRegister3Qubits();
        swap(reg, 0, 1);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S4,
            EX_REG_3Q_S5,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7
        ]);
    });

});

describe('X Tests', () => {

    test('Simple State: |00> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Simple State: |00> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |01> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        x(reg, 0);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |01> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        x(reg, 1);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |10> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |10> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |11> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        x(reg, 0);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |11> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        x(reg, 1);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Superposition State: |+0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.getStates()).toEqual([ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0]);
    });

    test('Superposition State: |+0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.getStates()).toEqual([_0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO]);
    });

    test('3 Qubits, X on Qubit 0', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 0);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S4,
            EX_REG_3Q_S5,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7,
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3
        ]);
    });

    test('3 Qubits, X on Qubit 1', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 1);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7,
            EX_REG_3Q_S4,
            EX_REG_3Q_S5
        ]);
    });

    test('3 Qubits, X on Qubit 2', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 2);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S1,
            EX_REG_3Q_S0,
            EX_REG_3Q_S3,
            EX_REG_3Q_S2,
            EX_REG_3Q_S5,
            EX_REG_3Q_S4,
            EX_REG_3Q_S7,
            EX_REG_3Q_S6
        ]);
    });

});

describe('CCX Tests', () => {

    test('3 Qubits ccx(reg, c0 = 0, c1 = 1, c2 = 2)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, [[0, 1], [1, 1]], 2);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3, EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('3 Qubits ccx(reg, c0 = 0, c1 = 2, c2 = 1)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, [[0, 1], [2, 1]], 1);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3, EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6, EX_REG_3Q_S5]);
    });

    test('3 Qubits ccx(reg, c0 = 1, c1 = 2, c2 = 0)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, [[1, 1], [2, 1]], 0);
        expect(reg.getStates()).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S7, EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6, EX_REG_3Q_S3]);
    });

});

describe('Phase Tests', () => {

    test('Phase 45 on |0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_1, _0]);
    });

    test('Phase 45 on |1>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 0 of |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 0 of |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_0, _0, expOfiTimesAngle45Degrees, _0]);
    });

    test('Phase 45 on Qubit 1 of |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Phase 45 on Qubit 0 of |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        phase(reg, 1, 45);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle45Degrees, _0, _0]);
    });

    test('Phase 45 on Qubit 0 of |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 1 of |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        phase(reg, 1, 45);
        expect(reg.getStates()).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 0 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.getStates()).toEqual([_0, _0, expOfiTimesAngle45Degrees, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 2 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 2, 45);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 0 on |++>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        phase(reg, 0, 45);
        expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees)]);
    });

    test('Phase 45 on Qubit 1 of |++>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        phase(reg, 1, 45);
        expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees)]);
    });

});

describe('PhaseT Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseT(reg, 0);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle45Degrees]);
    });
});

describe('PhaseS Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseS(reg, 0);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle90Degrees]);
    });
});

describe('PhaseZ Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseZ(reg, 0);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle180Degrees]);
    });
});

describe('CPHASE Tests', () => {

    test('CPHASE 45 on |0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        cphase(reg, 0, 0, 45);
        expect(reg.getStates()).toEqual([_1, _0]);
    });

    test('CPHASE 45 on |1>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        cphase(reg, 0, 0, 45);
        expect(reg.getStates()).toEqual([_0, expOfiTimesAngle45Degrees]);
    });

    test('CPHASE 45 in |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        cphase(reg, 0, 1, 45);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0])
    });

    test('CPHASE 45 in |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        cphase(reg, 0, 1, 45);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0])
    });

    test('CPHASE 45 in |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        cphase(reg, 0, 1, 45);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0])
    });

    test('CPHASE 45 in |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        cphase(reg, 0, 1, 45);
        expect(reg.getStates()).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees])
    });

    test('CPHASE 45 on first and second qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 0, 1, 45);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6.mul(expOfiTimesAngle45Degrees), EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

    test('CPHASE 45 on first and third qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 0, 2, 45);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S4, EX_REG_3Q_S5.mul(expOfiTimesAngle45Degrees), EX_REG_3Q_S6, EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

    test('CPHASE 45 on second and third qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 1, 2, 45);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3.mul(expOfiTimesAngle45Degrees),
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6, EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

});

describe('CT Tests', () => {
    test('CT equals CPHASE 45', () => {
        let csReg = createExampleRegister3Qubits();
        let cphase45Reg = createExampleRegister3Qubits();
        ct(csReg, 0, 1);
        cphase(cphase45Reg, 0, 1, 45);
        expect(csReg.getStates()).toEqual(cphase45Reg.getStates());
    });
});

describe('CS Tests', () => {
    test('CS equals CPHASE 90', () => {
        let csReg = createExampleRegister3Qubits();
        let cphase90Reg = createExampleRegister3Qubits();
        cs(csReg, 0, 1);
        cphase(cphase90Reg, 0, 1, 90);
        expect(csReg.getStates()).toEqual(cphase90Reg.getStates());
    });
});

describe('CZ Tests', () => {
    test('CZ equals CPHASE 180', () => {
        let czReg = createExampleRegister3Qubits();
        let cphase180Reg = createExampleRegister3Qubits();
        cz(czReg, 0, 1);
        cphase(cphase180Reg, 0, 1, 180);
        expect(czReg.getStates()).toEqual(cphase180Reg.getStates());
    });
});

describe('hadSingle Tests', () => {

    test('hadSingle on first qubit of |0+> -> |++>', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        had(reg0, 0);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_PLUS);
        q0.had();
        let reg1 = QubitRegister.ofQubits(q0, q1);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

    test('hadSingle on second qubit of |0+> -> |00>', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        had(reg0, 1);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_PLUS);
        q1.had();
        let reg1 = QubitRegister.ofQubits(q0, q1);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

    test('hadSingle on first qubit of |0+1> -> |++1>', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        had(reg0, 0);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_PLUS);
        let q2 = Qubit.ofState(STATE_ONE);
        q0.had();
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

    test('hadSingle on second qubit of |0+1> -> |+01>', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        had(reg0, 1);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_PLUS);
        let q2 = Qubit.ofState(STATE_ONE);
        q1.had();
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

    test('hadSingle on third qubit of |0+1> -> |+0->', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        had(reg0, 2);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_PLUS);
        let q2 = Qubit.ofState(STATE_ONE);
        q2.had();
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

    test('TEST', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        had(reg0, 0);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = Qubit.ofState(STATE_ZERO);
        let q1 = Qubit.ofState(STATE_ZERO);
        let q2 = Qubit.ofState(STATE_ZERO);
        q0.had();
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

});

describe('Test Uebereinstimmung bei 4 Qubits', () => {

    test('Hadamard on first and third qubit', () => {
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE);
        had(reg0, 0);
        had(reg0, 2);
        expect(reg0.probabilities().reduce((p, c) => p + c, 0)).toBeCloseTo(1, 5);

        let q0 = Qubit.ofState(STATE_PLUS);
        let q1 = Qubit.ofState(STATE_ZERO);
        let q2 = Qubit.ofState(STATE_MINUS);
        let q3 = Qubit.ofState(STATE_ONE);
        q0.had();
        q2.had();
        let reg1 = QubitRegister.ofQubits(q0, q1, q2, q3);
        expect(reg1.probabilities().reduce((p, c) => p + c, 0)).toBeCloseTo(1, 5);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

});

describe('Uebereinstimmung bei vielen Qubits Test', () => {

    test('', () => {
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        had(reg0, 0);
        expect(reg0.probabilities().reduce((p, c) => p + c, 0)).toBeCloseTo(1, 5);

        let q0 = Qubit.ofState(STATE_ZERO);
        q0.had();
        let reg1 = QubitRegister.ofQubits(q0, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        expect(reg1.probabilities().reduce((p, c) => p + c, 0)).toBeCloseTo(1, 5);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    });

});

// describe('Test Performance', () => {
//
//     test('Performance', () => {
//         let reg0 = QubitRegister.ofQubits(
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
//         hadSingle(reg0, 0);
//
//         let q0 = Qubit.ofState(STATE_ZERO);
//         q0.had();
//         let reg1 = QubitRegister.ofQubits(
//             q0, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO,
//             QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
//
//         expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
//     });
//
// });

describe('Qiskit Examples', () => {

    test('CNOT(1, 0) on |0+> -> BELL_STATE_PHI_PLUS', () => {
        const reg = new QubitRegister(2);
        had(reg, 1);
        cx(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [ONE_OF_SQRT_TWO, _0, _0, ONE_OF_SQRT_TWO]);
    });

    test('CNOT(1, 0) on |++> -> |++>', () => {
        const reg = new QubitRegister(2);
        had(reg, 0);
        had(reg, 1);
        cx(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(0.5), Complex.ofRe(0.5), Complex.ofRe(0.5), Complex.ofRe(0.5)]);
    });

    test('CNOT(1, 0) on |-+> -> ket(--)', () => {
        const reg = new QubitRegister(2);
        had(reg, 1);
        x(reg, 0);
        had(reg, 0);
        cx(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(0.5), Complex.ofRe(-0.5), Complex.ofRe(-0.5), Complex.ofRe(0.5)]);
    });

    test('Phase Kickback: CNOT(1, 0) on ket(-+) -> ket(--)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_PLUS);
        cx(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(0.5), Complex.ofRe(-0.5), Complex.ofRe(-0.5), Complex.ofRe(0.5)]);
    });

});

describe('Reconstructing gates from other gates', () => {

    test('Constructing a CNOT(0, 1) from Hadamard gates and a single CNOT(1, 0)', () => {
        const reg0 = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        had(reg0, 0);
        had(reg0, 1);
        cx(reg0, [1, 1], 0);
        had(reg0, 0);
        had(reg0, 1);

        const reg1 = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        cx(reg1, [0, 1], 1);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
        expComplexArraysToBeCloseTo(reg0.getStates(), [_0, _0, _0, _1]);
    });

    test('Reconstructing: CZ from Hadamards and CNOT', () => {
        function applyTest(qubit0: Qubit, qubit1: Qubit) {
            const conReg = QubitRegister.ofQubits(qubit0, qubit1);
            had(conReg, 1);
            cx(conReg, [0, 1], 1);
            had(conReg, 1);

            const czReg = QubitRegister.ofQubits(qubit0, qubit1);
            cz(czReg, 0, 1);

            expComplexArraysToBeCloseTo(conReg.getStates(), czReg.getStates());
        }

        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        applyTest(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS);
        applyTest(QUBIT_STATE_L, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_L, QUBIT_STATE_PLUS);
    });

    test('Reconstructing: CH from RotY(PI/4) and CNOT', () => {
        // TODO see https://qiskit.org/textbook/ch-gates/more-circuit-identities.html
    });

    test('Reconstructing: SWAP = CNOT(1, 0) CNOT(0, 1) CNOT(1, 0)', () => {
        // This would work also if we changed the order of the CNOT gates
        function applyTest(qubit0: Qubit, qubit1: Qubit) {
            const conReg = QubitRegister.ofQubits(qubit0, qubit1);
            cx(conReg, [1, 1], 0);
            cx(conReg, [0, 1], 1);
            cx(conReg, [1, 1], 0);

            const swap01Reg = QubitRegister.ofQubits(qubit0, qubit1);
            swap(swap01Reg, 0, 1);

            const swap10Reg = QubitRegister.ofQubits(qubit0, qubit1);
            swap(swap10Reg, 1, 0);

            expComplexArraysToBeCloseTo(conReg.getStates(), swap01Reg.getStates());
            expComplexArraysToBeCloseTo(conReg.getStates(), swap10Reg.getStates());
        }

        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        applyTest(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS);
        applyTest(QUBIT_STATE_L, QUBIT_STATE_ONE);
        applyTest(QUBIT_STATE_L, QUBIT_STATE_PLUS);
    });

});

describe('hadMulti', () => {

    test('H tensor H on ket(00) -> ket(++)', () => {
        // TODO
    });

    test('H tensor H on ket(01) -> ket(+-)', () => {
        // TODO
    });

    test('H tensor H on ket(10) -> ket(-+)', () => {
        // TODO
    });

    test('H tensor H on ket(11) -> ket(--)', () => {
        // TODO
    });

});

describe("Rot1", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 90, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 90, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, angleDegrees: number, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rot1(reg0, applyToQubit, angleDegrees);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rot1(angleDegrees);
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rot1(angleDegrees);
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe("RotX", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 90, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 90, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, angleDegrees: number, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rotX(reg0, applyToQubit, angleDegrees);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rotX(angleDegrees);
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rotX(angleDegrees);
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe("RotY", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 90, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 90, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, angleDegrees: number, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rotY(reg0, applyToQubit, angleDegrees);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rotY(angleDegrees);
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rotY(angleDegrees);
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe("RotZ", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 90, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 90, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 180, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, angleDegrees: number, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rotZ(reg0, applyToQubit, angleDegrees);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rotZ(angleDegrees);
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rotZ(angleDegrees);
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe("RNOT", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rnot(reg0, applyToQubit);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rnot();
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rnot();
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe("RNOT Inverse", () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState) {
        applyTestToQubit(firstQubitState, secondQubitState, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 0);
        applyTestToQubit(firstQubitState, secondQubitState, 1);
        applyTestToQubit(firstQubitState, secondQubitState, 1);
    }

    function applyTestToQubit(firstQubitState: QubitState, secondQubitState: QubitState, applyToQubit: number) {
        const reg0 = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        rnotInverse(reg0, applyToQubit);

        const firstQubit = Qubit.ofState(firstQubitState);
        if (applyToQubit === 0) {
            firstQubit.rnotInverse();
        }
        const secondQubit = Qubit.ofState(secondQubitState);
        if (applyToQubit === 1) {
            secondQubit.rnotInverse();
        }
        const reg1 = QubitRegister.ofQubits(firstQubit, secondQubit);

        expComplexArraysToBeCloseTo(reg0.getStates(), reg1.getStates());
    }

    test('Test cases', () => {
        applyTest(STATE_ZERO, STATE_ZERO);
        applyTest(STATE_ZERO, STATE_ONE);
        applyTest(STATE_ONE, STATE_ZERO);
        applyTest(STATE_ONE, STATE_ONE);
        applyTest(STATE_PLUS, STATE_ZERO);
        applyTest(STATE_ONE, STATE_MINUS);
        applyTest(STATE_R, STATE_L);
    });

});

describe('Controlled Hadamard', () => {

    test('ket(00), first qubit control, second target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO); // [1, 0, 0, 0]
        chad(reg, [0, 1], 1);
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0, _0, _0]);
    });

    test('ket(01), first qubit control, second target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE); // [0, 1, 0, 0]
        chad(reg, [0, 1], 1);
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _1, _0, _0]);
    });

    test('ket(10), first qubit control, second target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO); // [0, 0, 1, 0]
        chad(reg, [0, 1], 1);
        expComplexArraysToBeCloseTo(reg.getStates(), QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_PLUS).getStates());
    });

    test('ket(11), first qubit control, second target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE); // [0, 0, 0, 1]
        chad(reg, [0, 1], 1);
        expComplexArraysToBeCloseTo(reg.getStates(), QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_MINUS).getStates());
    });

    test('ket(00), second qubit control, first target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO); // [1, 0, 0, 0]
        chad(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0, _0, _0]);
    });

    test('ket(01), second qubit control, first target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE); // [0, 1, 0, 0]
        chad(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE).getStates());
    });

    test('ket(10), second qubit control, first target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO); // [0, 0, 1, 0]
        chad(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _1, _0]);
    });

    test('ket(11), second qubit control, first target', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE); // [0, 0, 0, 1]
        chad(reg, [1, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(), QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ONE).getStates());
    });

    test('ket(010) control 1, target 2', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        chad(reg, [1, 1], 2);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS).getStates());
    });

    test('ket(011) control 1, target 2', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        chad(reg, [1, 1], 2);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_MINUS).getStates());
    });

    test('ket(001) control 2, target 0', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        chad(reg, [2, 1], 0);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO, QUBIT_STATE_ONE).getStates());
    });

});

describe('mchad', () => {

    test("010, c0 = 1, c1 = 2, target = 0", () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        mchad(reg, [[1, 1], [2, 1]], 0);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO).getStates());
    });

    test("011, c0 = 1, c1 = 2, target = 0", () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        mchad(reg, [[1, 1], [2, 1]], 0);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ONE).getStates());
    });

    test("010, c0 = 1, c1 = 2, target = 0 by 0", () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        mchad(reg, [[1, 1], [2, 0]], 0);
        expComplexArraysToBeCloseTo(reg.getStates(),
            QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO).getStates());
    });

});

describe('cswap', () => {

    test('t1 > t0', () => {
        // The implementation behind cswap swaps the indices if firstTarget > secondTarget
        let reg = createExampleRegister3Qubits();
        cswap(reg, [0, 1], 2, 1);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S4,
            EX_REG_3Q_S6,
            EX_REG_3Q_S5,
            EX_REG_3Q_S7
        ]);
    });

    test('Swap by 0', () => {
        let reg = createExampleRegister3Qubits();
        cswap(reg, [2, 0], 0, 1);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S4,
            EX_REG_3Q_S3,
            EX_REG_3Q_S2,
            EX_REG_3Q_S5,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7
        ]);

    });

    test('3 Qubits - c t0 t1', () => {
        let reg = createExampleRegister3Qubits();
        cswap(reg, [0, 1], 1, 2);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S4,
            EX_REG_3Q_S6,
            EX_REG_3Q_S5,
            EX_REG_3Q_S7
        ]);
    });

    test('3 Qubits - t0 c t1', () => {
        let reg = createExampleRegister3Qubits();
        cswap(reg, [1, 1], 0, 2);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S6,
            EX_REG_3Q_S4,
            EX_REG_3Q_S5,
            EX_REG_3Q_S3,
            EX_REG_3Q_S7
        ]);
    });

    test('3 Qubits - t0 t1 c', () => {
        let reg = createExampleRegister3Qubits();
        cswap(reg, [2, 1], 0, 1);
        expect(reg.getStates()).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S5,
            EX_REG_3Q_S4,
            EX_REG_3Q_S3,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7
        ]);
    });

    test('4 Qubits - c t0 t1 o', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [0, 1], 1, 2);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S5,
            EX_REG_4Q_S6,
            EX_REG_4Q_S7,
            EX_REG_4Q_S8,
            EX_REG_4Q_S9,
            EX_REG_4Q_S12,
            EX_REG_4Q_S13,
            EX_REG_4Q_S10,
            EX_REG_4Q_S11,
            EX_REG_4Q_S14,
            EX_REG_4Q_S15,
        ]);
    });

    test('4 Qubits - c t0 o t1', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [0, 1], 1, 3);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S5,
            EX_REG_4Q_S6,
            EX_REG_4Q_S7,
            EX_REG_4Q_S8,
            EX_REG_4Q_S12,
            EX_REG_4Q_S10,
            EX_REG_4Q_S14,
            EX_REG_4Q_S9,
            EX_REG_4Q_S13,
            EX_REG_4Q_S11,
            EX_REG_4Q_S15,
        ]);
    });

    test('4 Qubits - c o t0 t1', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [0, 1], 2, 3);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S5,
            EX_REG_4Q_S6,
            EX_REG_4Q_S7,
            EX_REG_4Q_S8,
            EX_REG_4Q_S10,
            EX_REG_4Q_S9,
            EX_REG_4Q_S11,
            EX_REG_4Q_S12,
            EX_REG_4Q_S14,
            EX_REG_4Q_S13,
            EX_REG_4Q_S15,
        ]);
    });

    test('4 Qubits - t0 c t1 o', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [1, 1], 0, 2);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S5,
            EX_REG_4Q_S12,
            EX_REG_4Q_S13,
            EX_REG_4Q_S8,
            EX_REG_4Q_S9,
            EX_REG_4Q_S10,
            EX_REG_4Q_S11,
            EX_REG_4Q_S6,
            EX_REG_4Q_S7,
            EX_REG_4Q_S14,
            EX_REG_4Q_S15,
        ]);
    });

    test('4 Qubits - t0 c o t1', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [1, 1], 0, 3);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S12,
            EX_REG_4Q_S6,
            EX_REG_4Q_S14,
            EX_REG_4Q_S8,
            EX_REG_4Q_S9,
            EX_REG_4Q_S10,
            EX_REG_4Q_S11,
            EX_REG_4Q_S5,
            EX_REG_4Q_S13,
            EX_REG_4Q_S7,
            EX_REG_4Q_S15,
        ]);
    });

    test('4 Qubits - o c t0 t1', () => {
        let reg = createExampleRegister4Qubits();
        cswap(reg, [1, 1], 2, 3);
        expect(reg.getStates()).toEqual([
            EX_REG_4Q_S0,
            EX_REG_4Q_S1,
            EX_REG_4Q_S2,
            EX_REG_4Q_S3,
            EX_REG_4Q_S4,
            EX_REG_4Q_S6,
            EX_REG_4Q_S5,
            EX_REG_4Q_S7,
            EX_REG_4Q_S8,
            EX_REG_4Q_S9,
            EX_REG_4Q_S10,
            EX_REG_4Q_S11,
            EX_REG_4Q_S12,
            EX_REG_4Q_S14,
            EX_REG_4Q_S13,
            EX_REG_4Q_S15,
        ]);
    });

})
;

/* Example Register of 2 Qubits State x */
const EX_REG_2Q_S0: Complex = Complex.ofRe(Math.sqrt(0.1));
const EX_REG_2Q_S1: Complex = Complex.ofRe(Math.sqrt(0.2));
const EX_REG_2Q_S2: Complex = Complex.ofRe(Math.sqrt(0.3));
const EX_REG_2Q_S3: Complex = Complex.ofRe(Math.sqrt(0.4));

function createExampleRegister2Qubits(): QubitRegister {
    return QubitRegister.ofStates([
        EX_REG_2Q_S0,
        EX_REG_2Q_S1,
        EX_REG_2Q_S2,
        EX_REG_2Q_S3
    ]);
}

const EX_REG_3Q_S0: Complex = Complex.ofRe(Math.sqrt(0.11));
const EX_REG_3Q_S1: Complex = Complex.ofRe(Math.sqrt(0.12));
const EX_REG_3Q_S2: Complex = Complex.ofRe(Math.sqrt(0.13));
const EX_REG_3Q_S3: Complex = Complex.ofRe(Math.sqrt(0.14));
const EX_REG_3Q_S4: Complex = Complex.ofRe(Math.sqrt(0.105));
const EX_REG_3Q_S5: Complex = Complex.ofRe(Math.sqrt(0.115));
const EX_REG_3Q_S6: Complex = Complex.ofRe(Math.sqrt(0.135));
const EX_REG_3Q_S7: Complex = Complex.ofRe(Math.sqrt(0.145));

function createExampleRegister3Qubits(): QubitRegister {
    return QubitRegister.ofStates([
        EX_REG_3Q_S0,
        EX_REG_3Q_S1,
        EX_REG_3Q_S2,
        EX_REG_3Q_S3,
        EX_REG_3Q_S4,
        EX_REG_3Q_S5,
        EX_REG_3Q_S6,
        EX_REG_3Q_S7
    ]);
}

const EX_REG_4Q_S0: Complex = Complex.ofRe(Math.sqrt(0.01));
const EX_REG_4Q_S1: Complex = Complex.ofRe(Math.sqrt(0.02));
const EX_REG_4Q_S2: Complex = Complex.ofRe(Math.sqrt(0.03));
const EX_REG_4Q_S3: Complex = Complex.ofRe(Math.sqrt(0.04));
const EX_REG_4Q_S4: Complex = Complex.ofRe(Math.sqrt(0.015));
const EX_REG_4Q_S5: Complex = Complex.ofRe(Math.sqrt(0.035));
const EX_REG_4Q_S6: Complex = Complex.ofRe(Math.sqrt(0.05));
const EX_REG_4Q_S7: Complex = Complex.ofRe(Math.sqrt(0.1));
const EX_REG_4Q_S8: Complex = Complex.ofRe(Math.sqrt(0.06));
const EX_REG_4Q_S9: Complex = Complex.ofRe(Math.sqrt(0.07));
const EX_REG_4Q_S10: Complex = Complex.ofRe(Math.sqrt(0.075));
const EX_REG_4Q_S11: Complex = Complex.ofRe(Math.sqrt(0.095));
const EX_REG_4Q_S12: Complex = Complex.ofRe(Math.sqrt(0.085));
const EX_REG_4Q_S13: Complex = Complex.ofRe(Math.sqrt(0.105));
const EX_REG_4Q_S14: Complex = Complex.ofRe(Math.sqrt(0.13));
const EX_REG_4Q_S15: Complex = Complex.ofRe(Math.sqrt(0.08));

function createExampleRegister4Qubits(): QubitRegister {
    return QubitRegister.ofStates([
        EX_REG_4Q_S0,
        EX_REG_4Q_S1,
        EX_REG_4Q_S2,
        EX_REG_4Q_S3,
        EX_REG_4Q_S4,
        EX_REG_4Q_S5,
        EX_REG_4Q_S6,
        EX_REG_4Q_S7,
        EX_REG_4Q_S8,
        EX_REG_4Q_S9,
        EX_REG_4Q_S10,
        EX_REG_4Q_S11,
        EX_REG_4Q_S12,
        EX_REG_4Q_S13,
        EX_REG_4Q_S14,
        EX_REG_4Q_S15
    ]);
}
