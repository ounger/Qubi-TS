import {QubitRegister} from '../../../main/ch.oliverunger/model/qubit-register';
import {
    Qubit,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_ZERO
} from "../../../main/ch.oliverunger/model/qubit";
import {_0, _1, Complex, ONE_OF_SQRT_TWO} from "../../../main/ch.oliverunger/model/math/complex";
import {expStatesToBeCloseTo} from "../util/TestUtil";

describe('probabilityOfState', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        let probs = reg.probabilities();
        for (let i = 0; i < reg.states.length; i++) {
            expect(reg.probabilityOfStateAtIndex(i)).toEqual(probs[i]);
        }

        reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        probs = reg.probabilities();
        for (let i = 0; i < reg.states.length; i++) {
            expect(reg.probabilityOfStateAtIndex(i)).toEqual(probs[i]);
        }
    });
});

describe('probabilityOfQubit', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.5, 5);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.5, 5);

        reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        reg.probabilities();
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.7, 5);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.8, 5);

        reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.1)), Complex.ofRe(Math.sqrt(0.9))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        reg.probabilities();
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.9, 5);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.7, 5);
        expect(reg.probabilityOfQubit(2)).toBeCloseTo(0.8, 5);
    });
});

describe('Probabilities', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        expect(reg.probabilities()).toEqual([1, 0]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        expect(reg.probabilities()).toEqual([0, 1]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.5, 0.5]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.5, 0.5]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_MINUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_PLUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);

        reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_MINUS);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);

        let states: Complex[] = [Complex.ofRe(-4 / 10), Complex.ofRe(-4 * Math.sqrt(3) / 10), Complex.ofRe(3 / 10), Complex.ofRe(3 * Math.sqrt(3) / 10)];
        reg = QubitRegister.ofStates(states);
        expProbabilitiesToBeCloseTo(reg.probabilities(), [0.16, 0.48, 0.09, 0.27]);
    });
});

describe('Measuring multiple times always returns the same result', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        const result = reg.measure();
        for (let i = 0; i < 10; i++) {
            expect(reg.measure()).toEqual(result);
        }
    });
});

describe('Measure', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(0);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(1);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(0);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(1);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(2);

        reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(3);

        let hasZero = false;
        let hasOne = false;
        let hasTwo = false;
        let hasThree = false;
        let counter = 0;
        while ((!hasZero || !hasOne || !hasTwo || !hasThree) && counter < 100) {
            // We need a new register every time because measuring multiple times the same register
            // reveals the same value.
            reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
            counter++;
            const measuredValue = reg.measure();
            if (measuredValue === 0) {
                hasZero = true;
            } else if (measuredValue === 1) {
                hasOne = true;
            } else if (measuredValue === 2) {
                hasTwo = true;
            } else if (measuredValue === 3) {
                hasThree = true;
            } else {
                throw new Error("It should not reach here");
            }
        }
        expect(hasZero && hasOne && hasTwo && hasThree).toBeTruthy();
    });
});

