import {Circuit} from "../../circuit";
import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {cphase, hadSingle, swap, x} from "../../../multi-qubit/multi-qubit-gates";
import {bit} from "../../../../math/truth-table";
import {radsToDegs} from "../../../../math/math-util";

export function createQFTCircuit(reg: QubitRegister, encodedNumber: bit[]): Circuit {
    if (reg.numQubits !== encodedNumber.length) {
        throw new Error(`Given register has ${reg.numQubits} qubits. 
        This number is not equal to the length of the bit array for 
        the encoded number which is ${encodedNumber.length}.`);
    }
    const circuit = new Circuit();
    for (let qubit = 0; qubit < encodedNumber.length; qubit++) {
        if (encodedNumber[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }

    for (let qubit = 0; qubit < reg.numQubits; qubit++) {
        circuit.addGate(() => hadSingle(reg, qubit));
        for (let otherQubit = qubit + 1; otherQubit < reg.numQubits; otherQubit++) {
            const angleDegrees = radsToDegs(Math.PI / Math.pow(2, otherQubit - qubit));
            circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
        }
    }
    for (let qubit = 0; qubit < Math.floor(reg.numQubits / 2); qubit++) {
        circuit.addGate(() => swap(reg, qubit, reg.numQubits - qubit - 1));
    }
    return circuit;
}

export function createQFTInvertedCircuit(reg: QubitRegister, encodedNumberAsBitArray: bit[]): Circuit {
    if (reg.numQubits !== encodedNumberAsBitArray.length) {
        throw new Error(`Given register has ${reg.numQubits} qubits. 
        This number is not equal to the length of the bit array for 
        the encoded number which is ${encodedNumberAsBitArray.length}.`);
    }
    const circuit = new Circuit();
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < Math.floor(reg.numQubits / 2); qubit++) {
        circuit.addGate(() => swap(reg, numQubits - 1 - qubit, qubit));
    }
    for (let qubit = reg.numQubits - 1; qubit >= 0; qubit--) {
        circuit.addGate(() => hadSingle(reg, qubit));
        for (let otherQubit = qubit - 1; otherQubit >= 0; otherQubit--) {
            const angleDegrees = radsToDegs(-1 * Math.PI / Math.pow(2, qubit - otherQubit));
            circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
        }
    }
    for (let qubit = 0; qubit < encodedNumberAsBitArray.length; qubit++) {
        if (encodedNumberAsBitArray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }
    return circuit;
}