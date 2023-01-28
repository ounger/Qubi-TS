/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from "../../../math/truth-table";
import {QubitRegister} from "../../multi-qubit/qubit-register";
import {Circuit} from "../../circuits/circuit";
import {cx} from "../../multi-qubit/multi-qubit-gates";

/**
 * Creates an oracle for the given secret bit-string.
 */
export function createBernsteinVaziraniOracle(reg: QubitRegister, secret: Bit[]): Circuit {
    const circuit = new Circuit();
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (secret[qubit] === 1) {
            circuit.addGate(() => cx(reg, [qubit, 1], numQubits - 1));
        }
    }
    return circuit;
}