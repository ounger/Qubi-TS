import {Circuit} from "./circuit";
import {
    BELL_STATE_PHI_MINUS,
    BELL_STATE_PHI_PLUS,
    BELL_STATE_PSI_MINUS,
    BELL_STATE_PSI_PLUS,
    QubitRegister
} from "../multi-qubit/qubit-register";
import {cx, hadSingle} from "../multi-qubit/multi-qubit-gates";
import {bit} from "../../math/truth-table";

/**
 * Given a register of two qubits with the qubits being in a bell state it returns a Bell State analyzer circuit. <br>
 * After measuring the qubits, you can analyze the result with {@link analyzeBellState}.
 */
export function createBellStateAnalyzerCircuit(reg: QubitRegister, q0: number, q1: number): Circuit {
    const circuit = new Circuit();
    circuit.addGate(() => cx(reg, q0, q1));
    circuit.addGate(() => hadSingle(reg, q0));
    // TODO Umschreiben, sodass gemessene Bits direkt auf Klassiche Bits geschrieben werden.
    // TODO circuit.addGate(() => measureSingleQubit(reg, q0, c0)); Write to classical bit 0
    // TODO circuit.addGate(() => measureSingleQubit(reg, q0, c1)); Write to classical bit 1
    return circuit;
}

export function analyzeBellState(b0: bit, b1: bit):
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