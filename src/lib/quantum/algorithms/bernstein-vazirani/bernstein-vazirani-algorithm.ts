/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from "../../multi-qubit/qubit-register";
import {Circuit} from "../../circuits/circuit";
import {Bit} from "../../../math/truth-table";
import {had, x} from "../../multi-qubit/multi-qubit-gates";

export function executeBernsteinVaziraniAlgorithm(reg: QubitRegister, bvOracle: Circuit): Bit[] {
    // Output qubit to ket(-)
    x(reg, reg.numQubits - 1);
    had(reg, reg.numQubits - 1);

    // Input qubits to ket(+)
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        had(reg, qubit);
    }

    bvOracle.execute();

    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        had(reg, qubit);
    }

    const result = new Array<Bit>(reg.numQubits - 1);
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        result[qubit] = reg.measureSingleQubit(qubit);
    }
    return result;
}