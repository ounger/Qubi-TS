/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitState, STATE_ZERO} from "../single-qubit/qubit-state";
import {cx, had, phaseZ, x} from "../multi-qubit/multi-qubit-gates";
import {Qubit} from "../single-qubit/qubit";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {Complex} from "../../math/complex";

/**
 * This algorithm uses entanglement to communicate information across distant locations. <br>
 * Story: Alice and Bob each hold one qubit of an entangled pair of qubits.
 * Alice wants to send an information to Bob in the form of another qubit (alpha ket(0) + beta ket(1)).
 * Alice doesn't know the values of alpha and beta and measuring would destroy the superposition.
 * But Alice wants to communicate alpha and beta to Bob.
 * @param message The message that Alice wants to send to Bob.
 */
export function executeQuantumTeleportationAlgorithm(message: QubitState): [messageAlpha: Complex, messageBeta: Complex] {
    const alicesQubit = Qubit.ofState(STATE_ZERO);
    const bobsQubit = Qubit.ofState(STATE_ZERO);
    const reg = QubitRegister.ofQubits(Qubit.ofState(message), alicesQubit, bobsQubit);

    // Create entangled Bell State Phi Plus of Alice's and Bob's qubits.
    had(reg, 1);
    cx(reg, [1, 1], 2);

    // Alice combines the message qubit with her qubit that is entangled with Bob's.
    cx(reg, [0, 1], 1);

    // Finally she applies a hadamard gate to the message qubit.
    had(reg, 0);

    // This creates the following state:
    // 1/2 * (
    // ket(00)(alpha * ket(0) + beta * ket(1)) +
    // ket(01)(alpha * ket(1) + beta * ket(0)) +
    // ket(10)(alpha * ket(0) - beta * ket(1)) +
    // ket(11)(alpha * ket(1) - beta * ket(0))
    // )

    // Alice measures her qubits, while leaving the superposition of Bob's qubit intact.
    const messageQubitValue = reg.measureSingleQubit(0);
    const alicesQubitValue = reg.measureSingleQubit(1);
    const values = "" + messageQubitValue + alicesQubitValue;

    // Alice tells Bob over a classic communication channel what she measured. If she measured
    // - ket(00) nothing has to be done.
    // - ket(01) Bob needs to flip the amplitudes by applying the X-gate.
    // - ket(10) Bob needs to flip the phase by applying the Z-gate.
    // - ket(11) Bob needs to flip the amplitudes by applying the X-gate and needs to flip the phase by applying the Z-gate.
    // so that Bob get his qubit in state alpha * ket(0) + beta * ket(1), which is the value of the message.
    if (values === "01" || values === "11") {
        x(reg, 2);
    }
    if (values === "10" || values === "11") {
        phaseZ(reg, 2);
    }


    // Return the relevant states
    const firstIndex = messageQubitValue * 4 + alicesQubitValue * 2;
    return [reg.getStates()[firstIndex], reg.getStates()[firstIndex + 1]];

}