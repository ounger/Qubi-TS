/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Qubit} from "../single-qubit/qubit";
import {STATE_ZERO} from "../single-qubit/qubit-state";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {cswap, had} from "../multi-qubit/multi-qubit-gates";

/**
 * The Swap Test algorithm determines if two qubits are similar or different by indirect measurement.
 * It does not actually measure the qubits, but it uses a trick to return a measurement probability
 * that tells us how similar or different the unknown given qubits are.
 * Two qubits are maximally different if their states are orthogonal (example: ket(0) and ket(1)).
 * @return A value near 0.5 means, that the two qubits are very different. A value near 1.0 means they
 * are very similar.
 */
export function executeSwapTestAlgorithm(firstQubit: Qubit, secondQubit: Qubit): number {
    const resultQubit = Qubit.ofState(STATE_ZERO);
    const reg = QubitRegister.ofQubits(resultQubit, firstQubit, secondQubit);
    had(reg, 0);
    cswap(reg, [0, 1], 1, 2);
    had(reg, 0);
    return 1 - reg.probabilityOfQubit(0); // Probability of measuring qubit 0 in ket(0)
}