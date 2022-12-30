import {BELL_STATE_PHI_MINUS, BELL_STATE_PHI_PLUS, BELL_STATE_PSI_MINUS, BELL_STATE_PSI_PLUS, QubitRegister} from '../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register';
import {Qubit, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_ZERO} from '../../../../main/ch.oliverunger/quantum/single-qubit/qubit';
import {_0, _1, Complex, ONE_OF_SQRT_TWO} from '../../../../main/ch.oliverunger/math/complex';
import {expComplexArraysToBeCloseTo, expNumberArraysToBeCloseTo} from '../../test-util';
import {cx, hadSingle, phaseT} from '../../../../main/ch.oliverunger/quantum/multi-qubit/multi-qubit-gates';
import {QubitState, STATE_ONE, STATE_ZERO} from '../../../../main/ch.oliverunger/quantum/single-qubit/qubit-state';

describe('probabilityOfState', () => {

    test('ket(++)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        const probs = reg.probabilities();
        for (let i = 0; i < reg.getStates().length; i++) {
            expect(reg.probabilityOfStateAtIndex(i)).toEqual(probs[i]);
        }
    });

    test('ket(1+)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        const probs = reg.probabilities();
        for (let i = 0; i < reg.getStates().length; i++) {
            expect(reg.probabilityOfStateAtIndex(i)).toEqual(probs[i]);
        }
    });

});

