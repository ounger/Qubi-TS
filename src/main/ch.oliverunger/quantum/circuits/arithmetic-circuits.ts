import {QubitRegister} from "../multi-qubit/qubit-register";
import {Circuit} from "./circuit";
import {ccx, cx, mct} from "../multi-qubit/multi-qubit-gates";
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

/**
 * Returns a circuit that sums two bits
 * @param reg The register this circuit shall operate on
 * @param aQubitIndex The index of the qubit of the first input bit
 * @param bQubitIndex The index of the qubit of the second input bit
 * @param sumQubitIndex The index of the qubit of the output bit
 * @param cQubitIndex The index of the qubit of the carry bit
 */
export function halfAdder(reg: QubitRegister, aQubitIndex: number, bQubitIndex: number,
                          sumQubitIndex: number, cQubitIndex: number) {
    const circuit = new Circuit();
    circuit.addGate(() => cx(reg, aQubitIndex, sumQubitIndex));
    circuit.addGate(() => cx(reg, bQubitIndex, sumQubitIndex));
    circuit.addGate(() => ccx(reg, aQubitIndex, bQubitIndex, cQubitIndex));
    return circuit;
}

/**
 * Returns a circuit that sums three bits
 * @param reg The register this circuit shall operate on
 * @param aQubitIndex The index of the qubit of the first input bit
 * @param bQubitIndex The index of the qubit of the second input bit
 * @param cInQubitIndex The index of the qubit of the carry-in bit from a previous operation
 * @param sumQubitIndex The index of the qubit of the output bit
 * @param cOutQubitIndex The index of the qubit of the carry-out bit
 */
export function fullAdder(reg: QubitRegister, aQubitIndex: number, bQubitIndex: number, cInQubitIndex: number,
                          sumQubitIndex: number, cOutQubitIndex: number): Circuit {
    const circuit = new Circuit();
    circuit.addGate(() => cx(reg, aQubitIndex, sumQubitIndex));
    circuit.addGate(() => cx(reg, bQubitIndex, sumQubitIndex));
    circuit.addGate(() => ccx(reg, aQubitIndex, bQubitIndex, cOutQubitIndex));
    circuit.addGate(() => ccx(reg, aQubitIndex, cInQubitIndex, cOutQubitIndex));
    circuit.addGate(() => ccx(reg, bQubitIndex, cInQubitIndex, cOutQubitIndex));
    circuit.addGate(() => cx(reg, cInQubitIndex, sumQubitIndex));
    return circuit;
}
