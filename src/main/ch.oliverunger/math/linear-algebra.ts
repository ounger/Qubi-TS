import {_0, Complex} from "./complex";
import {getTTBitAt} from "./truth-table";
import {Vector2c} from "./vector2c";

export function multiplyMatrixVector2c(matrix: Complex[][], vector: Vector2c): Vector2c {
    // @ts-ignore
    return multiplyMatrixVector(matrix, vector);
}

export function multiplyMatrixVector(matrix: Complex[][], vector: Complex[]): Complex[] {
    if (countCols(matrix) !== vector.length) {
        throw new Error("The number of columns of the matrix must match the length of the vector");
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
        throw new Error("Vectors need a length of 2");
    }
    return v0[0].mul(v1[1]).sub(v1[0].mul(v0[1]));
}

export function multiplyMatrices(m0: Complex[][], m1: Complex[][]): Complex[][] {
    if (countCols(m0) !== countRows(m1)) {
        throw new Error("The number of columns of the first matrix must match the number of the rows of the second matrix");
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

/**
 * Dot product <br>
 * ket(a) dot ket(b) = a1 * b1 + a2 * b2 + ... + an * bn
 */
export function dot(v0: Complex[], v1: Complex[]): Complex {
    if (v0.length !== v1.length) {
        throw new Error("Both vectors don't have the same amount of components");
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
        throw new Error("Both vectors don't have the same amount of components");
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
        throw new Error("Both vectors don't have the same amount of components");
    }
    return [...Array(v0.length).keys()].map(index => v0[index].mul(v1[index]));
}

export function hadamardProductMatrices(m0: Complex[][], m1: Complex[][]) {
    // TODO HadamardProduct for matrices
}

export function conjugate(matrix: Complex[][]): Complex[][] {
    return forEachMatrixElement(matrix, (c) => c.conjugate());
}

export function multiplyMatrixScalar(matrix: Complex[][], scalar: Complex): Complex[][] {
    return forEachMatrixElement(matrix, (c) => c.mul(scalar));
}

function forEachMatrixElement(matrix: Complex[][], func: (complex: Complex) => Complex): Complex[][] {
    return matrix.map((row) => {
        return row.map((complex) => {
            return func(complex);
        });
    });
}

/**
 * Checks if the given matrix is hermitian. <br>
 * A square matrix is called hermitian if it is self-adjoint.
 * This means that the matrix is equal to its conjugate transpose.
 * This is equivalent to the condition that aij = complex_conjugate(aji). <br>
 * {@link https://mathworld.wolfram.com/HermitianMatrix.html}
 */
export function isHermitian(matrix: Complex[][]): boolean {
    if(countRows(matrix) !== countCols(matrix)) {
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
 * Solves a system linear equations by Gauss-Jordan elimination.
 */
export function rowReduce(matrix: Complex[][]) { // TODO Return
    // First step: Forward elimination
    // Reduces the system to (unreduced) row echelon form
    // (also called triangular form).

    const rows = countRows(matrix);
    const cols = countCols(matrix);

    let row = 0; // Initialization of the pivot row
    let col = 0; // Initialization of the pivot column

    while (row < rows && col < cols) {
        // Find the column's pivot
        let iMax = 0;
        let max = 0;
        for (let i = row; i < rows; i++) {
            const value = matrix[i][col].abs();
            if (value > max) {
                iMax = i;
                max = value;
            }
        }
        if (max < 0.00001 && max > -0.00001) {
            // No pivot in this column, pass to next column.
            col++;
        } else {
            swapRows(matrix, row, iMax);
            // Do for all rows below pivot
            for (let i = row + 1; i < rows; i++) {
                const f = matrix[i][col].div(matrix[row][col]);
                // Fill with zeros the lower part of pivot column
                matrix[i][col] = _0;
                // Do for all remaining elements in current row
                for (let j = col + 1; j < cols; j++) {
                    matrix[i][j] = matrix[i][j].sub(matrix[row][j].mul(f));
                }
            }
            // Increase pivot row and column
            row++;
            col++;
        }
    }

    // TODO Beurteilen: Eine Loesung, mehrere oder keine?
    // Weniger Gleichungen als Unbekannte -> unendlich viele Loesungen
    // Gleich viele Gleichungen wie Unbekannte -> genau eine Loesung
    // Mehr Gleichungen als Unbekannte -> keine Loesung

    // Second step: Back substitution
    // Reduces the system to reduced row echelon form.

}

function swapRows(matrix: Complex[][], firstRow: number, secondRow: number) {
    const temp = matrix[firstRow];
    matrix[firstRow] = matrix[secondRow];
    matrix[secondRow] = temp;
}

export function countRows(matrix: Complex[][]) {
    return matrix.length;
}

export function countCols(matrix: Complex[][]) {
    return matrix[0].length;
}

export function printMatrix(matrix: Complex[][]) {
    for (let row = 0; row < matrix.length; row++) {
        let rowValues = '';
        for (let col = 0; col < matrix[0].length; col++) {
            rowValues += matrix[row][col].toString() + ' ';
        }
        console.log(rowValues);
    }
}
