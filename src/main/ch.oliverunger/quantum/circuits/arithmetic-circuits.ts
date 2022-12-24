import {QubitRegister} from "../multi-qubit/qubit-register";
import {Circuit} from "./circuit";
import {mct} from "../multi-qubit/multi-qubit-gates";
import {range} from "../../util";

export function createIncrementCircuit(reg: QubitRegister): Circuit {
    const circuit = new Circuit();
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits; qubit++) {
        const controls = range(qubit + 1, numQubits);
        circuit.addGate(() => mct(reg, controls, qubit));
    }
    return circuit;
}

export function createDecrementCircuit(reg: QubitRegister): Circuit {
    const circuit = new Circuit();
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits; qubit++) {
        const controls = range(numQubits - qubit, numQubits);
        const target = numQubits - 1 - qubit;
        circuit.addGate(() => mct(reg, controls, target));
    }
    return circuit;
}

export function add(reg: QubitRegister): Circuit {
    // TODO
    return new Circuit();
}

export function sub(reg: QubitRegister): Circuit {
    // TODO
    return new Circuit();
}
