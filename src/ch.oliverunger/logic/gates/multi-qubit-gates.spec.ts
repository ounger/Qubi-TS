import {STATE_MINUS_QUBIT, STATE_ONE_QUBIT, STATE_PLUS_QUBIT, STATE_ZERO_QUBIT} from "../../model/qubit";
import {ccx, cx, swap, x} from "./multi-qubit-gates";
import {
  _0,
  _1,
  _10,
  _11,
  _12,
  _13,
  _14,
  _15,
  _16,
  _17,
  _18,
  _19,
  _2,
  _20,
  _21,
  _22,
  _23,
  _24,
  _25,
  _26,
  _27,
  _28,
  _29,
  _3,
  _30,
  _31,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
  Complex,
  MINUS_ONE_OF_SQRT_TWO,
  ONE_OF_SQRT_TWO
} from "../../model/complex";
import {QubitRegister} from "../../model/qubit-register";

describe('Controlled-NOT', () => {
  it('', () => {
    // Simple states
    let reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ZERO_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_1, _0, _0, _0]); // |00> -> |00>

    reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ONE_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, _1, _0, _0]); // |01> -> |01>

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ZERO_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, _0, _0, _1]); // |10> -> |11>

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ONE_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, _0, _1, _0]); // |11> -> |10>

    // Superposition states
    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ZERO_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([ONE_OF_SQRT_TWO, _0, _0, ONE_OF_SQRT_TWO]); // Bell Pair

    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ONE_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0]);

    reg = QubitRegister.ofQubits(STATE_MINUS_QUBIT, STATE_ZERO_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0), MINUS_ONE_OF_SQRT_TWO]);

    reg = QubitRegister.ofQubits(STATE_MINUS_QUBIT, STATE_ONE_QUBIT);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, Complex.ofRe(-0)]);
  });
});

describe('Swap', () => {
  it('', () => {
    // Simple states
    let reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ZERO_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_1, _0, _0, _0]); // |00> -> |00>

    reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ONE_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, _0, _1, _0]); // |01> -> |10>

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ZERO_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, _1, _0, _0]); // |10> -> |01>

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ONE_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, _0, _0, _1]); // |11> -> |11>

    // Superposition states
    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ZERO_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0]); // |+0> -> |0+>

    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ONE_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]); // |+1> -> |1+>

    reg = QubitRegister.ofQubits(STATE_MINUS_QUBIT, STATE_ZERO_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0)]); // |-0> -> |0->

    reg = QubitRegister.ofQubits(STATE_MINUS_QUBIT, STATE_ONE_QUBIT);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, Complex.ofRe(-0), ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]); // |-1> -> |1->

    reg = createUnrealisticRegister(2);
    swap(reg, 1, 0);
    expect(reg.states).toEqual([_0, _2, _1, _3]);

    reg = createUnrealisticRegister(2);
    swap(reg, 0, 0);
    expect(reg.states).toEqual([_0, _1, _2, _3]);

    reg = createUnrealisticRegister(2);
    swap(reg, 1, 1);
    expect(reg.states).toEqual([_0, _1, _2, _3]);

    reg = createUnrealisticRegister(3);
    swap(reg, 0, 1);
    expect(reg.states).toEqual([_0, _1, _4, _5, _2, _3, _6, _7]);

    reg = createUnrealisticRegister(4);
    swap(reg, 0, 2);
    expect(reg.states).toEqual([_0, _1, _8, _9, _4, _5, _12, _13, _2, _3, _10, _11, _6, _7, _14, _15]);

  });
});

describe('X', () => {
  it('', () => {
    // Simple states
    let reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 0);
    expect(reg.states).toEqual([_0, _0, _1, _0]);

    reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 1);
    expect(reg.states).toEqual([_0, _1, _0, _0]);

    reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ONE_QUBIT);
    x(reg, 0);
    expect(reg.states).toEqual([_0, _0, _0, _1]);

    reg = QubitRegister.ofQubits(STATE_ZERO_QUBIT, STATE_ONE_QUBIT);
    x(reg, 1);
    expect(reg.states).toEqual([_1, _0, _0, _0]);

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 0);
    expect(reg.states).toEqual([_1, _0, _0, _0]);

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 1);
    expect(reg.states).toEqual([_0, _0, _0, _1]);

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ONE_QUBIT);
    x(reg, 0);
    expect(reg.states).toEqual([_0, _1, _0, _0]);

    reg = QubitRegister.ofQubits(STATE_ONE_QUBIT, STATE_ONE_QUBIT);
    x(reg, 1);
    expect(reg.states).toEqual([_0, _0, _1, _0]);

    // Superposition states
    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 0);
    expect(reg.states).toEqual([ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0]);

    reg = QubitRegister.ofQubits(STATE_PLUS_QUBIT, STATE_ZERO_QUBIT);
    x(reg, 1);
    expect(reg.states).toEqual([_0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO]);

    reg = createUnrealisticRegister(3);
    x(reg, 0);
    expect(reg.states).toEqual([_4, _5, _6, _7, _0, _1, _2, _3]);

    reg = createUnrealisticRegister(3);
    x(reg, 1);
    expect(reg.states).toEqual([_2, _3, _0, _1, _6, _7, _4, _5]);

    reg = createUnrealisticRegister(3);
    x(reg, 2);
    expect(reg.states).toEqual([_1, _0, _3, _2, _5, _4, _7, _6]);
  });
});

