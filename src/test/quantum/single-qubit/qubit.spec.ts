/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {
    Qubit,
    QUBIT_STATE_L,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_R,
    QUBIT_STATE_ZERO
} from '../../../lib/quantum/single-qubit/qubit';
import {
    QubitState,
    STATE_L,
    STATE_MINUS,
    STATE_MINUS_ONE,
    STATE_ONE,
    STATE_PLUS,
    STATE_R,
    STATE_ZERO
} from '../../../lib/quantum/single-qubit/qubit-state';
import {
    _0,
    Complex,
    HALF_SQRT_TWO_HALF_i_SQRT_TWO,
    i,
    i_OF_SQRT_TWO,
    MINUS_1,
    MINUS_i,
    MINUS_i_OF_SQRT_TWO,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from '../../../lib/math/complex';
import {expNumberArraysToBeCloseTo, expQubitsToBeCloseTo} from '../../test-util';
import {round} from '../../../lib/math/math-util';

describe('Probability Tests', () => {

    test('bra(0)ket(1)', () => {
        expect(QUBIT_STATE_ZERO.probabilityOfState(STATE_ZERO)).toEqual(1);
    });

    test('bra(1)ket(0)', () => {
        expect(QUBIT_STATE_ZERO.probabilityOfState(STATE_ONE)).toEqual(0);
    });

    test('bra(1)ket(+)', () => {
        expect(QUBIT_STATE_ONE.probabilityOfState(STATE_PLUS)).toBeCloseTo(0.5, 5);
    });

    test('bra(1)ket(+)', () => {
        expect(QUBIT_STATE_ZERO.probabilityOfState(STATE_PLUS)).toBeCloseTo(0.5, 5);
    });

    test('Probability of measuring a vector in state ket(-)', () => {
        expect(Qubit.of(Complex.ofRe(3 / 5), Complex.ofRe(4 / 5)).probabilityOfState(STATE_MINUS)).toBeCloseTo(1 / 50, 5);
    });

});


describe('Identity Tests', () => {

    test('I|0> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.identity();
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

    test('I|1> = |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.identity();
        expect(qubit.state()).toEqual(STATE_ONE);
    });

});

describe('Pauli-X Tests', () => {

    test('X|0> = |1>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.x();
        expect(qubit.state()).toEqual(STATE_ONE);
    });

    test('X|1> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.x();
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

});

describe('Pauli-Y Tests', () => {

    test('Y|0> = i|1>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.y();
        expect(qubit.state()).toEqual([_0, i]);
    });

    test('Y|1> = -i|0>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.y();
        expect(qubit.state()).toEqual([MINUS_i, _0]);
    });

});

describe('Pauli-Z Tests', () => {

    test('Z|0> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.z();
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

    test('Z|1> = -|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.z();
        expect(qubit.state()).toEqual(STATE_MINUS_ONE);
    });

});

describe('Hadamard Tests', () => {

    test('H|0> = |+>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.had();
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

    test('H|1> = |->', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.had();
        expect(qubit).toEqual(QUBIT_STATE_MINUS);
    });

    test('H|+> = |0>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        qubit.had();
        expQubitsToBeCloseTo(qubit, QUBIT_STATE_ZERO);
    });

    test('H|-> = |1>', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        qubit.had();
        expQubitsToBeCloseTo(qubit, QUBIT_STATE_ONE);
    });

});

describe('Combined Tests', () => {

    test('XH|0> -> |+>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.had();
        qubit.x();
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

    test('XH|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.had();
        qubit.x()
        expect(qubit.state()).toEqual([MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
    });

});

describe('Probabilities', () => {

    test('H|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.had();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0.5);
        expect(round(result[1], 1)).toEqual(0.5);
    });

    test('H|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.had();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0.5);
        expect(round(result[1], 1)).toEqual(0.5);
    });

    test('X|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.x();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0);
        expect(round(result[1], 1)).toEqual(1);
    });

    test('X|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.x();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Y|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.y();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0);
        expect(round(result[1], 1)).toEqual(1);
    });

    test('Y|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.y();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Z|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.z();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Z|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.z();
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0);
        expect(round(result[1], 1)).toEqual(1);
    });

});

