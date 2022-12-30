import {Complex} from '../../main/ch.oliverunger/math/complex';
import {Qubit} from '../../main/ch.oliverunger/quantum/single-qubit/qubit';
import {countCols, countRows} from '../../main/ch.oliverunger/math/linear-algebra';

export function expQubitsToBeCloseTo(q0: Qubit, q1: Qubit): void {
    expect(q0.stateZeroAmplitude.re).toBeCloseTo(q1.stateZeroAmplitude.re, 5);
    expect(q0.stateZeroAmplitude.im).toBeCloseTo(q1.stateZeroAmplitude.im, 5);
    expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 5);
    expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 5);
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
        expect(actual[i].re).toBeCloseTo(expected[i].re, 5);
        expect(actual[i].im).toBeCloseTo(expected[i].im, 5);
    }
}