describe('measureSingleQubit', () => {
    test('', () => {
        for (let i = 0; i < 10; i++) {
            let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
            let measuredValue = reg.measureSingleQubit(0);
            expect(measuredValue).toEqual(0);
            expProbabilitiesToBeCloseTo(reg.probabilities(), [1, 0]);

            reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
            measuredValue = reg.measureSingleQubit(0);
            expect(measuredValue).toEqual(1);
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0, 1]);
        }

        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        let measuredValue = reg.measureSingleQubit(0);
        if (measuredValue === 1) {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0, 0, 0.5, 0.5]);
        } else {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0.5, 0.5, 0, 0]);
        }

        reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        measuredValue = reg.measureSingleQubit(1);
        if (measuredValue === 1) {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0, 0.5, 0, 0.5]);
        } else {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0.5, 0, 0.5, 0]);
        }

        reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.1)), Complex.ofRe(Math.sqrt(0.9))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        let measuredValue0 = reg.measureSingleQubit(0);
        if (measuredValue0 === 1) {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0, 0, 0, 0, 0.06, 0.24, 0.14, 0.56]);
        } else {
            expProbabilitiesToBeCloseTo(reg.probabilities(), [0.06, 0.24, 0.14, 0.56, 0, 0, 0, 0]);
        }
        let measuredValue1 = reg.measureSingleQubit(1);
        let measuredValue2 = reg.measureSingleQubit(2);
        let measuredStateByProbs = reg.probabilities().findIndex(value => value > 0.99 && value < 1.01);
        let measuredStateByQubitvalues = measuredValue0 * 4 + measuredValue1 * 2 + measuredValue2 * 1;
        expect(measuredStateByProbs).toEqual(measuredStateByQubitvalues);

        let states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        reg = QubitRegister.ofStates(states);
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.75, 5);
        measuredValue0 = reg.measureSingleQubit(0);
        if (measuredValue0 === 1) {
            expStatesToBeCloseTo(reg.states, [_0, _0, Complex.ofIm(-1 / Math.sqrt(3)), Complex.ofRe(Math.sqrt(2) / Math.sqrt(3))]);
        } else {
            expStatesToBeCloseTo(reg.states, [_1, _0, _0, _0]);
        }

        states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        reg = QubitRegister.ofStates(states);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.5);
        measuredValue1 = reg.measureSingleQubit(1);
        if (measuredValue1 === 1) {
            expStatesToBeCloseTo(reg.states, [_0, _0, _0, _1]);
        } else {
            expStatesToBeCloseTo(reg.states, [Complex.ofRe(Math.sqrt(2) / 2), _0, Complex.ofIm(-Math.sqrt(2) / 2), _0]);
        }

        states = [
            Complex.ofRe(1 / Math.sqrt(5)), _0, _0, _0,
            Complex.ofRe(-Math.sqrt(2 / 5)), _0, Complex.ofRe(1 / Math.sqrt(5)), _0,
            _0, _0, _0, _0,
            _0, _0, _0, Complex.ofRe(1 / Math.sqrt(5))]
        reg = QubitRegister.ofStates(states);
        expect(1 - reg.probabilityOfQubit(0)).toBeCloseTo(0.8);
        expect(1 - reg.probabilityOfQubit(3)).toBeCloseTo(0.8);
        measuredValue0 = reg.measureSingleQubit(0);
        let measuredValue3 = reg.measureSingleQubit(3);
        if (measuredValue0 === 0 && measuredValue3 === 0) {
            expStatesToBeCloseTo(reg.states, [
                Complex.ofRe(1 / 2), _0, _0, _0,
                Complex.ofRe(-1 / Math.sqrt(2)), _0, Complex.ofRe(1 / 2), _0,
                _0, _0, _0, _0,
                _0, _0, _0, _0]);
        } else {
            expStatesToBeCloseTo(reg.states, [
                _0, _0, _0, _0,
                _0, _0, _0, _0,
                _0, _0, _0, _0,
                _0, _0, _0, _1]);
        }

    });
});

describe('ofStates', () => {
    test(' ', () => {
        let states: Complex[] = [];
        expect(() => QubitRegister.ofStates(states)).toThrow("Number of states has to be > 1");

        states = [_1];
        expect(() => QubitRegister.ofStates(states)).toThrow("Number of states has to be > 1");

        states = [_0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');

        states = [_0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');

        states = [_0, _0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');

        states = [_0, _0, _0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');

        states = [_0, _0];
        expect(() => QubitRegister.ofStates(states)).toThrow("Probabilities dont sum up to 1");

        states = [_1, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow("Probabilities dont sum up to 1");

        states = [_0, _1];
        expect(QubitRegister.ofStates(states).states).toEqual(states);

        states = [_1, _0];
        expect(QubitRegister.ofStates(states).states).toEqual(states);

        states = [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO];
        expect(QubitRegister.ofStates(states).states).toEqual(states);

        states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        expect(QubitRegister.ofStates(states).states).toEqual(states);
    });
});

function expProbabilitiesToBeCloseTo(actual: number[], expected: number[]) {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], 5);
    }
}