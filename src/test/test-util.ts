/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Complex} from '../lib/math/complex';
import {Qubit} from '../lib/quantum/single-qubit/qubit';
import {countCols, countRows} from '../lib/math/linear-algebra';

// TODO Bei vielen Qubits sind die Vergleiche langsam. Wie in expComplexArraysToBeCloseTo optimieren!

export function expQubitsToBeCloseTo(q0: Qubit, q1: Qubit): void {
    expect(q0.getStateZeroAmplitude().re).toBeCloseTo(q1.getStateZeroAmplitude().re, 5);
    expect(q0.getStateZeroAmplitude().im).toBeCloseTo(q1.getStateZeroAmplitude().im, 5);
    expect(q0.getStateOneAmplitude().re).toBeCloseTo(q1.getStateOneAmplitude().re, 5);
    expect(q0.getStateOneAmplitude().re).toBeCloseTo(q1.getStateOneAmplitude().re, 5);
}

export function expComplexMatricesToBeCloseTo(m0: Complex[][], m1: Complex[][]) {
    const rowsM0 = countRows(m0);
    const colsM0 = countCols(m0);
    const rowsM1 = countRows(m1);
    const colsM1 = countCols(m1);
    expect(rowsM0).toEqual(rowsM1);
    expect(colsM0).toEqual(colsM1);
    for (let row = 0; row < rowsM0; row++) {
        for (let col = 0; col < colsM0; col++) {
            expect(m0[row][col].re).toBeCloseTo(m1[row][col].re, 5);
            expect(m0[row][col].im).toBeCloseTo(m1[row][col].im, 5);
        }
    }
}

export function expNumberArraysToBeCloseTo(actual: number[], expected: number[]) {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], 5);
    }
}

export function expComplexArraysToBeCloseTo(actual: Complex[], expected: Complex[]) {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < actual.length; i++) {
        const v0Re = actual[i].re;
        const v0Im = actual[i].im;
        const v1Re = expected[i].re;
        const v1Im = expected[i].im;
        const tol = 0.00001;
        if (!(v0Re + tol > v1Re && v0Im + tol > v1Im && v0Re - tol < v1Re && v0Im - tol < v1Im)) {
            fail("Fail");
        }
    }

}