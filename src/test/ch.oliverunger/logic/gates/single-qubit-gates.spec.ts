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
  QUBIT_STATE_L,
  QUBIT_STATE_MINUS,
  QUBIT_STATE_ONE,
  QUBIT_STATE_PLUS,
  QUBIT_STATE_R,
  QUBIT_STATE_ZERO
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
} from "../../../../main/ch.oliverunger/model/math/complex";
import {round} from "../../../../main/ch.oliverunger/logic/math/util";
import {expQubitsToBeCloseTo} from "../../util/TestUtil";
import {STATE_MINUS_ONE, STATE_ONE, STATE_PLUS, STATE_ZERO} from "../../../../main/ch.oliverunger/model/qubit-state";

describe('Identity Tests', () => {

  test('I|0> = |0>', () => {
    expect(identity(QUBIT_STATE_ZERO).state()).toEqual(STATE_ZERO);
  });

  test('I|1> = |1>', () => {
    expect(identity(QUBIT_STATE_ONE).state()).toEqual(STATE_ONE);
  });

});

describe('Pauli-X Tests', () => {

  test('X|0> = |1>', () => {
    expect(x(QUBIT_STATE_ZERO).state()).toEqual(STATE_ONE);
  });

  test('X|1> = |0>', () => {
    expect(x(QUBIT_STATE_ONE).state()).toEqual(STATE_ZERO);
  });

});

describe('Pauli-Y Tests', () => {

  test('Y|0> = i|1>', () => {
    expect(y(QUBIT_STATE_ZERO).state()).toEqual([_0, i]);
  });

  test('Y|1> = -i|0>', () => {
    expect(y(QUBIT_STATE_ONE).state()).toEqual([MINUS_i, _0]);
  });

});

describe('Pauli-Z Tests', () => {

  test('Z|0> = |0>', () => {
    expect(z(QUBIT_STATE_ZERO).state()).toEqual(STATE_ZERO);
  });

  test('Z|1> = -|1>', () => {
    expect(z(QUBIT_STATE_ONE).state()).toEqual(STATE_MINUS_ONE);
  });

});

describe('Hadamard Tests', () => {

  test('H|0> = |+>', () => {
    expect(had(QUBIT_STATE_ZERO)).toEqual(QUBIT_STATE_PLUS);
  });

  test('H|1> = |->', () => {
    expect(had(QUBIT_STATE_ONE)).toEqual(QUBIT_STATE_MINUS);
  });

  test('H|+> = |0>', () => {
    expQubitsToBeCloseTo(had(QUBIT_STATE_PLUS), QUBIT_STATE_ZERO);
  });

  test('H|-> = |1>', () => {
    expQubitsToBeCloseTo(had(QUBIT_STATE_MINUS), QUBIT_STATE_ONE);
  });

});

describe('Combined Tests', () => {

  test('XH|0> -> |+>', () => {
    expect(x(had(QUBIT_STATE_ZERO)).state()).toEqual(STATE_PLUS);
  });

  test('XH|1>', () => {
    expect(x(had(QUBIT_STATE_ONE)).state()).toEqual([MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
  });

});

describe('Probabilities', () => {

  test('H|0>', () => {
    let result: number[] = had(QUBIT_STATE_ZERO).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });

  test('H|1>', () => {
    let result: number[] = had(QUBIT_STATE_ONE).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });

  test('X|0>', () => {
    let result: number[] = x(QUBIT_STATE_ZERO).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

  test('X|1>', () => {
    let result: number[] = x(QUBIT_STATE_ONE).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Y|0>', () => {
    let result: number[] = y(QUBIT_STATE_ZERO).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

  test('Y|1>', () => {
    let result: number[] = y(QUBIT_STATE_ONE).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Z|0>', () => {
    let result: number[] = z(QUBIT_STATE_ZERO).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });

  test('Z|1>', () => {
    let result: number[] = z(QUBIT_STATE_ONE).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });

});

describe('Measure', () => {

  test('Measure(|0>) -> 0', () => {
    expect(QUBIT_STATE_ZERO.measure()).toEqual(0);
  });

  test('Measure(|1>) -> 1', () => {
    expect(QUBIT_STATE_ONE.measure()).toEqual(1);
  });

});

describe('Measuring multiple times always returns the same result', () => {

  test('Measire H|0> multiple times', () => {
    const qubit = QUBIT_STATE_ZERO;
    had(qubit);
    const result = qubit.measure();
    for (let i = 0; i < 10; i++) {
      expect(qubit.measure()).toEqual(result);
    }
  });

});

describe('Phase-T', () => {

  test('Phase-T on |0>', () => {
    expect(phaseT(QUBIT_STATE_ZERO).state()).toEqual(STATE_ZERO);
  });

  test('Phase-T on |1>', () => {
    expect(phaseT(QUBIT_STATE_ONE)).toEqual(Qubit.of(_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO));
  });

  test('Phase-T on |+>', () => {
    expect(phaseT(QUBIT_STATE_PLUS)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, 0.5)));
  });

  test('Phase-T on |->', () => {
    expect(phaseT(QUBIT_STATE_MINUS)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, -0.5)));
  });

  test('Phase-T on |R>', () => {
    expect(phaseT(QUBIT_STATE_R)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, 0.5)));
  });

  test('Phase-T on |L>', () => {
    expect(phaseT(QUBIT_STATE_L)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, -0.5)));
  });

});

