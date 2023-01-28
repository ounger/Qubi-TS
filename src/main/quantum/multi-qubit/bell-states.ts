/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {_0, Complex, MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO} from "../../math/complex";

/**
 * One of the four Bell States <br>
 * The result from input ket(00) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PHI_PLUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, ONE_OF_SQRT_TWO];

/**
 * One of the four Bell States <br>
 * The result from input ket(10) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PHI_MINUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, MINUS_ONE_OF_SQRT_TWO];

/**
 * One of the four Bell States <br>
 * The result from input ket(01) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PSI_PLUS: Complex[] = [_0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0];

/**
 * One of the four Bell States <br>
 * The result from input ket(11) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PSI_MINUS: Complex[] = [_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0];