import {bit} from "../../../math/truth-table";
import {QubitRegister} from "../../multi-qubit/qubit-register";
import {Circuit} from "../../circuits/circuit";
import {cx} from "../../multi-qubit/multi-qubit-gates";

export function createBernsteinVaziraniOracle(reg: QubitRegister, s: bit[]): Circuit {
    const circuit = new Circuit();
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (s[qubit] === 1) {
            circuit.addGate(() => cx(reg, qubit, numQubits - 1));
        }
    }
    return circuit;
}