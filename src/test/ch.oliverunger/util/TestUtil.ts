import {Complex} from "../../../main/ch.oliverunger/model/math/complex";
import {Qubit} from "../../../main/ch.oliverunger/model/qubit";
import {countCols, countRows} from "../../../main/ch.oliverunger/logic/math/linear-algebra";

export function expStatesToBeCloseTo(statesReg0: Complex[], statesReg1: Complex[]) {
    expect(statesReg0.length).toEqual(statesReg1.length);
    for (let i = 0; i < statesReg0.length; i++) {
        expect(statesReg0[i].re).toBeCloseTo(statesReg1[i].re, 5);
        expect(statesReg0[i].im).toBeCloseTo(statesReg1[i].im, 5);
    }
}

export function expQubitsToBeCloseTo(q0: Qubit, q1: Qubit): void {
    expect(q0.basisStateZero.re).toBeCloseTo(q1.basisStateZero.re, 5);
    expect(q0.basisStateZero.im).toBeCloseTo(q1.basisStateZero.im, 5);
    expect(q0.basisStateOne.re).toBeCloseTo(q1.basisStateOne.re, 5);
    expect(q0.basisStateOne.re).toBeCloseTo(q1.basisStateOne.re, 5);
}

export function expMatricesToBeCloseTo(m0: Complex[][], m1: Complex[][]) {
    const rowsM0 = countRows(m0);
    const colsM0 = countCols(m0);
    const rowsM1 = countRows(m1);
    const colsM1 = countCols(m1);
    expect(rowsM0).toEqual(rowsM1);
    expect(colsM0).toEqual(colsM1);
    for(let row = 0; row < rowsM0; row++) {
        for(let col = 0; col < colsM0; col++) {
            expect(m0[row][col].re).toBeCloseTo(m1[row][col].re, 5);
            expect(m0[row][col].im).toBeCloseTo(m1[row][col].im, 5);
        }
    }
}