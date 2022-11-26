// noinspection DuplicatedCode

import {
  had,
  identity,
  phase,
  phaseS,
  phaseT,
  phaseZ,
  x,
  y,
  z
} from '../../../../main/ch.oliverunger/logic/gates/single-qubit-gates';
import {
  Qubit,
  STATE_L_QUBIT,
  STATE_MINUS_QUBIT,
  STATE_ONE_QUBIT,
  STATE_PLUS_QUBIT,
  STATE_R_QUBIT,
  STATE_ZERO_QUBIT
} from "../../../../main/ch.oliverunger/model/qubit";
import {
  _0,
  _1,
  Complex,
  HALF_SQRT_TWO_HALF_i_SQRT_TWO,
  i,
  i_OF_SQRT_TWO,
  MINUS_1,
  MINUS_i,
  MINUS_i_OF_SQRT_TWO,
  MINUS_ONE_OF_SQRT_TWO,
  ONE_OF_SQRT_TWO
} from "../../../../main/ch.oliverunger/model/complex";
import {round} from "../../../../main/ch.oliverunger/logic/math/util";
import {expQubitsToBeCloseTo} from "../../util/TestUtil";

describe('Identity Tests', () => {

  test('Identity on |0>', () => {
    expect(identity(STATE_ZERO_QUBIT).vector()).toEqual([_1, _0]);
  });

  test('Identity on |1>', () => {
    expect(identity(STATE_ONE_QUBIT).vector()).toEqual([_0, _1]);
  });

});

describe('Pauli-X Tests', () => {

  test('Pauli-Y on |0>', () => {
    expect(y(STATE_ZERO_QUBIT).vector()).toEqual([_0, i]);
  });

  test('Pauli-Y on |1>', () => {
    expect(y(STATE_ONE_QUBIT).vector()).toEqual([MINUS_i, _0]);
  });

});

describe('Pauli-Y Tests', () => {

  test('Pauli-Y on |0>', () => {
    expect(y(STATE_ZERO_QUBIT).vector()).toEqual([_0, i]);
  });

  test('Pauli-Y on |1>', () => {
    expect(y(STATE_ONE_QUBIT).vector()).toEqual([MINUS_i, _0]);
  });

});

describe('Pauli-Y Tests', () => {

  test('Pauli-Z on |0>', () => {
    expect(z(STATE_ZERO_QUBIT).vector()).toEqual([_1, _0]);
  });

  test('Pauli-Z on |1>', () => {
    expect(z(STATE_ONE_QUBIT).vector()).toEqual([_0, MINUS_1]);
  });

});

describe('Hadamard Tests', () => {

  test('Hadamard on |0>', () => {
    expect(had(STATE_ZERO_QUBIT)).toEqual(STATE_PLUS_QUBIT);
  });

  test('Hadamard on |1>', () => {
    expect(had(STATE_ONE_QUBIT)).toEqual(STATE_MINUS_QUBIT);
  });

  test('Hadamard on |+>', () => {
    expQubitsToBeCloseTo(had(STATE_PLUS_QUBIT), STATE_ZERO_QUBIT);
  });

  test('Hadamard on |->', () => {
    expQubitsToBeCloseTo(had(STATE_MINUS_QUBIT), STATE_ONE_QUBIT);
  });

});

