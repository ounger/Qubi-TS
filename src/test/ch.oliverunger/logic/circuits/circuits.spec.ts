import {add, decrement, increment, qrng, sub} from '../../../../main/ch.oliverunger/logic/circuits/circuits';
import {bit} from "../../../../main/ch.oliverunger/logic/math/truth-table";
import {QubitRegister} from "../../../../main/ch.oliverunger/model/qubit-register";
import {_0, _1} from "../../../../main/ch.oliverunger/model/math/complex";
import {QUBIT_STATE_ONE, QUBIT_STATE_ZERO} from "../../../../main/ch.oliverunger/model/qubit";
import {hadSingle, phaseT} from "../../../../main/ch.oliverunger/logic/gates/multi-qubit-gates";
import {expProbabilitiesToBeCloseTo} from "../../util/test-util";

describe('QRNG should generate 0s and 1s', () => {
    test('', () => {
        let hasZero = false;
        let hasOne = false;
        let counter = 0;
        while ((!hasZero || !hasOne) && counter < 100) {
            counter++;
            const rand: bit = qrng();
            if (rand === 0 && !hasZero) {
                hasZero = true;
            } else if (rand === 1 && !hasOne) {
                hasOne = true;
            }
        }
        expect(hasZero && hasOne).toBeTruthy();
    });
});

describe('Increment', () => {

    test('1 Qubit, Start at state 0 and increment up to 2', () => {
        let reg = new QubitRegister(1);
        for (let i = 0; i < reg.states.length; i++) {
            increment(reg);
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.states.length)).toEqual(1);
        }
    });

    test('2 Qubits, Start at state 0 and increment up to 4', () => {
        let reg = new QubitRegister(2);
        for (let i = 0; i < reg.states.length; i++) {
            increment(reg);
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.states.length)).toEqual(1);
        }
    });

    test('3 Qubits, Start at state 0 and increment up to 8', () => {
        let reg = new QubitRegister(3);
        for (let i = 0; i < reg.states.length; i++) {
            increment(reg);
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.states.length)).toEqual(1);
        }
    });

    test('4 Qubits, Start at state 0 and increment up to 16', () => {
        let reg = new QubitRegister(4);
        for (let i = 0; i < reg.states.length; i++) {
            increment(reg);
            expect(reg.probabilityOfStateAtIndex((i + 1) % reg.states.length)).toEqual(1);
        }
    });

});

describe('Decrement', () => {

    test('1 Qubit, Start at state 1 and decrement down to -1', () => {
        let reg = QubitRegister.ofStates([_0, _1])
        decrement(reg);
        expect(reg.probabilityOfStateAtIndex(0)).toEqual(1);
        decrement(reg);
        expect(reg.probabilityOfStateAtIndex(1)).toEqual(1);
    });

    test('2 Qubit, Start at state 3 and decrement down to 0', () => {
        let reg = QubitRegister.ofStates([_0, _0, _0, _1])
        decrement(reg);
        expect(reg.probabilityOfStateAtIndex(2)).toEqual(1);
        decrement(reg);
        expect(reg.probabilityOfStateAtIndex(1)).toEqual(1);
        decrement(reg);
        expect(reg.probabilityOfStateAtIndex(0)).toEqual(1);
        decrement(reg);
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
        increment(reg);
        decrement(reg);
        expProbabilitiesToBeCloseTo(reg.probabilities(),
            [0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        increment(reg);
        expProbabilitiesToBeCloseTo(reg.probabilities(),
            [0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

});

describe('Addition Tests', () => {

    test('Add 1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, 1);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Add 2', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, 2);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Add 3', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, 3);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Add 4', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, 4);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Add 5', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, 5);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Add -1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        add(reg, -1);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

});

describe('Subtraction Tests', () => {

    test('Sub 1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, 1);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Sub 2', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, 2);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Sub 3', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, 3);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Sub 4', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, 4);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Sub 5', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, 5);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Sub -1', () => {
        let reg = QubitRegister.ofStates([_1, _0, _0, _0]);
        sub(reg, -1);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

});
