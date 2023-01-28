/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {
    executeBernsteinVaziraniAlgorithm
} from '../../../../lib/quantum/algorithms/bernstein-vazirani/bernstein-vazirani-algorithm';
import {QubitRegister} from '../../../../lib/quantum/multi-qubit/qubit-register';
import {
    createBernsteinVaziraniOracle
} from '../../../../lib/quantum/algorithms/bernstein-vazirani/bernstein-vazirani-oracle';
import {getNumberAsBitArrayZeroPadded, randomIntFromInterval} from '../../../../lib/util';

describe('Execute Bernstein-Vazirani Algorithm', () => {

    function getRandomBitArray(length: number) {
        const rnd = randomIntFromInterval(0, Math.pow(2, length));
        return getNumberAsBitArrayZeroPadded(rnd, length);
    }

    function applyTest(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const s = getRandomBitArray(numQubits - 1);
        const bvOracle = createBernsteinVaziraniOracle(reg, s);
        const result = executeBernsteinVaziraniAlgorithm(reg, bvOracle);
        expect(result).toEqual(s);
    }

    test('2 qubits', () => {
        applyTest(2)
    });

    test('3 qubits', () => {
        applyTest(3);
    });

    test('4 qubits', () => {
        applyTest(4);
    });

});