import {Circuit} from './circuit';
import {QubitRegister} from '../multi-qubit/qubit-register';
import {cphase, had, swap} from '../multi-qubit/multi-qubit-gates';
import {radsToDegs} from '../../math/math-util';

export function createQFTCircuit(reg: QubitRegister, n?: number, offset: number = 0): Circuit {
    n = n !== undefined ? n : reg.numQubits - offset;

    if (reg.numQubits - offset < n) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the given length which is ${n}.`);
    }

    let constructionString = '';
    const circuit = new Circuit();
    for (let qubit = offset; qubit < n + offset; qubit++) {
        circuit.addGate(() => had(reg, qubit));
        constructionString += `H(${qubit}) `;
        for (let otherQubit = qubit + 1; otherQubit < n + offset; otherQubit++) {
            const angleDegrees = radsToDegs(Math.PI / Math.pow(2, otherQubit - qubit));
            circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
            constructionString += `CPhase(${qubit}, ${otherQubit}, ${angleDegrees}) `;
        }
    }

    const floorOfHalfNumEnc = Math.floor(n / 2);
    for (let qubit = offset; qubit < floorOfHalfNumEnc + offset; qubit++) {
        const otherQubit = n - 1 + 2 * offset - qubit;
        circuit.addGate(() => swap(reg, qubit, otherQubit));
        constructionString += `Swap(${qubit}, ${otherQubit}) `;
    }

    console.log(constructionString);
    return circuit;
}

export function createQFTInvertedCircuit(reg: QubitRegister, n?: number, offset: number = 0): Circuit {
    n = n !== undefined ? n : reg.numQubits - offset;

    if (reg.numQubits - offset < n) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the given length which is ${n}.`);
    }

    let constructionString = "";
    const circuit = new Circuit();
    const floorOfHalfNumEnc = Math.floor(n / 2);
    for (let qubit = offset; qubit < floorOfHalfNumEnc + offset; qubit++) {
        const otherQubit = n + 2 * offset - 1 - qubit;
        circuit.addGate(() => swap(reg, otherQubit, qubit));
        constructionString += `Swap(${qubit}, ${otherQubit}) `;
    }
    // for (let controlQubit = n - 1 + offset; controlQubit >= 0; controlQubit--) {
    //     circuit.addGate(() => had(reg, controlQubit));
    //     constructionString += `H(${controlQubit}) `;
    //     for (let targetQubit = controlQubit - 1; targetQubit >=; targetQubit--) {
    //         const angleDegrees = radsToDegs(-1 * Math.PI / Math.pow(2, qubit - otherQubit));
    //         circuit.addGate(() => cphase(reg, qubit, otherQubit, angleDegrees));
    //         constructionString += `CPhase(${qubit}, ${otherQubit}, ${angleDegrees}) `;
    //     }
    //
    // } // TODO Doesnt work

    console.log(constructionString);
    return circuit;
}
