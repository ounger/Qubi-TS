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
} from "../../math/complex";
import {degsToRads, expOfiTimesAngleDegrees} from "../../math/math-util";

export const IDENTITY_GATE: Complex[][] = [
    [_1, _0],
    [_0, _1]
];

export const PAULI_X_GATE: Complex[][] = [
    [_0, _1],
    [_1, _0]
];

export const PAULI_Y_GATE: Complex[][] = [
    [_0, MINUS_i],
    [i, _0]
];

export const PAULI_Z_GATE: Complex[][] = [
    [_1, _0],
    [_0, MINUS_1]
];

export const HADAMARD_GATE: Complex[][] = [
    [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO],
    [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]
];

export const PHASE_T_GATE: Complex[][] = [
    [_1, _0],
    [_0, HALF_SQRT_TWO_HALF_i_SQRT_TWO]
];

export const PHASE_S_GATE: Complex[][] = [
    [_1, _0],
    [_0, i]
];

export function getPhaseGate(angleDegrees: number): Complex[][] {
    return [
        [_1, _0],
        [_0, expOfiTimesAngleDegrees(angleDegrees)]
    ];
}

export function getRotXGate(angleDegrees: number): Complex[][] {
    const angleRadsHalf = degsToRads(angleDegrees) / 2;
    const sinAngleDegreesHalf = Math.sin(angleRadsHalf);
    const cosAngleDegreesHalf = Math.cos(angleRadsHalf);
    return [
        [Complex.ofRe(cosAngleDegreesHalf), Complex.ofIm(-sinAngleDegreesHalf)],
        [Complex.ofIm(-sinAngleDegreesHalf), Complex.ofRe(cosAngleDegreesHalf)]
    ];
}

export function getRotYGate(angleDegrees: number): Complex[][] {
    const angleRadsHalf = degsToRads(angleDegrees) / 2;
    const sinAngleRadsHalf = Math.sin(angleRadsHalf);
    const cosAngleRadsHalf = Math.cos(angleRadsHalf);
    return [
        [Complex.ofRe(cosAngleRadsHalf), Complex.ofRe(-sinAngleRadsHalf)],
        [Complex.ofRe(sinAngleRadsHalf), Complex.ofRe(cosAngleRadsHalf)]
    ];
}

export function getRotZGate(angleDegrees: number): Complex[][] {
    const angleDegreesHalf = angleDegrees / 2;
    return [
        [expOfiTimesAngleDegrees(-angleDegreesHalf), _0],
        [_0, expOfiTimesAngleDegrees(angleDegreesHalf)]
    ];
}

export function getRot1Gate(angleDegrees: number): Complex[][] {
    return [
        [_1, _0],
        [_0, expOfiTimesAngleDegrees(angleDegrees)]
    ];
}

export const RNOT_GATE = [
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)]
];

export const RNOT_INVERSE_GATE = [
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)]
];


