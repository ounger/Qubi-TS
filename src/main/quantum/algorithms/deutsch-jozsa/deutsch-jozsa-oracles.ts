/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {cx, x} from '../../multi-qubit/multi-qubit-gates';
import {QubitRegister} from '../../multi-qubit/qubit-register';
import {Circuit} from '../../circuits/circuit';
import {getNumberAsBitArrayZeroPadded, randomIntFromInterval} from '../../../util';
import {executeQRNGAlgorithm} from '../qrng-algorithm';

/**
 * Returns a constant function f: {0, 1}^n -> {0, 1} as an oracle circuit.
 */
export function createConstantDeutschJozsaOracle(reg: QubitRegister): Circuit {
    // Decide what the fixed output of the oracle will be by randomly applying an X-Gate
    // to the (output) qubit with the lowest value 2^0 = 1 (that's the last one).
    const lowestValueQubitIndex = reg.numQubits - 1; // Output qubit
    const circuit = new Circuit();
    const output = executeQRNGAlgorithm();
    if (output === 1) {
        circuit.addGate(() => x(reg, lowestValueQubitIndex));
    }
    return circuit;
}

/**
 * Returns a balanced function f: {0, 1}^n -> {0, 1} as an oracle circuit.
 */
export function createBalancedDeutschJozsaOracle(reg: QubitRegister): Circuit {
    // To vary the balanced function, we add X-Gates randomly.
    // If we apply them again at the same qubits at the end, we still have a balanced function.
    const numQubits = reg.numQubits;
    const circuit = new Circuit();
    const rnd = randomIntFromInterval(0, Math.pow(2, numQubits - 1));
    const rndIntAsBitarray = getNumberAsBitArrayZeroPadded(rnd, numQubits - 1);

    // Apply X-Gates for variation to the input qubits
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (rndIntAsBitarray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }

    // The core balanced function
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        circuit.addGate(() => cx(reg, [qubit, 1], numQubits - 1));
    }

    // We have to apply the X-Gates at the same qubits again we did for the variation
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        if (rndIntAsBitarray[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit));
        }
    }
    return circuit;
}
