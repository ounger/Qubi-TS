import {QubitRegister} from '../multi-qubit/qubit-register';
import {getNumberAsBitArray, getNumberAsBitArrayZeroPadded} from '../../util';
import {createQFTCircuit, createQFTInvertedCircuit} from "../circuits/qft-circuit";
import {createEncodeNumberCircuit} from "../circuits/misc-circuits";
import {Circuit} from "../circuits/circuit";

export function add(valueA: number, valueB: number): number {
    let a = getNumberAsBitArray(valueA);
    let b = getNumberAsBitArray(valueB);
    const n = Math.max(a.length, b.length);
    if (a.length === n) {
        b = getNumberAsBitArrayZeroPadded(valueB, n);
    } else {
        a = getNumberAsBitArrayZeroPadded(valueA, n);
    }
    // Bit array a and b are of length n now
    // We need a register of length (n + 1) + (n + 1) = 2 * (n + 1) = 2n + 2
    const numQubits = 2 * n + 2;
    console.log(`Num qubits: ${numQubits}`);
    const reg = new QubitRegister(numQubits);

    // Encode a on register
    createEncodeNumberCircuit(reg, a).execute();

    // Encode b on register
    createEncodeNumberCircuit(reg, b, n + 1).execute();

    // Step 1: QFT on bit array a
    createQFTCircuit(reg, n).execute();

    // Step 2: Evolve a by b
    createEvolveCircuit(reg).execute();

    // Step 3: Inverse qft to decode phases back to bits
    createQFTInvertedCircuit(reg, n).execute();

    return reg.measure();
}

function createEvolveCircuit(reg: QubitRegister): Circuit {
    const n = reg.numQubits / 2;
    const circuit = new Circuit();

    return circuit;
}




