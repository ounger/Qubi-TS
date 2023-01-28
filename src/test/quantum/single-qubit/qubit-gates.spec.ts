/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {multiplyMatrices, multiplyMatrixScalar} from '../../../lib/math/linear-algebra';
import {
    getRkGate,
    getU1Gate,
    HADAMARD_GATE,
    IDENTITY_GATE,
    PAULI_X_GATE,
    PAULI_Y_GATE,
    PAULI_Z_GATE
} from '../../../lib/quantum/single-qubit/qubit-gates';
import {MINUS_i} from '../../../lib/math/complex';
import {expComplexMatricesToBeCloseTo} from '../../test-util';

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
        expComplexMatricesToBeCloseTo(multiplyMatrices(HADAMARD_GATE, HADAMARD_GATE), IDENTITY_GATE);
    });

});

describe('-iXYZ = I', () => {

    test('', () => {
        expect(multiplyMatrixScalar(multiplyMatrices(multiplyMatrices(PAULI_X_GATE, PAULI_Y_GATE), PAULI_Z_GATE), MINUS_i))
            .toEqual(IDENTITY_GATE);
    });

});

describe('Rk and U1', () => {

    test('Test cases', () => {
        for (let k = 0; k < 10; k++) {
            const rkGate = getRkGate(k);
            const u1Gate = getU1Gate(2 * Math.PI / Math.pow(2, k));
            expComplexMatricesToBeCloseTo(rkGate, u1Gate);
        }
    });

});