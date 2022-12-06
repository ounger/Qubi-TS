import {cx, x} from "../../gates/multi-qubit-gates";
import {QubitRegister} from "../../../model/qubit-register";
import {Circuit} from "../../../model/circuit";
import {randomIntFromInterval} from "../../../util";
import {getNumberAsBitArray} from "../../math/math-util";
import {qrng} from "../misc-circuits";

export function createConstantDeutschJozsaOracle(reg: QubitRegister): Circuit {
    const numQubits = reg.numQubits;
    const circuit = new Circuit();
    // Decide what the fixed output of the oracle will be.
    // So we create a function that always returns 0 or always returns 1 for all inputs.
    const output = qrng();
    if (output === 1) {
        circuit.addGate(() => x(reg, numQubits - 1));
    }
    return circuit;
}

export function createBalancedDeutschJozsaOracle(reg: QubitRegister): Circuit {
    const numQubits = reg.numQubits;
    const circuit = new Circuit();
    // To vary the balanced function, we add x gates randomly.
    // If we apply them again at the same qubit at the end, we still have a balanced function.
    const rnd = randomIntFromInterval(0, Math.pow(2, numQubits - 1));
    const rndIntAsBitarray = getNumberAsBitArray(rnd, numQubits - 1);

    // Apply X-Gates for variation
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (rndIntAsBitarray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }

    // The core balanced function
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        circuit.addGate(() => cx(reg, qubit, numQubits - 1));
    }

    // We have to apply the X-Gates at the same qubits again we did for the variation
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (rndIntAsBitarray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }
    return circuit;
}
