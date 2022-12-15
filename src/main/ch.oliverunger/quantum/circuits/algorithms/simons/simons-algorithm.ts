import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {Circuit} from "../../circuit";
import {hadSingle} from "../../../multi-qubit/multi-qubit-gates";
import {bit} from "../../../../math/truth-table";

export function executeSimonsAlgorithm(reg: QubitRegister, simonsOracle: Circuit): bit[] {
    if (reg.numQubits % 2 === 1) {
        throw new Error("The number of qubits must be divisible by 2.");
    }
    const firstStepCircuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;

    // Input to ket(+)
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        firstStepCircuit.addGate(() => hadSingle(reg, qubit));
    }

    firstStepCircuit.appendCircuitToEnd(simonsOracle)

    firstStepCircuit.execute();

    // Measure output
    const outputResult = new Array<bit>(numInputQubits);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        outputResult[qubit] = reg.measureSingleQubit(numInputQubits + qubit);
    }

    const secondStepCircuit = new Circuit();

    // Hadamard on input
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        secondStepCircuit.addGate(() => hadSingle(reg, qubit));
    }

    secondStepCircuit.execute();

    // Measure input
    const inputResult = new Array<bit>(numInputQubits);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        inputResult[qubit] = reg.measureSingleQubit(qubit);
    }

    return inputResult;
}