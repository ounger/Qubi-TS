/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Circuit} from './circuit';
import {QubitRegister} from '../multi-qubit/qubit-register';
import {cphase, had} from '../multi-qubit/multi-qubit-gates';
import {radsToDegs} from '../../math/math-util';
import {createSwapQubitsInsideOutCircuit, createSwapQubitsOutsideInCircuit} from "./misc-circuits";

export function createQFTCircuit(reg: QubitRegister, n?: number, mirror: boolean = false, offset: number = 0): Circuit {
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

    // console.log(constructionString);

    if (mirror) {
        circuit.appendCircuitToEnd(createSwapQubitsOutsideInCircuit(reg, n, offset));
    }

    return circuit;
}

export function createQFTInvertedCircuit(reg: QubitRegister, n?: number, mirror: boolean = false, offset: number = 0): Circuit {
    n = n !== undefined ? n : reg.numQubits - offset;

    if (reg.numQubits - offset < n) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the given length which is ${n}.`);
    }

    let constructionString = "";
    const circuit = new Circuit();

    if (mirror) {
        circuit.appendCircuitToEnd(createSwapQubitsInsideOutCircuit(reg, n, offset));
    }

    for (let targetQubit = n - 1 + offset; targetQubit >= offset; targetQubit--) {
        for (let controlQubit = n - 1 + offset; controlQubit > targetQubit; controlQubit--) {
            const angleDegrees = radsToDegs(-1 * Math.PI / Math.pow(2, controlQubit - targetQubit));
            circuit.addGate(() => cphase(reg, controlQubit, targetQubit, angleDegrees));
            constructionString += `CPhase(${controlQubit}, ${targetQubit}, ${angleDegrees}) `;
        }

        circuit.addGate(() => had(reg, targetQubit));
        constructionString += `H(${targetQubit}) `;
    }

    // console.log(constructionString);

    return circuit;
}
