/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Circuit} from '../../circuits/circuit';
import {QubitRegister} from '../../multi-qubit/qubit-register';
import {cx} from '../../multi-qubit/multi-qubit-gates';
import {getNumberAsBitArrayZeroPadded} from '../../../util';
import {Bit} from '../../../math/truth-table';

export function createSimonsOracle(reg: QubitRegister, secret: Bit[]): Circuit {
    if (reg.numQubits % 2 === 1) {
        throw new Error("The number of qubits must be divisible by 2.");
    }
    if (secret.every(b => b === 0)) {
        return createOneToOneSimonsOracle(reg);
    } else {
        return createTwoToOneSimonsOracle(reg, secret);
    }
}

/**
 * Creates an oracle based on a one-to-one function for simons algorithm for a
 * register with n input qubits and n output qubits.
 */
function createOneToOneSimonsOracle(reg: QubitRegister): Circuit {
    // The hidden bitarray 'secret' is 00...0
    // We copy the content of the first register to the second register
    const circuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;
    for (let inputQubit = 0; inputQubit < numInputQubits; inputQubit++) {
        circuit.addGate(() => cx(reg, [inputQubit, 1], numInputQubits + inputQubit));
    }
    return circuit;
}

/**
 * Creates an oracle based on a two-to-one function for simons algorithm for a
 * register with n input qubits and n output qubits. <br>
 * See {@link https://quantumcomputing.stackexchange.com/questions/15567/in-simons-algorithm-is-there-a-general-method-to-define-an-oracle-given-a-cert}
 */
function createTwoToOneSimonsOracle(reg: QubitRegister, secret: Bit[]): Circuit {
    const numInputQubits = reg.numQubits / 2;
    const zeroAsBitArray = getNumberAsBitArrayZeroPadded(0, numInputQubits);
    if (zeroAsBitArray === secret) {
        throw new Error("Hidden bitarray 'secret' has to be unequal to the bitarray 00...0, because this would be a one-to-one function!");
    }

    const circuit = new Circuit();

    // Copy input to output
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        circuit.addGate(() => cx(reg, [qubit, 1], numInputQubits + qubit));
    }

    const mostSignificant1BitInSecret = secret.indexOf(1);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        if (secret[qubit] === 1) {
            circuit.addGate(() => cx(reg, [mostSignificant1BitInSecret, 1], numInputQubits + qubit));
        }
    }

    return circuit;
}