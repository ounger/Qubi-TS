import {QubitRegister} from '../multi-qubit/qubit-register';
import {getNumberAsBitArray, getNumberAsBitArrayZeroPadded} from '../../util';
import {createQFTCircuit, createQFTInvertedCircuit} from "../circuits/qft-circuit";
import {createEncodeNumberCircuit} from "../circuits/misc-circuits";
import {Circuit} from "../circuits/circuit";
import {cphase} from "../multi-qubit/multi-qubit-gates";

/**
 * Adds two integer numbers using the Drapper algorithm.
 */
export function executeAddAlgorithm(valueA: number, valueB: number): number {
    let a = getNumberAsBitArray(valueA);
    let b = getNumberAsBitArray(valueB);
    const n = Math.max(a.length, b.length);
    if (a.length === n) {
        b = getNumberAsBitArrayZeroPadded(valueB, n);
    } else {
        a = getNumberAsBitArrayZeroPadded(valueA, n);
    }
    // Bit array a and b are of length n now
    const numQubits = 2 * n;
    console.log(`Num qubits: ${numQubits}`);
    const reg = new QubitRegister(numQubits);

    // Encode a on register
    createEncodeNumberCircuit(reg, a).execute();

    // Encode b on register
    createEncodeNumberCircuit(reg, b, n).execute();

    // Step 1: QFT on bit array a
    createQFTCircuit(reg, n).execute();

    // Step 2: Evolve a by b
    createEvolveCircuit(reg).execute();

    // Step 3: Inverse qft to decode phases back to bits
    createQFTInvertedCircuit(reg, n).execute();

    console.log(reg.nonZeroProbabilities());

    return reg.measure();
}

function createEvolveCircuit(reg: QubitRegister): Circuit {
    console.log("Evolve");
    const n = reg.numQubits / 2;

    let constructionString = '';
    const circuit = new Circuit();
    for (let targetQubit = 0; targetQubit < n; targetQubit++) {
        for (let controlQubit = n + targetQubit; controlQubit < 2 * n; controlQubit++) {
            const angleDegrees = 180 / Math.pow(2, controlQubit - targetQubit - n);
            cphase(reg, controlQubit, targetQubit, angleDegrees);
            constructionString += `CPhase(${controlQubit}, ${targetQubit}, ${angleDegrees}) `;

        }
    }
    console.log(constructionString);
    return circuit;
}




