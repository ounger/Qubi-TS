import {QubitRegister} from "../../multi-qubit/qubit-register";
import {Circuit} from "../../circuits/circuit";
import {bit} from "../../../math/truth-table";
import {hadSingle, x} from "../../multi-qubit/multi-qubit-gates";

export function executeBernsteinVaziraniAlgorithm(reg: QubitRegister, bvOracle: Circuit): bit[] {
    const circuit = new Circuit();

    // Output to ket(-)
    circuit.addGate(() => x(reg, reg.numQubits - 1));
    circuit.addGate(() => hadSingle(reg, reg.numQubits - 1));

    // Input to ket(+)
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        circuit.addGate(() => hadSingle(reg, qubit));
    }

    circuit.appendCircuitToEnd(bvOracle);

    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        circuit.addGate(() => hadSingle(reg, qubit));
    }

    circuit.execute();

    const result = new Array<bit>(reg.numQubits - 1);
    for (let qubit = 0; qubit < reg.numQubits - 1; qubit++) {
        result[qubit] = reg.measureSingleQubit(qubit);
    }
    return result;
}