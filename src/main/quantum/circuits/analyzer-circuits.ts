/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Circuit} from "./circuit";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {cx, had} from "../multi-qubit/multi-qubit-gates";
import {Bit} from "../../math/truth-table";
import {
    BELL_STATE_PHI_MINUS,
    BELL_STATE_PHI_PLUS,
    BELL_STATE_PSI_MINUS,
    BELL_STATE_PSI_PLUS
} from "../multi-qubit/bell-states";

/**
 * Given a register of two qubits with the qubits being in a bell state it returns a Bell State analyzer circuit. <br>
 * After measuring the qubits, you can analyze the result with {@link analyzeBellState}.
 */
export function createBellStateAnalyzerCircuit(reg: QubitRegister, q0: number, q1: number): Circuit {
    const circuit = new Circuit();
    circuit.addGate(() => cx(reg, [q0, 1], q1));
    circuit.addGate(() => had(reg, q0));
    // TODO Umschreiben, sodass gemessene Bits direkt auf Klassiche Bits geschrieben werden.
    // TODO circuit.addGate(() => measureSingleQubit(reg, q0, c0)); Write to classical bit 0
    // TODO circuit.addGate(() => measureSingleQubit(reg, q0, c1)); Write to classical bit 1
    return circuit;
}

export function analyzeBellState(b0: Bit, b1: Bit):
    typeof BELL_STATE_PHI_PLUS |
    typeof BELL_STATE_PHI_MINUS |
    typeof BELL_STATE_PSI_PLUS |
    typeof BELL_STATE_PSI_MINUS {
    if (b0 === 0) {
        if (b1 === 0) {
            return BELL_STATE_PHI_PLUS;
        } else {
            return BELL_STATE_PSI_PLUS;
        }
    } else {
        if (b1 === 0) {
            return BELL_STATE_PHI_MINUS;
        } else {
            return BELL_STATE_PSI_MINUS;
        }
    }
}