/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {
    QubitState,
    STATE_L,
    STATE_MINUS,
    STATE_ONE,
    STATE_PLUS,
    STATE_R,
    STATE_ZERO
} from "../../../lib/quantum/single-qubit/qubit-state";
import {executeQuantumTeleportationAlgorithm} from "../../../lib/quantum/algorithms/quantum-teleportation-algorithm";
import {expComplexArraysToBeCloseTo} from "../../test-util";

describe("Quantum Teleportation", () => {

    function applyTest(message: QubitState) {
        const result = executeQuantumTeleportationAlgorithm(message);
        expComplexArraysToBeCloseTo(result, message);
    }

    test("Test Cases", () => {
        applyTest(STATE_ZERO);
        applyTest(STATE_ONE);
        applyTest(STATE_PLUS);
        applyTest(STATE_MINUS);
        applyTest(STATE_R);
        applyTest(STATE_L);
    });

});