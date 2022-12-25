import {multiplyMatrices, multiplyMatrixScalar} from '../../../../main/ch.oliverunger/math/linear-algebra';
import {HADAMARD_GATE, IDENTITY_GATE, PAULI_X_GATE, PAULI_Y_GATE, PAULI_Z_GATE} from '../../../../main/ch.oliverunger/quantum/single-qubit/qubit-gates';
import {MINUS_i} from '../../../../main/ch.oliverunger/math/complex';
import {expMatricesToBeCloseTo} from '../../test-util';

describe('Pauli matrices are involutory (their own inverse)', () => {

    test('Identity', () => {
        expect(multiplyMatrices(IDENTITY_GATE, IDENTITY_GATE)).toEqual(IDENTITY_GATE);
    });

    test('Pauli-X', () => {
        expect(multiplyMatrices(PAULI_X_GATE, PAULI_X_GATE)).toEqual(IDENTITY_GATE);
    });

    test('Pauli-Y', () => {
        expect(multiplyMatrices(PAULI_Y_GATE, PAULI_Y_GATE)).toEqual(IDENTITY_GATE);
    });

    test('Pauli-Z', () => {
        expect(multiplyMatrices(PAULI_Z_GATE, PAULI_Z_GATE)).toEqual(IDENTITY_GATE);
    });

    test('Hadamard', () => {
        expMatricesToBeCloseTo(multiplyMatrices(HADAMARD_GATE, HADAMARD_GATE), IDENTITY_GATE);
    });

});

describe('-iXYZ = I', () => {

    test('', () => {
        expect(multiplyMatrixScalar(multiplyMatrices(multiplyMatrices(PAULI_X_GATE, PAULI_Y_GATE), PAULI_Z_GATE), MINUS_i))
            .toEqual(IDENTITY_GATE);
    });

});