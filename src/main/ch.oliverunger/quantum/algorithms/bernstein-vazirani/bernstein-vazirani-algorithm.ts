import {QubitRegister} from "../../multi-qubit/qubit-register";
import {Circuit} from "../../circuits/circuit";
import {Bit} from "../../../math/truth-table";
import {hadSingle, x} from "../../multi-qubit/multi-qubit-gates";

export function executeBernsteinVaziraniAlgorithm(reg: QubitRegister, bvOracle: Circuit): Bit[] {
    // Output qubit to ket(-)
    x(reg, reg.numQubits - 1);
    hadSingle(reg, reg.numQubits - 1);

    // Input qubits to ket(+)
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        hadSingle(reg, qubit);
    }

    bvOracle.execute();

    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        hadSingle(reg, qubit);
    }

    const result = new Array<Bit>(reg.numQubits - 1);
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        result[qubit] = reg.measureSingleQubit(qubit);
    }
    return result;
}