import {
    conjugate,
    countCols,
    countRows,
    cross,
    dot,
    hadamardProductVectors,
    inner,
    multiplyMatrices,
    multiplyMatrixScalar,
    multiplyMatrixVector,
    outer,
    tensorMatrices,
    tensorVectors
} from "../../../../main/ch.oliverunger/logic/math/linear-algebra";
import {
    _0,
    _1,
    _10,
    _11,
    _12,
    _14,
    _15,
    _18,
    _2,
    _20,
    _21,
    _24,
    _28,
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
    MINUS_i,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from "../../../../main/ch.oliverunger/model/math/complex";
import {expMatricesToBeCloseTo} from "../../util/TestUtil";
import {
    HADAMARD_GATE,
    IDENTITY_GATE,
    PAULI_X_GATE,
    PAULI_Y_GATE,
    PAULI_Z_GATE
} from "../../../../main/ch.oliverunger/logic/gates/single-qubit-gates";

const matrix = [
    [_3, _2, _1],
    [_1, _0, _2]
];

const vector = [_1, _0, _4];

describe('Count matrix rows', () => {
    test('Should have 2 rows', () => {
        expect(countRows(matrix)).toBe(2);
    });
});

describe('Count matrix columns', () => {
    test('Should have 3 columns', () => {
        expect(countCols(matrix)).toBe(3);
    });
});

describe('Multiply matrix with vector', () => {
    test('Should be equal', () => {
        expect(multiplyMatrixVector(matrix, vector)).toEqual([_7, _9]);
    });
});

describe('Multiply matrix with scalar', () => {
    test('Should be equal', () => {
        expect(multiplyMatrixScalar(matrix, _3)).toEqual([
            [_9, _6, _3],
            [_3, _0, _6]
        ]);
    });
});

describe('Conjugate matrix', () => {
    test('Should be equal', () => {
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
    test('', () => {
        expect(cross([_7, _0], [_3, _4])).toEqual(new Complex(28, 0));
        expect(cross([new Complex(-4, 0), _3], [_2, _1])).toEqual(new Complex(-10, 0));
        expect(cross([new Complex(-4, 2), new Complex(3, 1)], [new Complex(2, -1), new Complex(1, 2)])).toEqual(new Complex(-15, -5));
    });
});

describe('Multiply matrices', () => {
    test('', () => {
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
    test('', () => {
        expect(multiplyMatrices(IDENTITY_GATE, IDENTITY_GATE)).toEqual(IDENTITY_GATE);
    });
});

describe('Pauli-X is a involutory matrix (own inverse)', () => {
    test('', () => {
        expect(multiplyMatrices(PAULI_X_GATE, PAULI_X_GATE)).toEqual(IDENTITY_GATE);
    });
});

describe('Pauli-Y is a involutory matrix (own inverse)', () => {
    test('', () => {
        expect(multiplyMatrices(PAULI_Y_GATE, PAULI_Y_GATE)).toEqual(IDENTITY_GATE);
    });
});

describe('Pauli-Z is a involutory matrix (own inverse)', () => {
    test('', () => {
        expect(multiplyMatrices(PAULI_Z_GATE, PAULI_Z_GATE)).toEqual(IDENTITY_GATE);
    });
});

describe('-iXYZ = I', () => {
    test('', () => {
        expect(
            multiplyMatrixScalar(multiplyMatrices(multiplyMatrices(PAULI_X_GATE, PAULI_Y_GATE), PAULI_Z_GATE), MINUS_i)
        ).toEqual(IDENTITY_GATE);
    });
});

describe('Tensor', () => {
    test('', () => {
        expect(tensorVectors([_1, _0], [_1, _0])).toEqual([_1, _0, _0, _0]); // |0> tensor |0> -> |00>
        expect(tensorVectors([_1, _0], [_0, _1])).toEqual([_0, _1, _0, _0]); // |0> tensor |1> -> |01>
        expect(tensorVectors([_0, _1], [_1, _0])).toEqual([_0, _0, _1, _0]); // |1> tensor |0> -> |10>
        expect(tensorVectors([_0, _1], [_0, _1])).toEqual([_0, _0, _0, _1]); // |1> tensor |1> -> |11>
        expect(tensorVectors([_0, i], [_0, _1])).toEqual([_0, _0, _0, i]);
        expect(tensorVectors([_0, i], [_0, i])).toEqual([_0, _0, _0, MINUS_1]);
        expect(tensorVectors([_0, _1], [_0, _1], [_0, _1])).toEqual([_0, _0, _0, _0, _0, _0, _0, _1]);
        expect(tensorVectors([_0, _1], [i, _0], [_0, _1])).toEqual([_0, _0, _0, _0, _0, i, _0, _0]);
        expect(tensorVectors([_0, _1])).toEqual([_0, _1]);
    });
});

describe('Dot', () => {
    test('', () => {
        const v0 = [Complex.ofRe(1), Complex.ofRe(2)];
        const v1 = [Complex.ofRe(3), Complex.ofRe(4)];
        expect(dot(v0, v1)).toEqual(Complex.ofRe(11));
    });
});

describe('hadamardProduct', () => {
    test('', () => {
        const v0 = [Complex.ofRe(1), Complex.ofRe(2)];
        const v1 = [Complex.ofRe(3), Complex.ofRe(4)];
        expect(hadamardProductVectors(v0, v1)).toEqual([Complex.ofRe(3), Complex.ofRe(8)]);
    });
});

describe('inner', () => {
    test('', () => {
        const rowVector = [_1, _2, _1];
        const colVector = [_2, _6, _1];
        expect(inner(rowVector, colVector)).toEqual(_15);
    });
});

describe('outer', () => {
    test('', () => {
        const colVector = [_1, _0, _2];
        const rowVector = [_2, _1, _1, _3];
        expect(outer(colVector, rowVector)).toEqual([
            [_2, _1, _1, _3],
            [_0, _0, _0, _0],
            [_4, _2, _2, _6]
        ]);
    });
});

describe('Tensor product of two matrices', () => {

    test('Example 1', () => {
        // https://www.quora.com/How-do-I-implement-a-tensor-product-of-two-matrices-in-R?share=1
        const a: Complex[][] = [
            [_1, _2],
            [_3, _4]
        ];
        const b: Complex[][] = [
            [_0, _5],
            [_6, _7]
        ];
        expect(tensorMatrices(a, b)).toEqual([
            [_0, _5, _0, _10],
            [_6, _7, _12, _14],
            [_0, _15, _0, _20],
            [_18, _21, _24, _28]
        ]);
    });

    test('Example 2', () => {
        const a: Complex[][] = [
            [_1, _2],
            [_3, _4]
        ];
        const b: Complex[][] = [
            [_1, _1, _1],
            [_1, _1, _1],
            [_1, _1, _2]
        ];
        expect(tensorMatrices(a, b)).toEqual([
            [_1, _1, _1, _2, _2, _2],
            [_1, _1, _1, _2, _2, _2],
            [_1, _1, _2, _2, _2, _4],
            [_3, _3, _3, _4, _4, _4],
            [_3, _3, _3, _4, _4, _4],
            [_3, _3, _6, _4, _4, _8]
        ]);
    });

    test('Example 3', () => {
        const a: Complex[][] = [
            [_1, _1, _1],
            [_1, _1, _1],
            [_1, _1, _2]
        ];
        const b: Complex[][] = [
            [_1, _2],
            [_3, _4]
        ];
        expect(tensorMatrices(a, b)).toEqual([
            [_1, _2, _1, _2, _1, _2],
            [_3, _4, _3, _4, _3, _4],
            [_1, _2, _1, _2, _1, _2],
            [_3, _4, _3, _4, _3, _4],
            [_1, _2, _1, _2, _2, _4],
            [_3, _4, _3, _4, _6, _8]
        ]);
    });

    test('Y tensor X', () => {
        expect(tensorMatrices(PAULI_Y_GATE, PAULI_X_GATE)).toEqual([
            [_0, _0, _0, MINUS_i],
            [_0, _0, MINUS_i, _0],
            [_0, i, _0, _0],
            [i, _0, _0, _0]
        ]);
    });

    test('HAD tensor HAD', () => {
        expMatricesToBeCloseTo(tensorMatrices(HADAMARD_GATE, HADAMARD_GATE),
            [
                [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2)],
                [Complex.ofRe(1 / 2), Complex.ofRe(-1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(-1 / 2)],
                [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(-1 / 2), Complex.ofRe(-1 / 2)],
                [Complex.ofRe(1 / 2), Complex.ofRe(-1 / 2), Complex.ofRe(-1 / 2), Complex.ofRe(1 / 2)]
            ]);
    });

    test('HAD tensor I', () => {
        expMatricesToBeCloseTo(tensorMatrices(HADAMARD_GATE, IDENTITY_GATE), [
            [ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0],
            [_0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO],
            [ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO, _0],
            [_0, ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO]
        ]);
    });

    test('I tensor Had', () => {
        expMatricesToBeCloseTo(tensorMatrices(IDENTITY_GATE, HADAMARD_GATE), [
            [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0],
            [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, _0],
            [_0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO],
            [_0, _0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]
        ]);
    });

    // -----------------------------------------------

    test('HAD tensor I tensor I', () => {
        expMatricesToBeCloseTo(tensorMatrices(tensorMatrices(HADAMARD_GATE, IDENTITY_GATE), IDENTITY_GATE), [
            [ONE_OF_SQRT_TWO, _0, _0, _0, ONE_OF_SQRT_TWO, _0, _0, _0],
            [_0, ONE_OF_SQRT_TWO, _0, _0, _0, ONE_OF_SQRT_TWO, _0, _0],
            [_0, _0, ONE_OF_SQRT_TWO, _0, _0, _0, ONE_OF_SQRT_TWO, _0],
            [_0, _0, _0, ONE_OF_SQRT_TWO, _0, _0, _0, ONE_OF_SQRT_TWO],
            [ONE_OF_SQRT_TWO, _0, _0, _0, MINUS_ONE_OF_SQRT_TWO, _0, _0, _0],
            [_0, ONE_OF_SQRT_TWO, _0, _0, _0, MINUS_ONE_OF_SQRT_TWO, _0, _0],
            [_0, _0, ONE_OF_SQRT_TWO, _0, _0, _0, MINUS_ONE_OF_SQRT_TWO, _0],
            [_0, _0, _0, ONE_OF_SQRT_TWO, _0, _0, _0, MINUS_ONE_OF_SQRT_TWO],
        ]);
    });

    test('I tensor HAD tensor I', () => {
        expMatricesToBeCloseTo(tensorMatrices(tensorMatrices(IDENTITY_GATE, HADAMARD_GATE), IDENTITY_GATE), [
            [ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0, _0, _0, _0, _0],
            [_0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0, _0, _0, _0],
            [ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO, _0, _0, _0, _0, _0],
            [_0, ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO, _0, _0, _0, _0],
            [_0, _0, _0, _0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0],
            [_0, _0, _0, _0, _0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO],
            [_0, _0, _0, _0, ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO, _0],
            [_0, _0, _0, _0, _0, ONE_OF_SQRT_TWO, _0, MINUS_ONE_OF_SQRT_TWO],
        ]);
    });

    test('I tensor I tensor HAD', () => {
        expMatricesToBeCloseTo(tensorMatrices(tensorMatrices(IDENTITY_GATE, IDENTITY_GATE), HADAMARD_GATE), [
            [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0, _0, _0, _0, _0],
            [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, _0, _0, _0, _0, _0],
            [_0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0, _0, _0],
            [_0, _0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, _0, _0, _0],
            [_0, _0, _0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0],
            [_0, _0, _0, _0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, _0],
            [_0, _0, _0, _0, _0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO],
            [_0, _0, _0, _0, _0, _0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]
        ]);
    });

});


