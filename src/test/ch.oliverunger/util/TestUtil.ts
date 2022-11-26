import {Complex} from "../../../main/ch.oliverunger/model/complex";
import {Qubit} from "../../../main/ch.oliverunger/model/qubit";

export function expStatesToBeCloseTo(statesReg0: Complex[], statesReg1: Complex[]) {
    expect(statesReg0.length).toEqual(statesReg1.length);
    for (let i = 0; i < statesReg0.length; i++) {
        expect(statesReg0[i].re).toBeCloseTo(statesReg1[i].re, 2);
        expect(statesReg0[i].im).toBeCloseTo(statesReg1[i].im, 2);
    }
}

export function expQubitsToBeCloseTo(q0: Qubit, q1: Qubit): void {
    expect(q0.stateZeroAmplitude.re).toBeCloseTo(q1.stateZeroAmplitude.re, 2);
    expect(q0.stateZeroAmplitude.im).toBeCloseTo(q1.stateZeroAmplitude.im, 2);
    expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 2);
    expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 2);
}