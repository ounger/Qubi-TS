/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Qubit} from "../single-qubit/qubit";
import {STATE_ZERO} from "../single-qubit/qubit-state";
import {Bit} from "../../math/truth-table";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {cx, had, phaseZ, x} from "../multi-qubit/multi-qubit-gates";
import {analyzeBellState, createBellStateAnalyzerCircuit} from "../circuits/analyzer-circuits";
import {BELL_STATE_PHI_MINUS, BELL_STATE_PSI_MINUS, BELL_STATE_PSI_PLUS} from "../multi-qubit/bell-states";

/**
 * Entangles two separate parties (Alice and Bob) over an unknowing third party (Carol). <br>
 * See Wikipedia: {@link https://en.wikipedia.org/wiki/Quantum_teleportation#Entanglement_swapping} <br>
 * and Youtube: {@link https://www.youtube.com/watch?v=hxDYq09mWTo&t=276}
 */
export function executeEntanglementSwappingAlgorithm(): Bit[] {
    const alicesQubit0 = Qubit.ofState(STATE_ZERO);
    const alicesQubit1 = Qubit.ofState(STATE_ZERO);

    const bobsQubit0 = Qubit.ofState(STATE_ZERO);
    const bobsQubit1 = Qubit.ofState(STATE_ZERO);

    const reg = QubitRegister.ofQubits(alicesQubit0, alicesQubit1, bobsQubit0, bobsQubit1);

    // Create entangled Bell State Phi Plus of Alice's qubits
    had(reg, 0);
    cx(reg, [0, 1], 1);

    // Create entangled Bell State Phi Plus of Bob's qubits
    had(reg, 2);
    cx(reg, [2, 1], 3);

    // Carol analyzes the given qubits without knowing anything about them.
    const bsa = createBellStateAnalyzerCircuit(reg, 1, 2);
    bsa.execute();
    const b1 = reg.measureSingleQubit(1);
    const b2 = reg.measureSingleQubit(2);
    // We want a Bell State Phi Plus. If we have another Bell State, we have to apply the following gates:
    const bellState = analyzeBellState(b1, b2);
    if (bellState === BELL_STATE_PSI_PLUS || bellState === BELL_STATE_PSI_MINUS) {
        x(reg, 3);
    }
    if (bellState === BELL_STATE_PHI_MINUS || bellState === BELL_STATE_PSI_MINUS) {
        phaseZ(reg, 3);
    }

    // b0 and b3 should be equal now
    const b0 = reg.measureSingleQubit(0);
    const b3 = reg.measureSingleQubit(3);

    return [b0, b1, b2, b3];

    // An alternative implementation can be found here:
    // https://github.com/principia137/Quantum-entanglement-swapping-protocol
}