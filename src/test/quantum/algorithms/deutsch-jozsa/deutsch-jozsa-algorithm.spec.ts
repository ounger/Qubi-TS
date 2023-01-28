/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {executeDeutschJozsaAlgorithm} from "../../../../lib/quantum/algorithms/deutsch-jozsa/deutsch-jozsa-algorithm";
import {QubitRegister} from "../../../../lib/quantum/multi-qubit/qubit-register";
import {
    createBalancedDeutschJozsaOracle,
    createConstantDeutschJozsaOracle
} from "../../../../lib/quantum/algorithms/deutsch-jozsa/deutsch-jozsa-oracles";
import {Bit} from "../../../../lib/math/truth-table";

describe('Deutsch-Jozsa Algorithm', () => {

    function applyTestConstant(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const djConstantOracle = createConstantDeutschJozsaOracle(reg);
        const result: Bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeTruthy();
    }

    function applyTestBalanced(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const djConstantOracle = createBalancedDeutschJozsaOracle(reg);
        const result: Bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeFalsy();
    }

    test('DJ for constant oracle on 2 Qubits', () => {
        applyTestConstant(2);
    });

    test('DJ for balanced oracle on 2 Qubits', () => {
        applyTestBalanced(2);
    });

    test('DJ for constant oracle on 3 Qubits', () => {
        applyTestConstant(3);
    });

    test('DJ for balanced oracle on 3 Qubits', () => {
        applyTestBalanced(3);
    });

    test('DJ for constant oracle on 4 Qubits', () => {
        applyTestConstant(4);
    });

    test('DJ for balanced oracle on 4 Qubits', () => {
        applyTestBalanced(4);
    });

});