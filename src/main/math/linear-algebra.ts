/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {_0, Complex} from './complex';
import {Bit, getTTBitAt} from './truth-table';
import {Vector2c} from './vector2c';
import {range} from '../util';

export function multiplyMatrixVector2c(matrix: Complex[][], vector: Vector2c): Vector2c {
    // @ts-ignore
    return multiplyMatrixVector(matrix, vector);
}

export function multiplyMatrixVector(matrix: Complex[][], vector: Complex[]): Complex[] {
    if (countCols(matrix) !== vector.length) {
        throw new Error('The number of columns of the matrix must match the length of the vector');
    }
    let vectorResult: Complex[] = new Array<Complex>(countRows(matrix));
    for (let row = 0; row < countRows(matrix); row++) {
        vectorResult[row] = new Complex(0, 0);
        for (let col = 0; col < countCols(matrix); col++) {
            vectorResult[row] = vectorResult[row].add(matrix[row][col].mul(vector[col]));
        }
    }
    return vectorResult;
}

export function cross(v0: Vector2c, v1: Vector2c): Complex {
    if (v0.length !== 2 || v1.length !== 2) {
        throw new Error('Vectors need a length of 2');
    }
    return v0[0].mul(v1[1]).sub(v1[0].mul(v0[1]));
}

export function multiplyMatrices(m0: Complex[][], m1: Complex[][]): Complex[][] {
    if (countCols(m0) !== countRows(m1)) {
        throw new Error('The number of columns of the first matrix must match the number of the rows of the second matrix');
    }
    let matrixResult: Complex[][] = new Array(countRows(m0)).fill(false).map(() => new Array(countCols(m1)).fill(false));
    for (let i = 0; i < countRows(m0); i++) {
        for (let j = 0; j < countCols(m1); j++) {
            matrixResult[i][j] = new Complex(0, 0);
            for (let k = 0; k < countCols(m0); k++) {
                matrixResult[i][j] = matrixResult[i][j].add(m0[i][k].mul(m1[k][j]));
            }
        }
    }
    return matrixResult;
}

export function dotBinary(secret: Bit[], z: Bit[]): number {
    let accum = 0
    for (let i = 0; i < secret.length; i++) {
        accum += secret[i] * z[i];
    }
    return (accum % 2);
}

/**
 * Dot product <br>
 * ket(a) dot ket(b) = a1 * b1 + a2 * b2 + ... + an * bn
 */
export function dot(v0: Complex[], v1: Complex[]): Complex {
    if (v0.length !== v1.length) {
        throw new Error('Both vectors don\'t have the same amount of components');
    }
    return [...Array(v0.length).keys()]
        .map(index => v0[index].mul(v1[index]))
        .reduce((sum, current) => sum.add(current), _0);
}

/**
 * The length of a vector v is also called its magnitude |v|.
 */
export function magnitude(v: Vector2c): [plusSolution: Complex, minusSolution: Complex] {
    return v[0].mul(v[0]).add(v[1].mul(v[1])).sqrt();
}

/**
 * Returns the Tensor/Kronecker product of two or more vectors <br>
 * ket(ab) = ket(a) tensor ket(b) = [a(0)*b(0), a(0)*b(1), a(1)*b(0), a(1)*b(1)] <br>
 * ket(abc) = ket(a) tensor ket(b) tensor ket(c) = [a(0)*b(0)*c(0), a(0)*b(0)*c(1), a(0)*b(1)*c(0), a(0)*b(1)*c(1), a(1)*b(0)*c(0), a(1)*b(0)*c(1), a(1)*b(1)*c(0), a(1)*b(1)*c(1)]
 */
export function tensorVectors(...vectors: Vector2c[]): Complex[] {
    const lengthTensor = Math.pow(2, vectors.length);
    let result: Complex[] = new Array<Complex>(lengthTensor);
    for (let indexTensor = 0; indexTensor < lengthTensor; indexTensor++) {
        result[indexTensor] = new Complex(1, 0);
        for (let indexVector = 0; indexVector < vectors.length; indexVector++) {
            result[indexTensor] = result[indexTensor].mul(vectors[indexVector][getTTBitAt(vectors.length, indexTensor, indexVector)]);
        }
    }
    return result;
}

/**
 * Returns the Tensor/Kronecker product of two matrices <br>
 * https://www.quora.com/How-do-I-implement-a-tensor-product-of-two-matrices-in-R?share=1
 */
export function tensorMatrices(m0: Complex[][], m1: Complex[][]): Complex[][] {
    const resultMatrixRows: number = countRows(m0) * countRows(m1);
    const resultMatrixCols: number = countCols(m0) * countCols(m1);
    let resultMatrix: Complex[][] = new Array(resultMatrixRows).fill(false).map(() => new Array(resultMatrixCols).fill(false));
    for (let rowM0 = 0; rowM0 < countRows(m0); rowM0++) {
        for (let colM0 = 0; colM0 < countCols(m0); colM0++) {
            for (let rowM1 = 0; rowM1 < countRows(m1); rowM1++) {
                for (let colM1 = 0; colM1 < countCols(m1); colM1++) {
                    let resultRow = rowM0 * countRows(m1) + rowM1;
                    let resultCol = colM0 * countCols(m1) + colM1;
                    resultMatrix[resultRow][resultCol] = m0[rowM0][colM0].mul(m1[rowM1][colM1]);
                }
            }
        }
    }
    return resultMatrix;
}

/**
 * Returns the inner product bra(a)ket(b) of two state vectors a and b. <br>
 * <br>
 * Example: <br>
 * [1 2 1] * <br>
 * | 2 | <br>
 * | 6 | <br>
 * | 1 | <br>
 * = <br>
 * 15
 */