describe('Phase-S', () => {

  test('Phase-S on |0>', () => {
    expect(phaseS(QUBIT_STATE_ZERO).state()).toEqual(STATE_ZERO);
  });

  test('Phase-S on |1>', () => {
    expect(phaseS(QUBIT_STATE_ONE)).toEqual(Qubit.of(_0, i));
  });

  test('Phase-S on |+>', () => {
    expect(phaseS(QUBIT_STATE_PLUS)).toEqual(QUBIT_STATE_R);
  });

  test('Phase-S on |->', () => {
    expect(phaseS(QUBIT_STATE_MINUS)).toEqual(QUBIT_STATE_L);
  });

  test('Phase-S on |R>', () => {
    expect(phaseS(QUBIT_STATE_R)).toEqual(QUBIT_STATE_MINUS);
  });

  test('Phase-S on |L>', () => {
    expect(phaseS(QUBIT_STATE_L)).toEqual(QUBIT_STATE_PLUS);
  });

});

describe('Phase-Z', () => {

  test('Phase-Z on |0>', () => {
    expect(phaseZ(QUBIT_STATE_ZERO)).toEqual(z(QUBIT_STATE_ZERO));
  });

  test('Phase-Z on |1>', () => {
    expect(phaseZ(QUBIT_STATE_ONE)).toEqual(z(QUBIT_STATE_ONE));
  });

  test('Phase-Z on |+>', () => {
    expect(phaseZ(QUBIT_STATE_PLUS)).toEqual(z(QUBIT_STATE_PLUS));
  });

  test('Phase-Z on |->', () => {
    expect(phaseZ(QUBIT_STATE_MINUS)).toEqual(z(QUBIT_STATE_MINUS));
  });

  test('Phase-Z on |R>', () => {
    expect(phaseZ(QUBIT_STATE_R)).toEqual(z(QUBIT_STATE_R));
  });

  test('Phase-Z on |L>', () => {
    expect(phaseZ(QUBIT_STATE_L)).toEqual(z(QUBIT_STATE_L));
  });

});

describe('Phase', () => {

  test('Tests against other phase methods', () => {
    // Tests gegen phaseT()
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ZERO, 45), phaseT(QUBIT_STATE_ZERO));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ONE, 45), phaseT(QUBIT_STATE_ONE));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_PLUS, 45), phaseT(QUBIT_STATE_PLUS));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_MINUS, 45), phaseT(QUBIT_STATE_MINUS))
    expQubitsToBeCloseTo(phase(QUBIT_STATE_R, 45), phaseT(QUBIT_STATE_R));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_L, 45), phaseT(QUBIT_STATE_L));

    // Tests gegen phaseS()
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ZERO, 90), phaseS(QUBIT_STATE_ZERO));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ONE, 90), phaseS(QUBIT_STATE_ONE));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_PLUS, 90), phaseS(QUBIT_STATE_PLUS));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_MINUS, 90), phaseS(QUBIT_STATE_MINUS))
    expQubitsToBeCloseTo(phase(QUBIT_STATE_R, 90), phaseS(QUBIT_STATE_R));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_L, 90), phaseS(QUBIT_STATE_L));

    // Tests gegen phaseZ()
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ZERO, 180), phaseZ(QUBIT_STATE_ZERO));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ONE, 180), phaseZ(QUBIT_STATE_ONE));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_PLUS, 180), phaseZ(QUBIT_STATE_PLUS));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_MINUS, 180), phaseZ(QUBIT_STATE_MINUS))
    expQubitsToBeCloseTo(phase(QUBIT_STATE_R, 180), phaseZ(QUBIT_STATE_R));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_L, 180), phaseZ(QUBIT_STATE_L));

    // Eigene Tests
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ZERO, 270), QUBIT_STATE_ZERO);
    expQubitsToBeCloseTo(phase(QUBIT_STATE_ONE, 270), Qubit.of(_0, MINUS_i));
    expQubitsToBeCloseTo(phase(QUBIT_STATE_PLUS, 270), QUBIT_STATE_L);
    expQubitsToBeCloseTo(phase(QUBIT_STATE_MINUS, 270), QUBIT_STATE_R)
    expQubitsToBeCloseTo(phase(QUBIT_STATE_R, 270), QUBIT_STATE_PLUS);
    expQubitsToBeCloseTo(phase(QUBIT_STATE_L, 270), QUBIT_STATE_MINUS);
  });

});
