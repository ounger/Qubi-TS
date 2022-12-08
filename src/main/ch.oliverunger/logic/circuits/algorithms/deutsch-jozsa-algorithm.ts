import {Circuit} from "../../../model/circuit";
import {QubitRegister} from "../../../model/qubit-register";
import {hadSingle, x} from "../../gates/multi-qubit-gates";
import {bit} from "../../math/truth-table";

export function executeDeutschJozsaAlgorithm(reg: QubitRegister, djOracle: Circuit): bit[] {
    const circuit = new Circuit();

    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        circuit.addGate(() => hadSingle(reg, qubit));
    }
    circuit.addGate(() => x(reg, numQubits - 1));
    circuit.addGate(() => hadSingle(reg, numQubits - 1));

    circuit.appendCircuitToEnd(djOracle);

    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        circuit.addGate(() => hadSingle(reg, qubit));
    }

    circuit.execute();

    const result = new Array<bit>(numQubits - 1);
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        result[qubit] = reg.measureSingleQubit(qubit);
    }
    return result;
}