/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {executeEntanglementSwappingAlgorithm} from "../../../lib/quantum/algorithms/entanglement-swapping-algorithm";

describe("Entanglement Swapping", () => {

    test("Test", () => {
        for (let i = 0; i < 10; i++) {
            const bits = executeEntanglementSwappingAlgorithm();
            expect(bits[0]).toEqual(bits[3]);
        }
    });

});