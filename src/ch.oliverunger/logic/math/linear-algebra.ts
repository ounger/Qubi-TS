import {_0, Complex} from "../../model/complex";
import {Vector2c} from "../../model/vector2c";
import {getTruthtableValueAt} from "./truth-table";

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
 * |a> dot |b> = a1 * b1 + a2 * b2 + ... + an * bn
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
 * Tensor/Kronecker product
 * |ab> = |a> tensor |b> = [a(0)*b(0), a(0)*b(1), a(1)*b(0), a(1)*b(1)]
 * |abc> = |a> tensor |b> tensor |c> = [a(0)*b(0)*c(0), a(0)*b(0)*c(1), a(0)*b(1)*c(0), a(0)*b(1)*c(1), a(1)*b(0)*c(0), a(1)*b(0)*c(1), a(1)*b(1)*c(0), a(1)*b(1)*c(1)]
 */
export function tensor(...v: Vector2c[]): Complex[] {
  const lengthTensor = Math.pow(2, v.length);
  let result: Complex[] = new Array<Complex>(lengthTensor);
  for (let indexTensor = 0; indexTensor < lengthTensor; indexTensor++) {
    result[indexTensor] = new Complex(1, 0);
    for (let indexVector = 0; indexVector < v.length; indexVector++) {
      result[indexTensor] = result[indexTensor].mul(v[indexVector][getTruthtableValueAt(v.length, indexTensor, indexVector)]);
    }
  }
  return result;
}

export function inner() {
  // TODO
}

export function outer() {
  // TODO
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

/**
 * Example: <br>
 * | 1 | <br>
 * | 0 | * [2 1 1] <br>
 * | 2 | <br>
 * = <br>
 * | 2 1 1 | <br>
 * | 0 0 0 | <br>
 * | 4 2 2 | <br>
 */
export function multiplyRowVectorColVector(v0: Complex[], v1: Complex[]): Complex[][] {
  let matrixResult: Complex[][] = new Array(v0.length).fill(false).map(() => new Array(v1.length).fill(false));
  for (let row = 0; row < v0.length; row++) {
    for (let col = 0; col < v1.length; col++) {
      matrixResult[row][col] = v0[row].mul(v1[col]);
    }
  }
  return matrixResult;
}

/**
 * Example: <br>
 * [1 2 1] * <br>
 * | 2 | <br>
 * | 6 | <br>
 * | 1 | <br>
 * = <br>
 * 15
 */
export function multiplyColVectorRowVector(v0: Complex[], v1: Complex[]): Complex {
  if (v0.length !== v1.length) {
    throw new Error("Both vectors don't have the same amount of components");
  }
  let scalar = _0;
  for (let i = 0; i < v0.length; i++) {
    scalar = scalar.add(v0[i].mul(v1[i]));
  }
  return scalar;
}

function forEachMatrixElement(matrix: Complex[][], func: (complex: Complex) => Complex): Complex[][] {
  return matrix.map((row) => {
    return row.map((complex) => {
      return func(complex);
    });
  });
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