describe('CX', () => {
  it('', () => {
    let reg = createUnrealisticRegister(2);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, _1, _3, _2]);

    reg = createUnrealisticRegister(2);
    cx(reg, 1, 0);
    expect(reg.states).toEqual([_0, _3, _2, _1]);

    reg = createUnrealisticRegister(3);
    cx(reg, 0, 1);
    expect(reg.states).toEqual([_0, _1, _2, _3, _6, _7, _4, _5]);

    reg = createUnrealisticRegister(3);
    cx(reg, 1, 0);
    expect(reg.states).toEqual([_0, _1, _6, _7, _4, _5, _2, _3]);

    reg = createUnrealisticRegister(3);
    cx(reg, 0, 2);
    expect(reg.states).toEqual([_0, _1, _2, _3, _5, _4, _7, _6]);

    reg = createUnrealisticRegister(3);
    cx(reg, 2, 0);
    expect(reg.states).toEqual([_0, _5, _2, _7, _4, _1, _6, _3]);

    reg = createUnrealisticRegister(3);
    cx(reg, 1, 2);
    expect(reg.states).toEqual([_0, _1, _3, _2, _4, _5, _7, _6]);

    reg = createUnrealisticRegister(3);
    cx(reg, 2, 1);
    expect(reg.states).toEqual([_0, _3, _2, _1, _4, _7, _6, _5]);

    reg = createUnrealisticRegister(4);
    cx(reg, 1, 2);
    expect(reg.states).toEqual([_0, _1, _2, _3, _6, _7, _4, _5, _8, _9, _10, _11, _14, _15, _12, _13]);
  });
});

describe('CCX', () => {
  it('', () => {
    let reg = createUnrealisticRegister(3);
    ccx(reg, 0, 1, 2);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _5, _7, _6]);

    reg = createUnrealisticRegister(3);
    ccx(reg, 0, 2, 1);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _7, _6, _5]);

    reg = createUnrealisticRegister(3);
    ccx(reg, 1, 2, 0);
    expect(reg.states).toEqual([_0, _1, _2, _7, _4, _5, _6, _3]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 1, 2, 0);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _5, _14, _15, _8,
      _9, _10, _11, _12, _13, _6, _7]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 1, 3, 0);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _13, _6, _15, _8,
      _9, _10, _11, _12, _5, _14, _7]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 2, 3, 0);
    expect(reg.states).toEqual([_0, _1, _2, _11, _4, _5, _6, _15, _8,
      _9, _10, _3, _12, _13, _14, _7]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 1, 2, 3);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _5, _7, _6, _8,
      _9, _10, _11, _12, _13, _15, _14]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 2, 3, 1);
    expect(reg.states).toEqual([_0, _1, _2, _7, _4, _5, _6, _3, _8,
      _9, _10, _15, _12, _13, _14, _11]);

    reg = createUnrealisticRegister(4);
    ccx(reg, 0, 3, 1);
    expect(reg.states).toEqual([_0, _1, _2, _3, _4, _5, _6, _7, _8,
      _13, _10, _15, _12, _9, _14, Complex.ofRe(11)]);

    reg = createUnrealisticRegister(5);
    ccx(reg, 1, 3, 2);
    expect(reg.states).toEqual([
      _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _14, _15, _12,
      _13, _10, _11, _16, _17,
      _18, _19, _20, _21, _22,
      _23, _24, _25, _30, _31,
      _28, _29, _26, _27]);
  });
});

/**
 * We are creating an unrealistic register of qubits here because the probabilities don't sum
 * up to 1. However, this makes testing easier.
 */
function createUnrealisticRegister(qubits: number): QubitRegister {
  let reg = new QubitRegister(qubits);
  for (let i = 0; i < Math.pow(2, qubits); i++) {
    reg.states[i] = Complex.ofRe(i);
  }
  return reg;
}


