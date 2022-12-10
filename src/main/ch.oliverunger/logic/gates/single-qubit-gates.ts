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
} from "../../model/math/complex";
import {expOfiTimesAngleDegrees} from "../math/math-util";

export const IDENTITY_GATE: Complex[][] = [
    [_1, _0],
    [_0, _1]
];

/**
 * The Identity gate is a single-qubit operation that multiplies the qubit's vector
 * with the identity matrix. It does not modify the quantum state.
 * NOTE: Only use it for tests.
 */
export function identity(qubit: Qubit) {
    applyGate(qubit, IDENTITY_GATE);
}

export const PAULI_X_GATE: Complex[][] = [
    [_0, _1],
    [_1, _0]
];

/**
 * The Pauli-X gate is a single-qubit operation that is the equivalent of the NOT gate
 * for classical computers.
 */
export function x(qubit: Qubit) {
    applyGate(qubit, PAULI_X_GATE);
}

export const PAULI_Y_GATE: Complex[][] = [
    [_0, MINUS_i],
    [i, _0]
];

/**
 * The Pauli-Y gate is a single-qubit operation.
 */
export function y(qubit: Qubit) {
    applyGate(qubit, PAULI_Y_GATE);
}

export const PAULI_Z_GATE: Complex[][] = [
    [_1, _0],
    [_0, MINUS_1]
];

/**
 * The Pauli-Z gate is a single-qubit operation.
 */
export function z(qubit: Qubit) {
    applyGate(qubit, PAULI_Z_GATE);
}

export const HADAMARD_GATE: Complex[][] = [
    [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO],
    [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]
];

/**
 * The Hadamard gate is a single-qubit operation that creates
 * an equal superposition of the two basis states.
 */
export function had(qubit: Qubit){
    applyGate(qubit, HADAMARD_GATE);
}

export const PHASE_T_GATE: Complex[][] = [
    [_1, _0],
    [_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO]
];

/**
 * Phase shift by Math.PI / 4 (45°)
 */
export function phaseT(qubit: Qubit) {
    applyGate(qubit, PHASE_T_GATE);
}

export const PHASE_S_GATE: Complex[][] = [
    [_1, _0],
    [_0, i]
];

/**
 * Phase shift by Math.PI / 2 (90°)
 */
export function phaseS(qubit: Qubit) {
    applyGate(qubit, PHASE_S_GATE);
}

/**
 * Phase shift by Math.PI (180°)
 */
export function phaseZ(qubit: Qubit) {
    z(qubit);
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
    const phaseGate = [
        [_1, _0],
        [_0, expOfiTimesAngleDegrees(angleDegrees)]
    ];
    applyGate(qubit, phaseGate);
}

/**
 * Rotation around the x-axis <br>
 * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
 */
export function rotx(qubit: Qubit, angleDegrees: number) {
    const angleDegreesHalf = angleDegrees / 2;
    const sinAngleDegreesHalf = Math.sin(angleDegreesHalf);
    const cosAngleDegreesHalf = Math.cos(angleDegreesHalf);
    const rxGate = [
        [Complex.ofRe(cosAngleDegreesHalf), Complex.ofIm(-sinAngleDegreesHalf)],
        [Complex.ofIm(-sinAngleDegreesHalf), Complex.ofRe(cosAngleDegreesHalf)]
    ];
    applyGate(qubit, rxGate);
}

/**
 * Rotation around the y-axis <br>
 * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
 */
export function roty(qubit: Qubit, angleDegrees: number) {
    const angleDegreesHalf = angleDegrees / 2;
    const sinAngleDegreesHalf = Math.sin(angleDegreesHalf);
    const cosAngleDegreesHalf = Math.cos(angleDegreesHalf);
    const ryGate = [
        [Complex.ofRe(cosAngleDegreesHalf), Complex.ofRe(-sinAngleDegreesHalf)],
        [Complex.ofRe(sinAngleDegreesHalf), Complex.ofRe(cosAngleDegreesHalf)]
    ];
    applyGate(qubit, ryGate);
}

/**
 * Rotation around the z-axis <br>
 * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
 */
export function rotz(qubit: Qubit, angleDegrees: number) {
    const angleDegreesHalf = angleDegrees / 2;
    const rzGate = [
        [expOfiTimesAngleDegrees(-angleDegreesHalf), _0],
        [_0, expOfiTimesAngleDegrees(angleDegreesHalf)]
    ];
    applyGate(qubit, rzGate);
}

export const RNOT_GATE = [
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)]
];

/**
 * ROOT-of-NOT
 */
export function rnot(qubit: Qubit) {
    applyGate(qubit, RNOT_GATE);
}

export const RNOT_INVERSE_GATE = [
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)]
];

/**
 * ROOT-of-NOT Inverse
 */
export function rnotInverse(qubit: Qubit) {
    applyGate(qubit, RNOT_INVERSE_GATE);
}


function applyGate(qubit: Qubit, gate: Complex[][]) {
    let amplitudesOfNewState = multiplyMatrixVector2c(gate, qubit.state());
    qubit.setAmplitudesOfState(amplitudesOfNewState[0], amplitudesOfNewState[1]);
}