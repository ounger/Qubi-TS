/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from "../../math/truth-table";
import {Qubit} from "../single-qubit/qubit";
import {STATE_ZERO} from "../single-qubit/qubit-state";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {cx, had, phaseZ, x} from "../multi-qubit/multi-qubit-gates";

/**
 * Superdense Coding encodes two classical bits in one qubit. <br>
 * Story: Alice and Bob share an entangled pair of qubits. Both are a at different locations
 * and each has one qubit with them. Alice wants to communicate two classical bits to Bob
 * but can only transport one qubit physically to Bob.
 * @return Bob's measurement will correspond to the encoded classical bits.
 */
export function executeSuperdenseCodingAlgorithm(message: [b0: Bit, b1: Bit]): [b0: Bit, b1: Bit] {
    const alicesQubit = Qubit.ofState(STATE_ZERO);
    const bobsQubit = Qubit.ofState(STATE_ZERO);
    const reg = QubitRegister.ofQubits(alicesQubit, bobsQubit);

    // Create an entanglement (Bell State Phi Plus)
    had(reg, 0);
    cx(reg, [0, 1], 1);

    // Now encode the message
    if (message[1] === 1) {
        x(reg, 0);
        // We are in Bell State Psi Plus now
    }
    if (message[0] === 1) {
        phaseZ(reg, 0);
        // When we were in Bell State Phi Plus before, we are in Bell State Phi Minus now
        // When we were in Bell State Psi Plus before, we are in Bell State Psi Minus now
    }

    // Now Alice transports her qubit to Bob.
    // Bob disentangles the qubits
    cx(reg, [0, 1], 1);
    had(reg, 0);

    // Bob measures the qubits
    const b0 = reg.measureSingleQubit(0);
    const b1 = reg.measureSingleQubit(1);
    return [b0, b1];
}