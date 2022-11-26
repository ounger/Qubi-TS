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

// TODO Gehoeren alle Tests in in it()?

describe('Identity on |0>', () => {
  it('Should not modify the state', () => {
    expect(identity(STATE_ZERO_QUBIT).vector()).toEqual([_1, _0]);
  });
});

describe('Identity on |1>', () => {
  it('Should not modify the state', () => {
    expect(identity(STATE_ONE_QUBIT).vector()).toEqual([_0, _1]);
  });
});

describe('Pauli-X on |0>', () => {
  it('Should state zero with state one', () => {
    expect(x(STATE_ZERO_QUBIT).vector()).toEqual([_0, _1]);
  });
});

describe('Pauli-X on |1>', () => {
  it('Should state zero with state one', () => {
    expect(x(STATE_ONE_QUBIT).vector()).toEqual([_1, _0]);
  });
});

describe('Pauli-Y on |0>', () => {
  it('', () => {
    expect(y(STATE_ZERO_QUBIT).vector()).toEqual([_0, i]);
  });
});

describe('Pauli-Y on |1>', () => {
  it('', () => {
    expect(y(STATE_ONE_QUBIT).vector()).toEqual([MINUS_i, _0]);
  });
});

describe('Pauli-Z on |0>', () => {
  it('', () => {
    expect(z(STATE_ZERO_QUBIT).vector()).toEqual([_1, _0]);
  });
});

describe('Pauli-Z on |1>', () => {
  it('', () => {
    expect(z(STATE_ONE_QUBIT).vector()).toEqual([_0, MINUS_1]);
  });
});

describe('Hadamard on |0>', () => {
  it('Should create a superposition', () => {
    expect(had(STATE_ZERO_QUBIT)).toEqual(STATE_PLUS_QUBIT);
  });
});

describe('Hadamard on |1>', () => {
  it('Should create a superposition', () => {
    expect(had(STATE_ONE_QUBIT)).toEqual(STATE_MINUS_QUBIT);
  });
});

describe('Hadamard on |+>', () => {
  it('', () => {
    expToBeCloseTo(had(STATE_PLUS_QUBIT), STATE_ZERO_QUBIT);
  });
});

describe('Hadamard on |->', () => {
  it('', () => {
    expToBeCloseTo(had(STATE_MINUS_QUBIT), STATE_ONE_QUBIT);
  });
});

