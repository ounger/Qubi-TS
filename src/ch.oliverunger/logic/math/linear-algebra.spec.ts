import {
  conjugate,
  countCols,
  countRows,
  cross,
  dot,
  hadamardProductVectors,
  multiplyColVectorRowVector,
  multiplyMatrices,
  multiplyMatrixScalar,
  multiplyMatrixVector,
  multiplyRowVectorColVector,
  tensor
} from "./linear-algebra";
import {
  _0,
  _1,
  _10,
  _11,
  _12,
  _15,
  _2,
  _3,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
  Complex,
  i,
  MINUS_1,
  MINUS_i
} from "../../model/complex";
import {IDENTITY_MATRIX, PAULI_X_MATRIX, PAULI_Y_MATRIX, PAULI_Z_MATRIX} from "../gates/single-qubit-gates";

const matrix = [
  [_3, _2, _1],
  [_1, _0, _2]
];

const vector = [_1, _0, _4];

describe('Count matrix rows', () => {
  it('Should have 2 rows', () => {
    expect(countRows(matrix)).toBe(2);
  });
});

describe('Count matrix columns', () => {
  it('Should have 3 columns', () => {
    expect(countCols(matrix)).toBe(3);
  });
});

describe('Multiply matrix with vector', () => {
  it('Should be equal', () => {
    expect(multiplyMatrixVector(matrix, vector)).toEqual([_7, _9]);
  });
});

describe('Multiply matrix with scalar', () => {
  it('Should be equal', () => {
    expect(multiplyMatrixScalar(matrix, _3)).toEqual([
      [_9, _6, _3],
      [_3, _0, _6]
    ]);
  });
});

describe('Conjugate matrix', () => {
  it('Should be equal', () => {
    let matrix = [
      [i, MINUS_i],
      [MINUS_1, new Complex(1, 1)]
    ];
    expect(conjugate(matrix)).toEqual([
      [MINUS_i, i],
      [new Complex(-1, -0), new Complex(1, -1)]
    ]);
  });
});

describe('Cross product', () => {
  it('', () => {
    expect(cross([_7, _0], [_3, _4])).toEqual(new Complex(28, 0));
    expect(cross([new Complex(-4, 0), _3], [_2, _1])).toEqual(new Complex(-10, 0));
    expect(cross([new Complex(-4, 2), new Complex(3, 1)], [new Complex(2, -1), new Complex(1, 2)])).toEqual(new Complex(-15, -5));
  });
});

describe('Multiply matrices', () => {
  it('', () => {
    const m0 = [
      [_3, _2, _1],
      [_1, _0, _2]
    ];
    const m1 = [
      [_1, _2],
      [_0, _1],
      [_4, _0]
    ];
    const m0xm1 = [
      [_7, _8],
      [_9, _2]
    ];
    expect(multiplyMatrices(m0, m1)).toEqual(m0xm1);

    const m2 = [
      [_1, _2, _3],
      [_4, _5, _6]
    ];
    const m3 = [
      [_7, _10],
      [_8, _11],
      [_9, _12]
    ];
    const m2xm3 = [
      [new Complex(50, 0), new Complex(68, 0)],
      [new Complex(122, 0), new Complex(167, 0)]
    ];
    expect(multiplyMatrices(m2, m3)).toEqual(m2xm3);
  });
});

describe('Identity matrix is a involutory matrix (own inverse)', () => {
  it('', () => {
    expect(multiplyMatrices(IDENTITY_MATRIX, IDENTITY_MATRIX)).toEqual(IDENTITY_MATRIX);
  });
});

describe('Pauli-X is a involutory matrix (own inverse)', () => {
  it('', () => {
    expect(multiplyMatrices(PAULI_X_MATRIX, PAULI_X_MATRIX)).toEqual(IDENTITY_MATRIX);
  });
});

describe('Pauli-Y is a involutory matrix (own inverse)', () => {
  it('', () => {
    expect(multiplyMatrices(PAULI_Y_MATRIX, PAULI_Y_MATRIX)).toEqual(IDENTITY_MATRIX);
  });
});

describe('Pauli-Z is a involutory matrix (own inverse)', () => {
  it('', () => {
    expect(multiplyMatrices(PAULI_Z_MATRIX, PAULI_Z_MATRIX)).toEqual(IDENTITY_MATRIX);
  });
});

describe('-iXYZ = I', () => {
  it('', () => {
    expect(
        multiplyMatrixScalar(multiplyMatrices(multiplyMatrices(PAULI_X_MATRIX, PAULI_Y_MATRIX), PAULI_Z_MATRIX), MINUS_i)
    ).toEqual(IDENTITY_MATRIX);
  });
});

describe('Tensor', () => {
  it('', () => {
    expect(tensor([_1, _0], [_1, _0])).toEqual([_1, _0, _0, _0]); // |0> tensor |0> -> |00>
    expect(tensor([_1, _0], [_0, _1])).toEqual([_0, _1, _0, _0]); // |0> tensor |1> -> |01>
    expect(tensor([_0, _1], [_1, _0])).toEqual([_0, _0, _1, _0]); // |1> tensor |0> -> |10>
    expect(tensor([_0, _1], [_0, _1])).toEqual([_0, _0, _0, _1]); // |1> tensor |1> -> |11>
    expect(tensor([_0, i], [_0, _1])).toEqual([_0, _0, _0, i]);
    expect(tensor([_0, i], [_0, i])).toEqual([_0, _0, _0, MINUS_1]);
    expect(tensor([_0, _1], [_0, _1], [_0, _1])).toEqual([_0, _0, _0, _0, _0, _0, _0, _1]);
    expect(tensor([_0, _1], [i, _0], [_0, _1])).toEqual([_0, _0, _0, _0, _0, i, _0, _0]);
    expect(tensor([_0, _1])).toEqual([_0, _1]);
  });
});

describe('Dot', () => {
  it('', () => {
    const v0 = [Complex.ofRe(1), Complex.ofRe(2)];
    const v1 = [Complex.ofRe(3), Complex.ofRe(4)];
    expect(dot(v0, v1)).toEqual(Complex.ofRe(11));
  });
});

describe('hadamardProduct', () => {
  it('', () => {
    const v0 = [Complex.ofRe(1), Complex.ofRe(2)];
    const v1 = [Complex.ofRe(3), Complex.ofRe(4)];
    expect(hadamardProductVectors(v0, v1)).toEqual([Complex.ofRe(3), Complex.ofRe(8)]);
  });
});

describe('multiplyColVectorRowVector', () => {
  it('', () => {
    const v0 = [_1, _2, _1];
    const v1 = [_2, _6, _1];
    expect(multiplyColVectorRowVector(v0, v1)).toEqual(_15);
  });
});

describe('multiplyRowVectorColVector', () => {
  it('', () => {
    const v0 = [_1, _0, _2];
    const v1 = [_2, _1, _1, _3];
    expect(multiplyRowVectorColVector(v0, v1)).toEqual([
      [_2, _1, _1, _3],
      [_0, _0, _0, _0],
      [_4, _2, _2, _6]
    ]);
  });
});