export function inner(rowVector: Complex[], colVector: Complex[]): Complex {
    if (rowVector.length !== colVector.length) {
        throw new Error('Both vectors don\'t have the same amount of components');
    }
    let scalar = _0;
    for (let i = 0; i < rowVector.length; i++) {
        scalar = scalar.add(rowVector[i].mul(colVector[i]));
    }
    return scalar;
}

/**
 * Returns the outer product ket(a)bra(b) of two state vectors a and b. <br>
 * <br>
 * Example: <br>
 * | 1 | <br>
 * | 0 | * [2 1 1] <br>
 * | 2 | <br>
 * = <br>
 * | 2 1 1 | <br>
 * | 0 0 0 | <br>
 * | 4 2 2 | <br>
 */
export function outer(colVector: Complex[], rowVector: Complex[]): Complex[][] {
    let matrixResult: Complex[][] = new Array(colVector.length).fill(false).map(() => new Array(rowVector.length).fill(false));
    for (let row = 0; row < colVector.length; row++) {
        for (let col = 0; col < rowVector.length; col++) {
            matrixResult[row][col] = colVector[row].mul(rowVector[col]);
        }
    }
    return matrixResult;
}

export function hadamardProductVectors(v0: Complex[], v1: Complex[]): Complex[] {
    if (v0.length !== v1.length) {
        throw new Error('Both vectors don\'t have the same amount of components');
    }
    return [...Array(v0.length).keys()].map(index => v0[index].mul(v1[index]));
}

/**
 * Returns the conjugate of a given vector.
 */
export function conjugateVector(vector: Complex[]): Complex[] {
    let result = new Array<Complex>(vector.length).fill(_0);
    for (let i = 0; i < vector.length; i++) {
        result[i] = vector[i].conjugate();
    }
    return result;
}

export function conjugateMatrix(matrix: Complex[][]): Complex[][] {
    return forEachMatrixElement(matrix, (c) => c.conjugate());
}

/**
 * Returns the conjugate transpose of a given square matrix.
 */
export function adjoint(matrix: Complex[][]): Complex[][] {
    const rows = countRows(matrix);
    const cols = countCols(matrix);
    if (rows !== cols) {
        throw new Error('Given matrix is not a square matrix!');
    }
    const resultMatrix = forEachMatrixElement(matrix, (c) => c.conjugate());
    for (let row = 1; row < rows; row++) {
        for (let col = 0; col < row; col++) {
            const temp = resultMatrix[row][col];
            resultMatrix[row][col] = resultMatrix[col][row];
            resultMatrix[col][row] = temp;
        }
    }
    return resultMatrix;
}

export function multiplyMatrixScalar(matrix: Complex[][], scalar: Complex): Complex[][] {
    return forEachMatrixElement(matrix, (c) => c.mul(scalar));
}

function forEachMatrixElement(matrix: Complex[][], func: (complex: Complex) => Complex): Complex[][] {
    const rows = countRows(matrix);
    const cols = countCols(matrix);
    const resultMatrix = new Array<Complex[]>(rows).fill([]).map(() => new Array(cols).fill(_0));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            resultMatrix[row][col] = func(matrix[row][col]);
        }
    }
    return resultMatrix;
}

/**
 * Checks, if the given matrix is an identity matrix.
 */
export function isIdentity(matrix: Complex[][]): boolean {
    const rows = countRows(matrix);
    const cols = countCols(matrix);
    if (rows !== cols) {
        return false;
    }
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!matrix[row][col].equalsClose(Complex.ofRe(row === col ? 1 : 0))) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Checks, if the given matrix is hermitian. <br>
 * A square matrix is called hermitian if it is self-adjoint.
 * This means that the matrix is equal to its conjugate transpose.
 * This is equivalent to the condition that aij = complex_conjugate(aji). <br>
 * {@link https://mathworld.wolfram.com/HermitianMatrix.html}
 */
export function isHermitian(matrix: Complex[][]): boolean {
    if (countRows(matrix) !== countCols(matrix)) {
        return false;
    }
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col <= row; col++) {
            if (!matrix[row][col].equals(matrix[col][row].conjugate())) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Checks, if the given matrix is unitary. <br>
 * A matrix is unitary, if its conjugate transpose (adjoint) is equal to its inverse, <br>
 * with adjoint(A) * A = I.
 */
export function isUnitary(matrix: Complex[][]): boolean {
    if (countRows(matrix) !== countCols(matrix)) {
        return false;
    }
    return isIdentity(multiplyMatrices(matrix, adjoint(matrix)));
}

/**
 * The trace of a square matrix is defined as the sum of its diagonal elements.
 */
export function trace(matrix: Complex[][]): Complex {
    const rows = countRows(matrix);
    const cols = countCols(matrix);
    if (rows !== cols) {
        throw new Error('Given matrix is not a square matrix!');
    }
    return range(0, rows).map(index => matrix[index][index]).reduce((p, c) => p.add(c), _0);
}

/**
 * Returns the density (also called projector) matrix of a given vector
 * which is the outer product of this vector.
 */
export function density(vector: Complex[]): Complex[][] {
    return outer(vector, conjugateVector(vector));
}

export function countRows(matrix: any[][]) {
    return matrix.length;
}

export function countCols(matrix: any[][]) {
    return matrix[0].length;
}

export function printMatrix(matrix: any[][]) {
    let s = '';
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
            s += matrix[row][col].toString() + ' ';
        }
        s += '\n';
    }
    console.log(s);
}