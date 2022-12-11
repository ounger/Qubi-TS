// noinspection DuplicatedCode

import {
    had,
    identity,
    phase,
    phaseS,
    phaseT,
    phaseZ,
    rnot,
    roty,
    x,
    y,
    z
} from '../../../../main/ch.oliverunger/logic/gates/single-qubit-gates';
import {
    Qubit,
    QUBIT_STATE_L,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_R,
    QUBIT_STATE_ZERO
} from "../../../../main/ch.oliverunger/model/qubit";
import {
    _0,
    Complex,
    HALF_SQRT_TWO_HALF_i_SQRT_TWO,
    i,
    MINUS_i,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from "../../../../main/ch.oliverunger/model/math/complex";
import {round} from "../../../../main/ch.oliverunger/logic/math/math-util";
import {expQubitsToBeCloseTo} from "../../test-utils/test-util";
import {
    QubitState,
    STATE_L,
    STATE_MINUS,
    STATE_MINUS_ONE,
    STATE_ONE,
    STATE_PLUS,
    STATE_R,
    STATE_ZERO
} from "../../../../main/ch.oliverunger/model/qubit-state";

describe('Identity Tests', () => {

    test('I|0> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        identity(qubit);
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

    test('I|1> = |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        identity(qubit);
        expect(qubit.state()).toEqual(STATE_ONE);
    });

});

describe('Pauli-X Tests', () => {

    test('X|0> = |1>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        x(qubit);
        expect(qubit.state()).toEqual(STATE_ONE);
    });

    test('X|1> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        x(qubit);
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

});

describe('Pauli-Y Tests', () => {

    test('Y|0> = i|1>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        y(qubit);
        expect(qubit.state()).toEqual([_0, i]);
    });

    test('Y|1> = -i|0>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        y(qubit);
        expect(qubit.state()).toEqual([MINUS_i, _0]);
    });

});

describe('Pauli-Z Tests', () => {

    test('Z|0> = |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        z(qubit);
        expect(qubit.state()).toEqual(STATE_ZERO);
    });

    test('Z|1> = -|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        z(qubit);
        expect(qubit.state()).toEqual(STATE_MINUS_ONE);
    });

});

describe('Hadamard Tests', () => {

    test('H|0> = |+>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        had(qubit);
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

    test('H|1> = |->', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        had(qubit);
        expect(qubit).toEqual(QUBIT_STATE_MINUS);
    });

    test('H|+> = |0>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        had(qubit);
        expQubitsToBeCloseTo(qubit, QUBIT_STATE_ZERO);
    });

    test('H|-> = |1>', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        had(qubit);
        expQubitsToBeCloseTo(qubit, QUBIT_STATE_ONE);
    });

});

describe('Combined Tests', () => {

    test('XH|0> -> |+>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        had(qubit);
        x(qubit);
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

    test('XH|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        had(qubit);
        x(qubit)
        expect(qubit.state()).toEqual([MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
    });

});

describe('Probabilities', () => {

    test('H|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        had(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0.5);
        expect(round(result[1], 1)).toEqual(0.5);
    });

    test('H|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        had(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0.5);
        expect(round(result[1], 1)).toEqual(0.5);
    });

    test('X|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        x(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0);
        expect(round(result[1], 1)).toEqual(1);
    });

    test('X|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        x(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Y|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        y(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(0);
        expect(round(result[1], 1)).toEqual(1);
    });

    test('Y|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        y(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Z|0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        z(qubit);
        const result: number[] = qubit.probabilities();
        expect(round(result[0], 1)).toEqual(1);
        expect(round(result[1], 1)).toEqual(0);
    });

    test('Z|1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        z(qubit);
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
        had(qubit);
        const result = qubit.measure();
        for (let i = 0; i < 10; i++) {
            expect(qubit.measure()).toEqual(result);
        }
    });

});

describe('Phase-T', () => {

    test('Phase-T on |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        phaseT(qubit);
        expect(qubit).toEqual(QUBIT_STATE_ZERO);
    });

    test('Phase-T on |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        phaseT(qubit);
        expect(qubit).toEqual(Qubit.of(_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO));
    });

    test('Phase-T on |+>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        phaseT(qubit);
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, 0.5)));
    });

    test('Phase-T on |->', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        phaseT(qubit);
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, -0.5)));
    });

    test('Phase-T on |R>', () => {
        const qubit = Qubit.ofState(STATE_R);
        phaseT(qubit);
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, 0.5)));
    });

    test('Phase-T on |L>', () => {
        const qubit = Qubit.ofState(STATE_L);
        phaseT(qubit);
        expect(qubit).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, -0.5)));
    });

});