describe('probabilityOfQubit', () => {

    test('Test 1', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.5, 5);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.5, 5);
    });

    test('Test 2', () => {
        const reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        reg.probabilities();
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.7, 5);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.8, 5);
    });

    test('Test 3', () => {
        const reg = QubitRegister.ofQubits(
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

    test('ket(0)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        expect(reg.probabilities()).toEqual([1, 0]);
    });

    test('ket(1)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        expect(reg.probabilities()).toEqual([0, 1]);
    });

    test('ket(+)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.5, 0.5]);
    });

    test('ket(-)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.5, 0.5]);
    });

    test('ket(++)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);
    });

    test('ket(+-)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_MINUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);
    });

    test('ket(-+)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_PLUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);
    });

    test('ket(--)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_MINUS);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.25, 0.25, 0.25, 0.25]);

    });

    test('Misc 1', () => {
        const states: Complex[] = [Complex.ofRe(-4 / 10), Complex.ofRe(-4 * Math.sqrt(3) / 10), Complex.ofRe(3 / 10), Complex.ofRe(3 * Math.sqrt(3) / 10)];
        const reg = QubitRegister.ofStates(states);
        expNumberArraysToBeCloseTo(reg.probabilities(), [0.16, 0.48, 0.09, 0.27]);
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

    test('ket(0)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(0);
    });

    test('ket(1)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(1);
    });

    test('ket(00)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(0);
    });

    test('ket(01)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(1);
    });

    test('ket(10)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expect(reg.measure()).toEqual(2);
    });

    test('ket(11)', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        expect(reg.measure()).toEqual(3);
    });

    test('Misc 1', () => {
        let hasZero = false;
        let hasOne = false;
        let hasTwo = false;
        let hasThree = false;
        let counter = 0;
        while ((!hasZero || !hasOne || !hasTwo || !hasThree) && counter < 100) {
            // We need a new register every time because measuring multiple times the same register
            // reveals the same value.
            const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
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

    test('ket(0)', () => {
        for (let i = 0; i < 10; i++) {
            const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
            const measuredValue = reg.measureSingleQubit(0);
            expect(measuredValue).toEqual(0);
            expNumberArraysToBeCloseTo(reg.probabilities(), [1, 0]);
        }
    });

    test('ket(1)', () => {
        for (let i = 0; i < 10; i++) {
            const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
            const measuredValue = reg.measureSingleQubit(0);
            expect(measuredValue).toEqual(1);
            expNumberArraysToBeCloseTo(reg.probabilities(), [0, 1]);
        }
    });

    test('ket(++), measure first qubit', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        const measuredValue = reg.measureSingleQubit(0);
        if (measuredValue === 1) {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0, 0, 0.5, 0.5]);
        } else {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0.5, 0.5, 0, 0]);
        }
    });

    test('ket(++), measure second qubit', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        const measuredValue = reg.measureSingleQubit(1);
        if (measuredValue === 1) {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0, 0.5, 0, 0.5]);
        } else {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0.5, 0, 0.5, 0]);
        }
    });

    test('Test 1', () => {
        const reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.1)), Complex.ofRe(Math.sqrt(0.9))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        const measuredValue0 = reg.measureSingleQubit(0);
        if (measuredValue0 === 1) {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0, 0, 0, 0, 0.06, 0.24, 0.14, 0.56]);
        } else {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0.06, 0.24, 0.14, 0.56, 0, 0, 0, 0]);
        }
        const measuredValue1 = reg.measureSingleQubit(1);
        const measuredValue2 = reg.measureSingleQubit(2);
        const measuredStateByProbs = reg.probabilities().findIndex(value => value > 0.99 && value < 1.01);
        const measuredStateByQubitvalues = measuredValue0 * 4 + measuredValue1 * 2 + measuredValue2 * 1;
        expect(measuredStateByProbs).toEqual(measuredStateByQubitvalues);
    });

    test('Test 2', () => {
        const reg = QubitRegister.ofQubits(
            Qubit.of(Complex.ofRe(Math.sqrt(0.1)), Complex.ofRe(Math.sqrt(0.9))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.3)), Complex.ofRe(Math.sqrt(0.7))),
            Qubit.of(Complex.ofRe(Math.sqrt(0.2)), Complex.ofRe(Math.sqrt(0.8))));
        const measuredValue0 = reg.measureSingleQubit(0);
        if (measuredValue0 === 1) {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0, 0, 0, 0, 0.06, 0.24, 0.14, 0.56]);
        } else {
            expNumberArraysToBeCloseTo(reg.probabilities(), [0.06, 0.24, 0.14, 0.56, 0, 0, 0, 0]);
        }
        const measuredValue1 = reg.measureSingleQubit(1);
        const measuredValue2 = reg.measureSingleQubit(2);
        const measuredStateByProbs = reg.probabilities().findIndex(value => value > 0.99 && value < 1.01);
        const measuredStateByQubitvalues = measuredValue0 * 4 + measuredValue1 * 2 + measuredValue2 * 1;
        expect(measuredStateByProbs).toEqual(measuredStateByQubitvalues);
    });

    test('Test 3', () => {
        const states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        const reg = QubitRegister.ofStates(states);
        expect(reg.probabilityOfQubit(0)).toBeCloseTo(0.75, 5);
        const measuredValue0 = reg.measureSingleQubit(0);
        if (measuredValue0 === 1) {
            expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, Complex.ofIm(-1 / Math.sqrt(3)), Complex.ofRe(Math.sqrt(2) / Math.sqrt(3))]);
        } else {
            expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0, _0, _0]);
        }
    });

    test('Test 4', () => {
        const states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        const reg = QubitRegister.ofStates(states);
        expect(reg.probabilityOfQubit(1)).toBeCloseTo(0.5);
        const measuredValue1 = reg.measureSingleQubit(1);
        if (measuredValue1 === 1) {
            expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _0, _1]);
        } else {
            expComplexArraysToBeCloseTo(reg.getStates(), [Complex.ofRe(Math.sqrt(2) / 2), _0, Complex.ofIm(-Math.sqrt(2) / 2), _0]);
        }
    });

    test('Test 5', () => {
        const states = [
            Complex.ofRe(1 / Math.sqrt(5)), _0, _0, _0,
            Complex.ofRe(-Math.sqrt(2 / 5)), _0, Complex.ofRe(1 / Math.sqrt(5)), _0,
            _0, _0, _0, _0,
            _0, _0, _0, Complex.ofRe(1 / Math.sqrt(5))]
        const reg = QubitRegister.ofStates(states);
        expect(1 - reg.probabilityOfQubit(0)).toBeCloseTo(0.8);
        expect(1 - reg.probabilityOfQubit(3)).toBeCloseTo(0.8);
        const measuredValue0 = reg.measureSingleQubit(0);
        const measuredValue3 = reg.measureSingleQubit(3);
        if (measuredValue0 === 0 && measuredValue3 === 0) {
            expComplexArraysToBeCloseTo(reg.getStates(), [
                Complex.ofRe(1 / 2), _0, _0, _0,
                Complex.ofRe(-1 / Math.sqrt(2)), _0, Complex.ofRe(1 / 2), _0,
                _0, _0, _0, _0,
                _0, _0, _0, _0]);
        } else {
            expComplexArraysToBeCloseTo(reg.getStates(), [
                _0, _0, _0, _0,
                _0, _0, _0, _0,
                _0, _0, _0, _0,
                _0, _0, _0, _1]);
        }
    });
});