describe('Measure', () => {

    test('Measure(|0>) -> 0', () => {
        expect(Qubit.ofState(STATE_ZERO).measure()).toEqual(0);
    });

    test('Measure(|1>) -> 1', () => {
        expect(Qubit.ofState(STATE_ONE).measure()).toEqual(1);
    });

});

describe('Measuring multiple times always returns the same result', () => {

    test('Measure H|0> multiple times', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.had();
        const result = qubit.measure();
        for (let i = 0; i < 10; i++) {
            expect(qubit.measure()).toEqual(result);
        }
    });

});

describe('Phase-T', () => {

    test('Phase-T on |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.phaseT();
        expect(qubit).toEqual(QUBIT_STATE_ZERO);
    });

    test('Phase-T on |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.phaseT();
        expect(qubit).toEqual(Qubit.of(_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO));
    });

    test('Phase-T on |+>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        qubit.phaseT();
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, 0.5)));
    });

    test('Phase-T on |->', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        qubit.phaseT();
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, -0.5)));
    });

    test('Phase-T on |R>', () => {
        const qubit = Qubit.ofState(STATE_R);
        qubit.phaseT();
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, 0.5)));
    });

    test('Phase-T on |L>', () => {
        const qubit = Qubit.ofState(STATE_L);
        qubit.phaseT();
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, -0.5)));
    });

});

describe('Phase-S', () => {

    test('Phase-S on |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        qubit.phaseS();
        expect(qubit).toEqual(QUBIT_STATE_ZERO);
    });

    test('Phase-S on |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        qubit.phaseS();
        expect(qubit).toEqual(Qubit.of(_0, i));
    });

    test('Phase-S on |+>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        qubit.phaseS();
        expect(qubit).toEqual(QUBIT_STATE_R);
    });

    test('Phase-S on |->', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        qubit.phaseS();
        expect(qubit).toEqual(QUBIT_STATE_L);
    });

    test('Phase-S on |R>', () => {
        const qubit = Qubit.ofState(STATE_R);
        qubit.phaseS();
        expect(qubit).toEqual(QUBIT_STATE_MINUS);
    });

    test('Phase-S on |L>', () => {
        const qubit = Qubit.ofState(STATE_L);
        qubit.phaseS();
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

});

describe('Phase-Z', () => {

    test('Phase-Z on |0>', () => {
        const phaseZQubit = Qubit.ofState(STATE_ZERO);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_ZERO);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |1>', () => {
        const phaseZQubit = Qubit.ofState(STATE_ONE);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_ONE);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |+>', () => {
        const phaseZQubit = Qubit.ofState(STATE_PLUS);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_PLUS);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |->', () => {
        const phaseZQubit = Qubit.ofState(STATE_MINUS);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_MINUS);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |R>', () => {
        const phaseZQubit = Qubit.ofState(STATE_R);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_R);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |L>', () => {
        const phaseZQubit = Qubit.ofState(STATE_L);
        phaseZQubit.phaseZ();

        const zQubit = Qubit.ofState(STATE_L);
        zQubit.z();

        expect(phaseZQubit).toEqual(zQubit);
    });

});