describe('Phase-S', () => {

    test('Phase-S on |0>', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        phaseS(qubit);
        expect(qubit).toEqual(QUBIT_STATE_ZERO);
    });

    test('Phase-S on |1>', () => {
        const qubit = Qubit.ofState(STATE_ONE);
        phaseS(qubit);
        expect(qubit).toEqual(Qubit.of(_0, i));
    });

    test('Phase-S on |+>', () => {
        const qubit = Qubit.ofState(STATE_PLUS);
        phaseS(qubit);
        expect(qubit).toEqual(QUBIT_STATE_R);
    });

    test('Phase-S on |->', () => {
        const qubit = Qubit.ofState(STATE_MINUS);
        phaseS(qubit);
        expect(qubit).toEqual(QUBIT_STATE_L);
    });

    test('Phase-S on |R>', () => {
        const qubit = Qubit.ofState(STATE_R);
        phaseS(qubit);
        expect(qubit).toEqual(QUBIT_STATE_MINUS);
    });

    test('Phase-S on |L>', () => {
        const qubit = Qubit.ofState(STATE_L);
        phaseS(qubit);
        expect(qubit).toEqual(QUBIT_STATE_PLUS);
    });

});

describe('Phase-Z', () => {

    test('Phase-Z on |0>', () => {
        const phaseZQubit = Qubit.ofState(STATE_ZERO);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_ZERO);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |1>', () => {
        const phaseZQubit = Qubit.ofState(STATE_ONE);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_ONE);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |+>', () => {
        const phaseZQubit = Qubit.ofState(STATE_PLUS);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_PLUS);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |->', () => {
        const phaseZQubit = Qubit.ofState(STATE_MINUS);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_MINUS);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |R>', () => {
        const phaseZQubit = Qubit.ofState(STATE_R);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_R);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

    test('Phase-Z on |L>', () => {
        const phaseZQubit = Qubit.ofState(STATE_L);
        phaseZ(phaseZQubit);

        const zQubit = Qubit.ofState(STATE_L);
        z(zQubit);

        expect(phaseZQubit).toEqual(zQubit);
    });

});

describe('Phase', () => {

    test('Test against phaseT', () => {
        function applyTest(state: QubitState): void {
            const phaseQubit = Qubit.ofState(state);
            phase(phaseQubit, 45);

            const phaseTQubit = Qubit.ofState(state);
            phaseT(phaseTQubit);

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
            phase(phaseQubit, 90);

            const phaseTQubit = Qubit.ofState(state);
            phaseS(phaseTQubit);

            expQubitsToBeCloseTo(phaseQubit, phaseTQubit);
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
            phase(phaseQubit, 180);

            const phaseTQubit = Qubit.ofState(state);
            phaseZ(phaseTQubit);

            expQubitsToBeCloseTo(phaseQubit, phaseTQubit);
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
            phase(phaseQubit, phaseDegrees);
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
            had(conQubit);
            x(conQubit);
            had(conQubit);

            const zQubit = Qubit.ofState(state);
            z(zQubit);

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
            had(conQubit);
            z(conQubit);
            had(conQubit);

            const xQubit = Qubit.ofState(state);
            x(xQubit);

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

describe('rotx', () => {
    test('', () => {
        // TODO
    });
});

describe('ROT-Y', () => {
    test('Rotate state 0 qubit by PI', () => {
        const qubit = Qubit.ofState(STATE_ZERO);
        roty(qubit, 180);
        expQubitsToBeCloseTo(qubit, QUBIT_STATE_ONE);
    });
});

describe('rotz', () => {
    test('', () => {
        // TODO
    });
});

describe('RNOT = HAD Phase 90 Degrees HAD', () => {

    function applyTest(state: QubitState) {
        const rnotQubit = Qubit.ofState(state);
        rnot(rnotQubit);

        const otherQubit = Qubit.ofState(state);
        had(otherQubit);
        phaseS(otherQubit);
        had(otherQubit);

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
        rnot(rnotQubit);
        rnot(rnotQubit);

        const otherQubit = Qubit.ofState(state);
        x(otherQubit);

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
        rnotInverse(rnotQubit);

        const otherQubit = Qubit.ofState(state);
        had(otherQubit);
        phase(otherQubit, -90);
        had(otherQubit);

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
        rnot(rnotQubit);
        rnotInverse(rnotQubit);
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
