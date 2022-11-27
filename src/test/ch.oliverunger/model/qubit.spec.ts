import {Qubit, QUBIT_STATE_ONE, QUBIT_STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit";
import {STATE_MINUS, STATE_ONE, STATE_PLUS, STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit-state";
import {Complex} from "../../../main/ch.oliverunger/model/math/complex";

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
        expect(Qubit.of(Complex.ofRe(3/5), Complex.ofRe(4/5)).probabilityOfState(STATE_MINUS)).toBeCloseTo(1/50, 5);
    });

});