/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from '../../math/truth-table';
import {Qubit} from '../single-qubit/qubit';
import {STATE_ZERO} from '../single-qubit/qubit-state';

/**
 * A Quantum Random Number Generator (QRNG) that emits a 0 or 1
 * with exactly 50 % probability for each case.
 */
export function executeQRNGAlgorithm(): Bit {
    const qubit = Qubit.ofState(STATE_ZERO);
    qubit.had();
    return qubit.measure();
}