describe('ofStates', () => {

    test('Test 1', () => {
        const states: Complex[] = [];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states has to be > 1');
    });

    test('Test 2', () => {
        const states = [_1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states has to be > 1');
    });

    test('Test 3', () => {
        const states = [_0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');
    });

    test('Test 4', () => {
        const states = [_0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');
    });

    test('Test 5', () => {
        const states = [_0, _0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');
    });

    test('Test 6', () => {
        const states = [_0, _0, _0, _0, _0, _0, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Number of states is not a power of 2');
    });

    test('Test 7', () => {
        const states = [_0, _0];
        expect(() => QubitRegister.ofStates(states)).toThrow('Probabilities dont sum up to 1');
    });

    test('Test 8', () => {
        const states = [_1, _1];
        expect(() => QubitRegister.ofStates(states)).toThrow('Probabilities dont sum up to 1');
    });

    test('Test 9', () => {
        const states = [_0, _1];
        expect(QubitRegister.ofStates(states).getStates()).toEqual(states);
    });

    test('Test 10', () => {
        const states = [_1, _0];
        expect(QubitRegister.ofStates(states).getStates()).toEqual(states);
    });

    test('Test 11', () => {
        const states = [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO];
        expect(QubitRegister.ofStates(states).getStates()).toEqual(states);
    });

    test('Test 12', () => {
        const states = [Complex.ofRe(0.5), _0, new Complex(0, -0.5), ONE_OF_SQRT_TWO];
        expect(QubitRegister.ofStates(states).getStates()).toEqual(states);
    });

});

describe('Increment', () => {

    test('1 Qubit, Start at state 0 and increment up to 2', () => {
        let reg = new QubitRegister(1);
        for (let i = 0; i < reg.getStates().length; i++) {
            reg.increment();
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.getStates().length)).toEqual(1);
        }
    });

    test('2 Qubits, Start at state 0 and increment up to 4', () => {
        let reg = new QubitRegister(2);
        for (let i = 0; i < reg.getStates().length; i++) {
            reg.increment();
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.getStates().length)).toEqual(1);
        }
    });

    test('3 Qubits, Start at state 0 and increment up to 8', () => {
        let reg = new QubitRegister(3);
        for (let i = 0; i < reg.getStates().length; i++) {
            reg.increment();
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.getStates().length)).toEqual(1);
        }
    });

    test('4 Qubits, Start at state 0 and increment up to 16', () => {
        let reg = new QubitRegister(4);
        for (let i = 0; i < reg.getStates().length; i++) {
            reg.increment();
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.getStates().length)).toEqual(1);
        }
    });

});

describe('Decrement', () => {

    test('1 Qubit, Start at state 1 and decrement down to -1', () => {
        let reg = QubitRegister.ofStates([_0, _1])
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(0)).toEqual(1);
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(1)).toEqual(1);
    });

    test('2 Qubit, Start at state 3 and decrement down to 0', () => {
        let reg = QubitRegister.ofStates([_0, _0, _0, _1])
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(2)).toEqual(1);
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(1)).toEqual(1);
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(0)).toEqual(1);
        reg.decrement();
        expect(reg.probabilityOfStateAtIndex(3)).toEqual(1);
    });

});

describe('More Circuits Tests', () => {

    test('OReilly Example for increment and decrement', () => {
        let reg = QubitRegister.ofQubits(
            QUBIT_STATE_ZERO,
            QUBIT_STATE_ZERO,
            QUBIT_STATE_ZERO,
            QUBIT_STATE_ONE
        );
        hadSingle(reg, 1);
        phaseT(reg, 1);
        reg.increment();
        reg.decrement();
        expNumberArraysToBeCloseTo(reg.probabilities(),
            [0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        reg.increment();
        expNumberArraysToBeCloseTo(reg.probabilities(),
            [0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

});

describe('Addition Tests', () => {

    test('Add 1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(1);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Add 2', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(2);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Add 3', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(3);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Add 4', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(4);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Add 5', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(5);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Add -1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.add(-1);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

});

describe('Subtraction Tests', () => {

    test('Sub 1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(1);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Sub 2', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(2);
        expect(reg.getStates()).toEqual([_0, _0, _1, _0]);
    });

    test('Sub 3', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(3);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

    test('Sub 4', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(4);
        expect(reg.getStates()).toEqual([_1, _0, _0, _0]);
    });

    test('Sub 5', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(5);
        expect(reg.getStates()).toEqual([_0, _0, _0, _1]);
    });

    test('Sub -1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        reg.sub(-1);
        expect(reg.getStates()).toEqual([_0, _1, _0, _0]);
    });

});

describe('Construct the four Bell States', () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState, expBellState: Complex[]) {
        const reg = QubitRegister.ofQubits(Qubit.ofState(firstQubitState), Qubit.ofState(secondQubitState));
        hadSingle(reg, 0);
        cx(reg, 0, 1);
        expComplexArraysToBeCloseTo(reg.getStates(), expBellState);
    }

    test('Phi Plus from ket(00)', () => {
        applyTest(STATE_ZERO, STATE_ZERO, BELL_STATE_PHI_PLUS);
    });

    test('Phi Minus from ket(10)', () => {
        applyTest(STATE_ONE, STATE_ZERO, BELL_STATE_PHI_MINUS);
    });

    test('Psi Plus from ket(01)', () => {
        applyTest(STATE_ZERO, STATE_ONE, BELL_STATE_PSI_PLUS);
    });

    test('Psi Minus from ket(11)', () => {
        applyTest(STATE_ONE, STATE_ONE, BELL_STATE_PSI_MINUS);
    });

});

describe('Construct GHZ States', () => {

    function applyTest(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        hadSingle(reg, 0);
        for (let i = 1; i < numQubits; i++) {
            cx(reg, 0, i);
        }
        expNumberArraysToBeCloseTo([reg.probabilityOfStateAtIndex(0), reg.probabilityOfStateAtIndex(reg.getStates().length - 1)], [0.5, 0.5]);
    }

    test('Create GHZ Gates', () => {
        for (let i = 2; i < 10; i++) {
            applyTest(i);
        }
    });

});