describe('Pauli-X on Hadamard on |0>', () => {
  it('', () => {
    expect(x(had(STATE_ZERO_QUBIT)).vector()).toEqual([ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
  });
});

describe('Pauli-X on Hadamard on |1>', () => {
  it('', () => {
    expect(x(had(STATE_ONE_QUBIT)).vector()).toEqual([MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
  });
});

describe('Calculate the correct probabilites of superposition of had(|0>)', () => {
  it('', () => {
    let result: number[] = had(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });
});

describe('Calculate the correct probabilites of superposition of had(|1>)', () => {
  it('', () => {
    let result: number[] = had(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0.5);
    expect(round(result[1], 1)).toEqual(0.5);
  });
});

describe('Calculate the correct probabilites of Pauli-X |0>', () => {
  it('', () => {
    let result: number[] = x(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });
});

describe('Calculate the correct probabilites of Pauli-X on |1>', () => {
  it('', () => {
    let result: number[] = x(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });
});

describe('Calculate the correct probabilites of Pauli-Y |0>', () => {
  it('', () => {
    let result: number[] = y(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });
});

describe('Calculate the correct probabilites of Pauli-Y on |1>', () => {
  it('', () => {
    let result: number[] = y(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });
});

describe('Calculate the correct probabilites of Pauli-Z on |0>', () => {
  it('', () => {
    let result: number[] = z(STATE_ZERO_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(1);
    expect(round(result[1], 1)).toEqual(0);
  });
});

describe('Calculate the correct probabilites of Pauli-Z on |1>', () => {
  it('', () => {
    let result: number[] = z(STATE_ONE_QUBIT).probabilities();
    expect(round(result[0], 1)).toEqual(0);
    expect(round(result[1], 1)).toEqual(1);
  });
});

describe('Measure correctly', () => {
  it('', () => {
    expect(new Qubit(_1, _0).measure()).toEqual(0);
    expect(new Qubit(_0, _1).measure()).toEqual(1);
  });
});

describe('Measuring multiple times always returns the same result', () => {
  it('', () => {
    const qubit = new Qubit(_1, _0);
    had(qubit);
    const result = qubit.measure();
    for (let i = 0; i < 10; i++) {
      expect(qubit.measure()).toEqual(result);
    }
  });
});

describe('Phase-T', () => {
  it('', () => {
    expect(phaseT(STATE_ZERO_QUBIT)).toEqual(STATE_ZERO_QUBIT);
    expect(phaseT(STATE_ONE_QUBIT)).toEqual(Qubit.of(_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO));
    expect(phaseT(STATE_PLUS_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, 0.5)));
    expect(phaseT(STATE_MINUS_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, -0.5)));
    expect(phaseT(STATE_R_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(-0.5, 0.5)));
    expect(phaseT(STATE_L_QUBIT)).toEqual(Qubit.of(ONE_OF_SQRT_TWO, new Complex(0.5, -0.5)));
  });
});

describe('Phase-S', () => {
  it('', () => {
    expect(phaseS(STATE_ZERO_QUBIT)).toEqual(STATE_ZERO_QUBIT);
    expect(phaseS(STATE_ONE_QUBIT)).toEqual(Qubit.of(_0, i));
    expect(phaseS(STATE_PLUS_QUBIT)).toEqual(STATE_R_QUBIT);
    expect(phaseS(STATE_MINUS_QUBIT)).toEqual(STATE_L_QUBIT);
    expect(phaseS(STATE_R_QUBIT)).toEqual(STATE_MINUS_QUBIT);
    expect(phaseS(STATE_L_QUBIT)).toEqual(STATE_PLUS_QUBIT);
  });
});

describe('Phase-Z', () => {
  it('', () => {
    expect(phaseZ(STATE_ZERO_QUBIT)).toEqual(z(STATE_ZERO_QUBIT));
    expect(phaseZ(STATE_ONE_QUBIT)).toEqual(z(STATE_ONE_QUBIT));
    expect(phaseZ(STATE_PLUS_QUBIT)).toEqual(z(STATE_PLUS_QUBIT));
    expect(phaseZ(STATE_MINUS_QUBIT)).toEqual(z(STATE_MINUS_QUBIT));
    expect(phaseZ(STATE_R_QUBIT)).toEqual(z(STATE_R_QUBIT));
    expect(phaseZ(STATE_L_QUBIT)).toEqual(z(STATE_L_QUBIT));
  });
});

describe('Phase', () => {
  it('', () => {
    // Tests gegen phaseT()
    expToBeCloseTo(phase(STATE_ZERO_QUBIT, 45), phaseT(STATE_ZERO_QUBIT));
    expToBeCloseTo(phase(STATE_ONE_QUBIT, 45), phaseT(STATE_ONE_QUBIT));
    expToBeCloseTo(phase(STATE_PLUS_QUBIT, 45), phaseT(STATE_PLUS_QUBIT));
    expToBeCloseTo(phase(STATE_MINUS_QUBIT, 45), phaseT(STATE_MINUS_QUBIT))
    expToBeCloseTo(phase(STATE_R_QUBIT, 45), phaseT(STATE_R_QUBIT));
    expToBeCloseTo(phase(STATE_L_QUBIT, 45), phaseT(STATE_L_QUBIT));

    // Tests gegen phaseS()
    expToBeCloseTo(phase(STATE_ZERO_QUBIT, 90), phaseS(STATE_ZERO_QUBIT));
    expToBeCloseTo(phase(STATE_ONE_QUBIT, 90), phaseS(STATE_ONE_QUBIT));
    expToBeCloseTo(phase(STATE_PLUS_QUBIT, 90), phaseS(STATE_PLUS_QUBIT));
    expToBeCloseTo(phase(STATE_MINUS_QUBIT, 90), phaseS(STATE_MINUS_QUBIT))
    expToBeCloseTo(phase(STATE_R_QUBIT, 90), phaseS(STATE_R_QUBIT));
    expToBeCloseTo(phase(STATE_L_QUBIT, 90), phaseS(STATE_L_QUBIT));

    // Tests gegen phaseZ()
    expToBeCloseTo(phase(STATE_ZERO_QUBIT, 180), phaseZ(STATE_ZERO_QUBIT));
    expToBeCloseTo(phase(STATE_ONE_QUBIT, 180), phaseZ(STATE_ONE_QUBIT));
    expToBeCloseTo(phase(STATE_PLUS_QUBIT, 180), phaseZ(STATE_PLUS_QUBIT));
    expToBeCloseTo(phase(STATE_MINUS_QUBIT, 180), phaseZ(STATE_MINUS_QUBIT))
    expToBeCloseTo(phase(STATE_R_QUBIT, 180), phaseZ(STATE_R_QUBIT));
    expToBeCloseTo(phase(STATE_L_QUBIT, 180), phaseZ(STATE_L_QUBIT));

    // Eigene Tests
    expToBeCloseTo(phase(STATE_ZERO_QUBIT, 270), STATE_ZERO_QUBIT);
    expToBeCloseTo(phase(STATE_ONE_QUBIT, 270), Qubit.of(_0, MINUS_i));
    expToBeCloseTo(phase(STATE_PLUS_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, MINUS_i_OF_SQRT_TWO));
    expToBeCloseTo(phase(STATE_MINUS_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, i_OF_SQRT_TWO))
    expToBeCloseTo(phase(STATE_R_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO));
    expToBeCloseTo(phase(STATE_L_QUBIT, 270), Qubit.of(ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO));
  });
});

function expToBeCloseTo(q0: Qubit, q1: Qubit): void {
  expect(q0.stateZeroAmplitude.re).toBeCloseTo(q1.stateZeroAmplitude.re, 2);
  expect(q0.stateZeroAmplitude.im).toBeCloseTo(q1.stateZeroAmplitude.im, 2);
  expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 2);
  expect(q0.stateOneAmplitude.re).toBeCloseTo(q1.stateOneAmplitude.re, 2);
}
