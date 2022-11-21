import {Qubit} from "../../model/qubit";
import {multiplyMatrixVector2c} from "../math/linear-algebra";
import {
    _0,
    _1,
    Complex,
    HALF_SQRT_TWO_HALF_i_SQRT_TWO,
    i,
    MINUS_1,
    MINUS_i,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from "../../model/complex";
import {degsToRads} from "../math/util";

export const IDENTITY_MATRIX: Complex[][] = [
    [_1, _0],
    [_0, _1]
];

/**
 * The Identity gate is a single-qubit operation that multiplies the qubit's vector
 * with the identity matrix. It does not modify the quantum state.
 * NOTE: Only use it for tests.
 */
export function identity(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(IDENTITY_MATRIX, qubit.vector()));
}

export const PAULI_X_MATRIX: Complex[][] = [
    [_0, _1],
    [_1, _0]
];

/**
 * The Pauli-X gate is a single-qubit operation that is the equivalent of the NOT gate
 * for classical computers.
 */
export function x(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(PAULI_X_MATRIX, qubit.vector()));
}

export const PAULI_Y_MATRIX: Complex[][] = [
    [_0, MINUS_i],
    [i, _0]
];

/**
 * The Pauli-Y gate is a single-qubit operation.
 */
export function y(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(PAULI_Y_MATRIX, qubit.vector()));
}

export const PAULI_Z_MATRIX: Complex[][] = [
    [_1, _0],
    [_0, MINUS_1]
];

/**
 * The Pauli-Z gate is a single-qubit operation.
 */
export function z(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(PAULI_Z_MATRIX, qubit.vector()));
}

export const HADAMARD_MATRIX: Complex[][] = [
    [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO],
    [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]
];

/**
 * The Hadamard gate is a single-qubit operation that creates
 * an equal superposition of the two basis states.
 */
export function had(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(HADAMARD_MATRIX, qubit.vector()));
}

export const T_GATE: Complex[][] = [
    [_1, _0],
    [_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO]
];

/**
 * Phase shift by Math.PI / 4 (45°)
 */
export function phaseT(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(T_GATE, qubit.vector()));
}

export const S_GATE: Complex[][] = [
    [_1, _0],
    [_0, i]
];

/**
 * Phase shift by Math.PI / 2 (90°)
 */
export function phaseS(qubit: Qubit): Qubit {
    return Qubit.ofVector(multiplyMatrixVector2c(S_GATE, qubit.vector()));
}

/**
 * Phase shift by Math.PI (180°)
 */
export function phaseZ(qubit: Qubit) {
    return z(qubit);
}

/**
 * Phase shift by an angle in degrees.
 * Multiplies the matrix <br>
 * |1      0    | <br>
 * |0  e^(i*phi)| <br>
 * with the vector of the qubit. <br>
 * Phi is the angle in radians. <br>
 * e^(i*phi) = cos(phi) + i * sin(phi)
 */
export function phase(qubit: Qubit, angleDegrees: number) {
    const phi = degsToRads(angleDegrees);
    const expOfiTimesAngle: Complex = new Complex(Math.cos(phi), Math.sin(phi));
    const phaseGate = [
        [_1, _0],
        [_0, expOfiTimesAngle]
    ];
    return Qubit.ofVector(multiplyMatrixVector2c(phaseGate, qubit.vector()));
}












