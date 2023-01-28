/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Circuit} from "./circuit";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {Bit} from "../../math/truth-table";
import {swap, x} from "../multi-qubit/multi-qubit-gates";

export function createEncodeNumberCircuit(reg: QubitRegister, encodedNumber: Bit[], offset: number = 0): Circuit {
    if (reg.numQubits - offset < encodedNumber.length) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the length of the bit array for the encoded number which is ${encodedNumber.length}.`);
    }

    let constructionString = "";
    const circuit = new Circuit();
    for (let qubit = 0; qubit < encodedNumber.length; qubit++) {
        if (encodedNumber[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit + offset));
            constructionString += `X(${qubit + offset}) `;
        }
    }

    // console.log(constructionString);
    return circuit;
}

/**
 * Swaps pairs of qubits over the given length n working from the outside to the inside. <br>
 * Examples: <br>
 * n = 2: Then the returned circuit swaps the following pairs: (q0, q1). <br>
 * n = 3: Then the returned circuit swaps the following pairs: (q0, q2). <br>
 * n = 4: Then the returned circuit swaps the following pairs: (q0, q3) and (q1, q2). <br>
 * n = 5: Then the returned circuit swaps the following pairs: (q0, q4) and (q1, q3). <br>
 * n = 4, offset = 1: Then the returned circuit swaps the following pairs: (q1, q4) and (q2, q3). <br>
 * @param reg the register
 * @param n the length over which the swapping takes effect
 * @param offset an optional offset
 */
export function createSwapQubitsOutsideInCircuit(reg: QubitRegister, n: number, offset: number = 0): Circuit {
    const circuit = new Circuit();
    const floorOfHalfNumEnc = Math.floor(n / 2);
    let constructionString = "";
    for (let qubit = offset; qubit < floorOfHalfNumEnc + offset; qubit++) {
        const otherQubit = n - 1 + 2 * offset - qubit;
        circuit.addGate(() => swap(reg, qubit, otherQubit));
        constructionString += `Swap(${qubit}, ${otherQubit}) `;
    }
    // console.log(constructionString);
    return circuit;
}

/**
 * Like {@link createSwapQubitsOutsideInCircuit} but working from the inside to the outside.
 */
export function createSwapQubitsInsideOutCircuit(reg: QubitRegister, n: number, offset: number = 0): Circuit {
    const circuit = new Circuit();
    const floorOfHalfNumEnc = Math.floor(n / 2);
    let constructionString = "";
    for (let qubit = floorOfHalfNumEnc + offset; qubit < n + offset; qubit++) {
        const otherQubit = n - 1 + 2 * offset - qubit;
        if (qubit !== otherQubit) {
            circuit.addGate(() => swap(reg, qubit, otherQubit));
            constructionString += `Swap(${qubit}, ${otherQubit}) `;
        }
    }
    // console.log(constructionString);
    return circuit;
}