/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {executeSuperdenseCodingAlgorithm} from "../../../lib/quantum/algorithms/superdense-coding-algorithm";

describe("Superdense Coding", () => {

    test('Classical bits 00', () => {
        expect(executeSuperdenseCodingAlgorithm([0, 0])).toEqual([0, 0]);
    });

    test('Classical bits 01', () => {
        expect(executeSuperdenseCodingAlgorithm([0, 1])).toEqual([0, 1]);
    });

    test('Classical bits 10', () => {
        expect(executeSuperdenseCodingAlgorithm([1, 0])).toEqual([1, 0]);
    });

    test('Classical bits 11', () => {
        expect(executeSuperdenseCodingAlgorithm([1, 1])).toEqual([1, 1]);
    });

});