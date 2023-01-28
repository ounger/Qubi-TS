/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

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
} from '../../math/complex';
import {degsToRads, expOfiTimesAngleDegrees, expOfITimesAngleRadians} from '../../math/math-util';

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
    return getU1Gate(degsToRads(angleDegrees));
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
    return getPhaseGate(angleDegrees);
}

export const RNOT_GATE = [
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)]
];

export const RNOT_INVERSE_GATE = [
    [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
    [new Complex(0.5, 0.5), new Complex(0.5, -0.5)]
];

/**
 * The 'discrete phase gate' or 'Rk' gate is a generalization of the phase gate. It performs rotations around the z-axis by
 * fractional powers of 2, as in (2 * PI) / 2^k -> 2 * PI, PI, PI / 2, PI / 4, ...
 */
export function getRkGate(k: number): Complex[][] {
    if (!Number.isInteger(k)) {
        throw new Error('k has to be an integer');
    }
    return [
        [_1, _0],
        [_0, expOfITimesAngleRadians(2 * Math.PI / Math.pow(2, k))]
    ];
}

/**
 * The 'Phase shift' or 'Phase kick' gate is similar to the Rk gate ({@link getRkGate}),
 * but arbitrary phase angles are allowed. <br>
 */
export function getU1Gate(angleRadians: number): Complex[][] {
    return [
        [_1, _0],
        [_0, expOfITimesAngleRadians(angleRadians)]
    ];
}

