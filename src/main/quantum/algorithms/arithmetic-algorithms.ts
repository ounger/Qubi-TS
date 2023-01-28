/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from '../multi-qubit/qubit-register';
import {getBitArrayAsNumber, getNumberAsBitArray, getNumberAsBitArrayZeroPadded} from '../../util';
import {createQFTCircuit, createQFTInvertedCircuit} from "../circuits/qft-circuit";
import {createEncodeNumberCircuit} from "../circuits/misc-circuits";
import {Circuit} from "../circuits/circuit";
import {cphase} from "../multi-qubit/multi-qubit-gates";
import {Bit} from "../../math/truth-table";

/**
 * Adds two integer numbers using the Drapper algorithm.
 */
export function executeAddAlgorithm(valueA: number, valueB: number): number {
    return executeAddOrSubAlgorithm(valueA, valueB, "add");
}

/**
 * Subtracts integer number b from integer number a using the Drapper algorithm.
 */
export function executeSubAlgorithm(valueA: number, valueB: number): number {
    let result = executeAddOrSubAlgorithm(valueA, valueB, "sub");
    // The result may be negative
    if (result > valueA) {
        result = -1 * (Math.pow(2, getNumberAsBitArray(result).length) - result);
    }
    return result;
}

function executeAddOrSubAlgorithm(valueA: number, valueB: number, op: "add" | "sub"): number {
    if (!Number.isInteger(valueA) || !Number.isInteger(valueB)) {
        throw new Error("Both numbers have to be integers!");
    }
    if (valueA < 0 || valueB < 0) {
        throw new Error("Both numbers have to be >= 0!");
    }
    let a = getNumberAsBitArray(valueA);
    let b = getNumberAsBitArray(valueB);
    // When are adding two numbers of size n, we need a result bit array of n + 1.
    // (For example: 11 + 10 = 101)
    // Because we write the result to register a, we increase the size of both registers by one.
    const n = Math.max(a.length, b.length) + 1;
    b = getNumberAsBitArrayZeroPadded(valueB, n);
    a = getNumberAsBitArrayZeroPadded(valueA, n);

    // Bit array a and b are of length n now
    const numQubits = 2 * n;
    // console.log(`Num qubits: ${numQubits}`);
    const reg = new QubitRegister(numQubits);

    // Encode a on register
    createEncodeNumberCircuit(reg, a).execute();

    // Encode b on register
    createEncodeNumberCircuit(reg, b, n).execute();

    // Step 1: QFT on bit array a
    createQFTCircuit(reg, n).execute();

    // console.log("Non-Zero Probs after QFT");
    // console.log(reg.nonZeroProbabilities());

    // Step 2: Evolve a by b
    createEvolveCircuit(reg, op).execute();

    // console.log("Non-Zero Probs after Evolve");
    // console.log(reg.nonZeroProbabilities());

    // Step 3: Inverse qft to decode phases back to bits
    createQFTInvertedCircuit(reg, n).execute();

    // console.log("Non-Zero Probs after Evolve");
    // console.log(reg.nonZeroProbabilities());

    // Read a
    const resultAsBitArray = new Array<Bit>(n);
    for (let i = 0; i < n; i++) {
        resultAsBitArray[i] = reg.measureSingleQubit(i);
    }
    // console.log("Result " + resultAsNumber);
    return getBitArrayAsNumber(resultAsBitArray);
}

function createEvolveCircuit(reg: QubitRegister, op: "add" | "sub"): Circuit {
    // console.log("Evolve");
    const n = reg.numQubits / 2;

    let constructionString = '';
    const circuit = new Circuit();
    for (let targetQubit = 0; targetQubit < n; targetQubit++) {
        for (let controlQubit = n + targetQubit; controlQubit < 2 * n; controlQubit++) {
            const angleDegrees = (op === "add" ? 1 : -1) * 180 / Math.pow(2, controlQubit - targetQubit - n);
            circuit.addGate(() => cphase(reg, controlQubit, targetQubit, angleDegrees));
            constructionString += `CPhase(${controlQubit}, ${targetQubit}, ${angleDegrees}) `;

        }
    }
    // console.log(constructionString);
    return circuit;
}




