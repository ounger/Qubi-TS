import {degsToRads, radsToDegs, round} from '../../../../main/ch.oliverunger/logic/math/util';

describe('Rounding', () => {
  it('', () => {
    expect(round(0.99, 2)).toEqual(0.99);
    expect(round(0.999, 2)).toEqual(1);
    expect(round(0.01, 2)).toEqual(0.01);
    expect(round(0.001, 2)).toEqual(0.00);
  });
});

describe('Radians to degrees', () => {
  it('', () => {
    expect(radsToDegs(2 * Math.PI)).toEqual(360);
    expect(radsToDegs(Math.PI)).toEqual(180);
    expect(radsToDegs(Math.PI / 2)).toEqual(90);
    expect(radsToDegs(Math.PI / 4)).toEqual(45);
    expect(radsToDegs(Math.PI / 8)).toEqual(22.5);
    expect(radsToDegs(0)).toEqual(0);
  });
});

describe('Degrees to radians', () => {
  it('', () => {
    expect(degsToRads(360)).toEqual(2 * Math.PI);
    expect(degsToRads(180)).toEqual(Math.PI);
    expect(degsToRads(90)).toEqual(Math.PI / 2);
    expect(degsToRads(45)).toEqual(Math.PI / 4);
    expect(degsToRads(22.5)).toEqual(Math.PI / 8);
    expect(degsToRads(0)).toEqual(0);
  });
});
