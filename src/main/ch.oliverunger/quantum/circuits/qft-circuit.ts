import {Circuit} from './circuit';
import {QubitRegister} from '../multi-qubit/qubit-register';
import {cphase, had, swap, x} from '../multi-qubit/multi-qubit-gates';
import {Bit} from '../../math/truth-table';
import {radsToDegs} from '../../math/math-util';

export function createQFTCircuit(reg: QubitRegister, encodedNumber: Bit[], offset: number = 0): Circuit {
    let constructionString = '';
    if (reg.numQubits - offset !== encodedNumber.length) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the length of the bit array for the encoded number which is ${encodedNumber.length}.`);
    }
    const circuit = new Circuit();
    for (let qubit = 0; qubit < encodedNumber.length; qubit++) {
        if (encodedNumber[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit + offset));
            constructionString += `X(${qubit + offset}) `;
        }
    }

    for (let qubit = offset; qubit < encodedNumber.length + offset; qubit++) {
        circuit.addGate(() => had(reg, qubit));
        constructionString += `H(${qubit}) `;
        for (let otherQubit = qubit + 1; otherQubit < encodedNumber.length + offset; otherQubit++) {
            const angleDegrees = radsToDegs(Math.PI / Math.pow(2, otherQubit - qubit));
            circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
            constructionString += `CPhase(${qubit}, ${otherQubit}, ${angleDegrees}) `;
        }
    }

    const floorOfHalfNumEnc = Math.floor(encodedNumber.length / 2);
    for (let qubit = offset; qubit < floorOfHalfNumEnc + offset; qubit++) {
        const otherQubit = encodedNumber.length - 1 + 2 * offset - qubit;
        circuit.addGate(() => swap(reg, qubit, otherQubit));
        constructionString += `Swap(${qubit}, ${otherQubit})`;
    }
    console.log(constructionString);
    return circuit;
}

export function createQFTInvertedCircuit(reg: QubitRegister, encodedNumberAsBitArray: Bit[], offset: number = 0): Circuit {
    let constructionString = '';
    if (reg.numQubits - offset !== encodedNumberAsBitArray.length) {
        throw new Error(`
        The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the length of the bit array for the encoded number which is ${encodedNumberAsBitArray.length}.`);
    }
    const circuit = new Circuit();
    const floorOfHalfNumEnc = Math.floor(encodedNumberAsBitArray.length / 2);
    for (let qubit = offset; qubit < floorOfHalfNumEnc + offset; qubit++) {
        const otherQubit = encodedNumberAsBitArray.length + 2 * offset - 1 - qubit;
        circuit.addGate(() => swap(reg, otherQubit, qubit));
        constructionString += `Swap(${qubit}, ${otherQubit}) `;
    }
    for (let qubit = encodedNumberAsBitArray.length - 1 + offset; qubit >= offset; qubit--) {
        circuit.addGate(() => had(reg, qubit));
        constructionString += `H(${qubit}) `;
        for (let otherQubit = qubit - 1; otherQubit >= offset; otherQubit--) {
            const angleDegrees = radsToDegs(-1 * Math.PI / Math.pow(2, qubit - otherQubit));
            circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
            constructionString += `CPhase(${qubit}, ${otherQubit}, ${angleDegrees}) `;
        }
    }
    for (let qubit = 0; qubit < encodedNumberAsBitArray.length; qubit++) {
        if (encodedNumberAsBitArray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit + offset));
            constructionString += `X(${qubit + offset}) `;
        }
    }
    console.log(constructionString);
    return circuit;
}