describe('Combined Tests', () => {

  test('Pauli-X on Hadamard on |0>', () => {
    expect(x(had(STATE_ZERO_QUBIT)).vector()).toEqual([ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
  });

  test('Pauli-X on Hadamard on |1>', () => {
    expect(x(had(STATE_ONE_QUBIT)).vector()).toEqual([MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
  });

});

describe('Probabilities', () => {

  test('Hadamard on |0>', () => {
    let result: number[] = had(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });

  test('Hadamard on |1>', () => {
    let result: number[] = had(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });

  test(' Pauli-X on |0>', () => {
    let result: number[] = x(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

  test('Pauli-X on |1>', () => {
    let result: number[] = x(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Pauli-Y on |0>', () => {
    let result: number[] = y(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

  test('Pauli-Y on |1>', () => {
    let result: number[] = y(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Pauli-Z on |0>', () => {
    let result: number[] = z(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Pauli-Z on |1>', () => {
    let result: number[] = z(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

});

describe('Measure', () => {

  test('|0>', () => {
    expect(new Qubit(_1, _0).measure()).toEqual(0);
  });

  test('|1>', () => {
    expect(new Qubit(_0, _1).measure()).toEqual(1);
  });

});

describe('Measuring multiple times always returns the same result', () => {

  test('', () => {
    const qubit = new Qubit(_1, _0);
    had(qubit);
    const result = qubit.measure();
    for (let i = 0; i < 10; i++) {
      expect(qubit.measure()).toEqual(result);
    }
  });

});

describe('Phase-T', () => {

  test('Phase-T on |0>', () => {
    expect(phaseT(STATE_ZERO_QUBIT)).toEqual(STATE_ZERO_QUBIT);
  });

  test('Phase-T on |1>', () => {
    expect(phaseT(STATE_ONE_QUBIT)).toEqual(Qubit.of(_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO));
  });

  test('Phase-T on |+>', () => {
    expect(phaseT(STATE_PLUS_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, 0.5)));
  });

  test('Phase-T on |->', () => {
    expect(phaseT(STATE_MINUS_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, -0.5)));
  });

  test('Phase-T on |R>', () => {
    expect(phaseT(STATE_R_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, 0.5)));
  });

  test('Phase-T on |L>', () => {
    expect(phaseT(STATE_L_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, -0.5)));
  });

});

describe('Phase-S', () => {

  test('Phase-S on |0>', () => {
    expect(phaseS(STATE_ZERO_QUBIT)).toEqual(STATE_ZERO_QUBIT);
  });

  test('Phase-S on |1>', () => {
    expect(phaseS(STATE_ONE_QUBIT)).toEqual(Qubit.of(_0, i));
  });

  test('Phase-S on |+>', () => {
    expect(phaseS(STATE_PLUS_QUBIT)).toEqual(STATE_R_QUBIT);
  });

  test('Phase-S on |->', () => {
    expect(phaseS(STATE_MINUS_QUBIT)).toEqual(STATE_L_QUBIT);
  });

  test('Phase-S on |R>', () => {
    expect(phaseS(STATE_R_QUBIT)).toEqual(STATE_MINUS_QUBIT);
  });

  test('Phase-S on |L>', () => {
    expect(phaseS(STATE_L_QUBIT)).toEqual(STATE_PLUS_QUBIT);
  });

});

describe('Phase-Z', () => {

  test('Phase-Z on |0>', () => {
    expect(phaseZ(STATE_ZERO_QUBIT)).toEqual(z(STATE_ZERO_QUBIT));
  });

  test('Phase-Z on |1>', () => {
    expect(phaseZ(STATE_ONE_QUBIT)).toEqual(z(STATE_ONE_QUBIT));
  });

  test('Phase-Z on |+>', () => {
    expect(phaseZ(STATE_PLUS_QUBIT)).toEqual(z(STATE_PLUS_QUBIT));
  });

  test('Phase-Z on |->', () => {
    expect(phaseZ(STATE_MINUS_QUBIT)).toEqual(z(STATE_MINUS_QUBIT));
  });

  test('Phase-Z on |R>', () => {
    expect(phaseZ(STATE_R_QUBIT)).toEqual(z(STATE_R_QUBIT));
  });

  test('Phase-Z on |L>', () => {
    expect(phaseZ(STATE_L_QUBIT)).toEqual(z(STATE_L_QUBIT));
  });

});

describe('Phase', () => {

  test('', () => {
    // Tests gegen phaseT()
    expQubitsToBeCloseTo(phase(STATE_ZERO_QUBIT, 45), phaseT(STATE_ZERO_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_ONE_QUBIT, 45), phaseT(STATE_ONE_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_PLUS_QUBIT, 45), phaseT(STATE_PLUS_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_MINUS_QUBIT, 45), phaseT(STATE_MINUS_QUBIT))
    expQubitsToBeCloseTo(phase(STATE_R_QUBIT, 45), phaseT(STATE_R_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_L_QUBIT, 45), phaseT(STATE_L_QUBIT));

    // Tests gegen phaseS()
    expQubitsToBeCloseTo(phase(STATE_ZERO_QUBIT, 90), phaseS(STATE_ZERO_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_ONE_QUBIT, 90), phaseS(STATE_ONE_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_PLUS_QUBIT, 90), phaseS(STATE_PLUS_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_MINUS_QUBIT, 90), phaseS(STATE_MINUS_QUBIT))
    expQubitsToBeCloseTo(phase(STATE_R_QUBIT, 90), phaseS(STATE_R_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_L_QUBIT, 90), phaseS(STATE_L_QUBIT));

    // Tests gegen phaseZ()
    expQubitsToBeCloseTo(phase(STATE_ZERO_QUBIT, 180), phaseZ(STATE_ZERO_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_ONE_QUBIT, 180), phaseZ(STATE_ONE_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_PLUS_QUBIT, 180), phaseZ(STATE_PLUS_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_MINUS_QUBIT, 180), phaseZ(STATE_MINUS_QUBIT))
    expQubitsToBeCloseTo(phase(STATE_R_QUBIT, 180), phaseZ(STATE_R_QUBIT));
    expQubitsToBeCloseTo(phase(STATE_L_QUBIT, 180), phaseZ(STATE_L_QUBIT));

    // Eigene Tests
    expQubitsToBeCloseTo(phase(STATE_ZERO_QUBIT, 270), STATE_ZERO_QUBIT);
    expQubitsToBeCloseTo(phase(STATE_ONE_QUBIT, 270), Qubit.of(_0, MINUS_i));
    expQubitsToBeCloseTo(phase(STATE_PLUS_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, MINUS_i_OF_SQRT_TWO));
    expQubitsToBeCloseTo(phase(STATE_MINUS_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, i_OF_SQRT_TWO))
    expQubitsToBeCloseTo(phase(STATE_R_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO));
    expQubitsToBeCloseTo(phase(STATE_L_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO));
  });

});
