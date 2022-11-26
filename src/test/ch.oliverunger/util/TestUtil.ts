import {Complex} from "../../../main/ch.oliverunger/model/complex";

export function expStatesToBeCloseTo(statesReg0: Complex[], statesReg1: Complex[]) {
    expect(statesReg0.length).toEqual(statesReg1.length);
    for (let i = 0; i < statesReg0.length; i++) {
        expect(statesReg0[i].re).toBeCloseTo(statesReg1[i].re, 2);
        expect(statesReg0[i].im).toBeCloseTo(statesReg1[i].im, 2);
    }
}