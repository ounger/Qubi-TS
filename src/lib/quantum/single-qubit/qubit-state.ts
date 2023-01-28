/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {
    _0,
    _1,
    Complex,
    i_OF_SQRT_TWO,
    MINUS_1,
    MINUS_i_OF_SQRT_TWO,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from "../../math/complex";

export type QubitState = [stateZeroAmplitude: Complex, stateOneAmplitude: Complex];

// The two orthogonal z-basis states (also called computational basis states)
export const STATE_ZERO: QubitState = [_1, _0];
export const STATE_ONE: QubitState = [_0, _1];

// The two orthogonal x-basis states
export const STATE_PLUS: QubitState = [ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO];
export const STATE_MINUS: QubitState = [ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO];

// The two orthogonal y-basis states
/** Right State or i State */
export const STATE_R: QubitState = [ONE_OF_SQRT_TWO, i_OF_SQRT_TWO];
/** Left State or -i State */
export const STATE_L: QubitState = [ONE_OF_SQRT_TWO, MINUS_i_OF_SQRT_TWO];

// Others
export const STATE_MINUS_ONE = [_0, MINUS_1];