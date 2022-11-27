import {Complex} from "../../../main/ch.oliverunger/model/math/complex";
import {Qubit} from "../../../main/ch.oliverunger/model/qubit";

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