describe('Phase', () => {

    test('Test against phaseT', () => {
        function applyTest(state: QubitState): void {
            const phaseQubit = Qubit.ofState(state);
            phaseQubit.phase(45);

            const phaseTQubit = Qubit.ofState(state);
            phaseTQubit.phaseT();

            expQubitsToBeCloseTo(phaseQubit, phaseTQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

    test('Test against phaseS', () => {
        function applyTest(state: QubitState): void {
            const phaseQubit = Qubit.ofState(state);
            phaseQubit.phase(90);

            const phaseSQubit = Qubit.ofState(state);
            phaseSQubit.phaseS();

            expQubitsToBeCloseTo(phaseQubit, phaseSQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

    test('Test against phaseZ', () => {
        function applyTest(state: QubitState): void {
            const phaseQubit = Qubit.ofState(state);
            phaseQubit.phase(180);

            const phaseZQubit = Qubit.ofState(state);
            phaseZQubit.phaseZ();

            expQubitsToBeCloseTo(phaseQubit, phaseZQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

    test('More Tests', () => {
        function applyTest(phaseQubit: Qubit, phaseDegrees: number, expQubit: Qubit): void {
            phaseQubit.phase(phaseDegrees);
            expQubitsToBeCloseTo(phaseQubit, expQubit);
        }

        applyTest(Qubit.ofState(STATE_ZERO), 270, QUBIT_STATE_ZERO);
        applyTest(Qubit.ofState(STATE_ONE), 270, Qubit.of(_0, MINUS_i));
        applyTest(Qubit.ofState(STATE_PLUS), 270, QUBIT_STATE_L);
        applyTest(Qubit.ofState(STATE_MINUS), 270, QUBIT_STATE_R);
        applyTest(Qubit.ofState(STATE_R), 270, QUBIT_STATE_PLUS);
        applyTest(Qubit.ofState(STATE_L), 270, QUBIT_STATE_MINUS);
    });

});

describe('Reconstructing gates from other gates', () => {

    test('Reconstructing: Z = HXH', () => {
        function applyTest(state: QubitState) {
            const conQubit = Qubit.ofState(state);
            conQubit.had();
            conQubit.x();
            conQubit.had();

            const zQubit = Qubit.ofState(state);
            zQubit.z();

            expQubitsToBeCloseTo(conQubit, zQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

    test('Reconstructing: X = HZH', () => {
        function applyTest(state: QubitState) {
            const conQubit = Qubit.ofState(state);
            conQubit.had();
            conQubit.z();
            conQubit.had();

            const xQubit = Qubit.ofState(state);
            xQubit.x();

            expQubitsToBeCloseTo(conQubit, xQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

});

/**
 * See {@link https://quantumcomputinguk.org/tutorials/introduction-to-the-rx-gate-with-code}
 */
describe('ROT-X', () => {

    function applyTest(state: QubitState, angleDegrees: number, expState: QubitState) {
        const qubit = Qubit.ofState(state);
        qubit.rotX(angleDegrees);
        expQubitsToBeCloseTo(qubit, Qubit.ofState(expState));
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO, 180, [_0, MINUS_i]);
        applyTest(STATE_ONE, 180, [MINUS_i, _0]);
    });

});

/**
 * See {@link https://quantumcomputinguk.org/tutorials/introduction-to-the-ry-gate-with-code}
 */
describe('ROT-Y', () => {

    function applyTest(state: QubitState, angleDegrees: number, expState: QubitState) {
        const qubit = Qubit.ofState(state);
        qubit.rotY(angleDegrees);
        expQubitsToBeCloseTo(qubit, Qubit.ofState(expState));
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO, 180, STATE_ONE);
        applyTest(STATE_ONE, 180, [MINUS_1, _0]);
        applyTest(STATE_MINUS, 180, STATE_PLUS);
        applyTest(STATE_PLUS, 180, [MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
    });

});

/**
 * See {@link https://quantumcomputinguk.org/tutorials/introduction-to-the-rz-gate-with-code}
 */
describe('ROT-Z', () => {

    function applyTest(state: QubitState, angleDegrees: number, expState: QubitState) {
        const qubit = Qubit.ofState(state);
        qubit.rotZ(angleDegrees);
        expQubitsToBeCloseTo(qubit, Qubit.ofState(expState));
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO, 180, [MINUS_i, _0]);
        applyTest(STATE_ONE, 180, [_0, i]);
        applyTest(STATE_PLUS, 180, [MINUS_i_OF_SQRT_TWO, i_OF_SQRT_TWO]);
    });

});

/**
 * See {@link https://www.strathweb.com/2021/12/difference-between-r1-and-rz-gate-in-quantum-computing/}
 */
describe('ROT-1', () => {

    test('Test Cases', () => {
        function applyTest(state: QubitState, angleDegrees: number, expState: QubitState) {
            const qubit = Qubit.ofState(state);
            qubit.rot1(angleDegrees);
            expQubitsToBeCloseTo(qubit, Qubit.ofState(expState));
        }

        applyTest(STATE_PLUS, 90, STATE_R);
        applyTest(STATE_R, 90, STATE_MINUS);
        applyTest(STATE_MINUS, 90, STATE_L);
        applyTest(STATE_L, 90, STATE_PLUS);
    });

    test('Test against phaseS', () => {
        function applyTest(state: QubitState): void {
            const rot1Qubit = Qubit.ofState(state);
            rot1Qubit.rot1(90);

            const phaseSQubit = Qubit.ofState(state);
            phaseSQubit.phaseS();

            expQubitsToBeCloseTo(rot1Qubit, phaseSQubit);
        }

        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

});

describe('RNOT = HAD Phase 90 Degrees HAD', () => {

    function applyTest(state: QubitState) {
        const rnotQubit = Qubit.ofState(state);
        rnotQubit.rnot();

        const otherQubit = Qubit.ofState(state);
        otherQubit.had();
        otherQubit.phaseS();
        otherQubit.had();

        expQubitsToBeCloseTo(rnotQubit, otherQubit);
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_MINUS);
        applyTest(STATE_PLUS);
        applyTest(STATE_L);
        applyTest(STATE_R);
    });


});

describe('RNOT RNOT = NOT', () => {

    function applyTest(state: QubitState) {
        const rnotQubit = Qubit.ofState(state);
        rnotQubit.rnot();
        rnotQubit.rnot();

        const otherQubit = Qubit.ofState(state);
        otherQubit.x();

        expQubitsToBeCloseTo(rnotQubit, otherQubit);
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_MINUS);
        applyTest(STATE_PLUS);
        applyTest(STATE_L);
        applyTest(STATE_R);
    });

});

describe('RNOT Inverse = HAD Phase -90 Degrees HAD', () => {

    function applyTest(state: QubitState) {
        const rnotQubit = Qubit.ofState(state);
        rnotQubit.rnotInverse();

        const otherQubit = Qubit.ofState(state);
        otherQubit.had();
        otherQubit.phase(-90);
        otherQubit.had();

        expQubitsToBeCloseTo(rnotQubit, otherQubit);
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_MINUS);
        applyTest(STATE_PLUS);
        applyTest(STATE_L);
        applyTest(STATE_R);
    });

});

describe('RNOT RNOT Inverse = I', () => {

    function applyTest(state: QubitState) {
        const rnotQubit = Qubit.ofState(state);
        rnotQubit.rnot();
        rnotQubit.rnotInverse();
        expQubitsToBeCloseTo(rnotQubit, Qubit.ofState(state));
    }

    test('Test Cases', () => {
        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_MINUS);
        applyTest(STATE_PLUS);
        applyTest(STATE_L);
        applyTest(STATE_R);
    });

});

describe('calcCartesianCoordinates', () => {

    test('ket(0)', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        expect(qubit.calcCartesianCoordinates()).toEqual([0, 0, 1]);
    });

    test('ket(1)', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        expect(qubit.calcCartesianCoordinates()).toEqual([0, 0, -1]);
    });

    test('ket(+)', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        expNumberArraysToBeCloseTo(qubit.calcCartesianCoordinates(), [1, 0, 0])
    });

    test('ket(-)', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        expNumberArraysToBeCloseTo(qubit.calcCartesianCoordinates(), [-1, 0, 0]);
    });

    test('ket(R)', () => {
        const qubit = Qubit.ofState(STATE_R);
        expNumberArraysToBeCloseTo(qubit.calcCartesianCoordinates(), [0, 1, 0]);
    });

    test('ket(L)', () => {
        const qubit = Qubit.ofState(STATE_L);
        expNumberArraysToBeCloseTo(qubit.calcCartesianCoordinates(), [0, -1, 0]);
    });

});
