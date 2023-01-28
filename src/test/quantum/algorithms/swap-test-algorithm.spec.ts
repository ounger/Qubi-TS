/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {
    QubitState,
    STATE_MINUS,
    STATE_ONE,
    STATE_PLUS,
    STATE_ZERO
} from "../../../lib/quantum/single-qubit/qubit-state";
import {Qubit} from "../../../lib/quantum/single-qubit/qubit";
import {executeSwapTestAlgorithm} from "../../../lib/quantum/algorithms/swap-test-algorithm";

describe('Swap test', () => {

    function applyTest(firstQubitState: QubitState, secondQubitState: QubitState, target: "similar" | "different") {
        const firstQubit = Qubit.ofState(firstQubitState);
        const secondQubit = Qubit.ofState(secondQubitState);
        const resultValue = executeSwapTestAlgorithm(firstQubit, secondQubit);

        // Interpret the result
        const targetValue = target === "similar" ? 1 : 0.5;
        const tolerance = 0.05;
        expect(Math.abs(targetValue - resultValue) <= tolerance).toBeTruthy();
    }

    test('Compare ket(0) with ket(1) -> different', () => {
        applyTest(STATE_ZERO, STATE_ONE, "different");
    });

    test('Compare ket(1) with ket(0) -> different', () => {
        applyTest(STATE_ONE, STATE_ZERO, "different");
    });

    test('Compare ket(0) with ket(0) -> similar', () => {
        applyTest(STATE_ZERO, STATE_ZERO, "similar");
    });

    test('Compare ket(1) with ket(1) -> similar', () => {
        applyTest(STATE_ONE, STATE_ONE, "similar");
    });

    test('Compare ket(+) with ket(+) -> similar', () => {
        applyTest(STATE_PLUS, STATE_PLUS, "similar");
    });

    test('Compare ket(-) with ket(-) -> similar', () => {
        applyTest(STATE_MINUS, STATE_MINUS, "similar");
    });

    test('Compare ket(+) with ket(-) -> different', () => {
        applyTest(STATE_PLUS, STATE_MINUS, "different");
    });

    test('Compare ket(-) with ket(+) -> different', () => {
        applyTest(STATE_MINUS, STATE_PLUS, "different");
    });

});