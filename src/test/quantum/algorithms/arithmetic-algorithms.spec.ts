/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {executeAddAlgorithm, executeSubAlgorithm} from "../../../lib/quantum/algorithms/arithmetic-algorithms";

describe("Add two integers", () => {

    test("Test cases", () => {
        for (let a = 0; a < 10; a++) {
            for (let b = 0; b < 10; b++) {
                expect(executeAddAlgorithm(a, b)).toEqual(a + b);
            }
        }
    });

    // Heavyweight test under some devices
    // test("2096 + 1004 = 3100", () => {
    //     expect(executeAddAlgorithm(4096, 5004)).toEqual(9100);
    // });

});

describe("Sub two integers", () => {

    test("5 - 3 = 2", () => {
        expect(executeSubAlgorithm(5, 3)).toEqual(2);
    });

    test("2 - 1 = 1", () => {
        expect(executeSubAlgorithm(2, 1)).toEqual(1);
    });

    test("1 - 2 = -1", () => {
        expect(executeSubAlgorithm(1, 2)).toEqual(-1);
    });

    test("1 - 3 = -2", () => {
        expect(executeSubAlgorithm(1, 3)).toEqual(-2);
    });

    test("3 - 5 = -2", () => {
        expect(executeSubAlgorithm(3, 5)).toEqual(-2);
    });

    test("16 - 24 = -8", () => {
        expect(executeSubAlgorithm(16, 24)).toEqual(-8);
    });

    test("0 - 0 = 0", () => {
        expect(executeSubAlgorithm(0, 0)).toEqual(0);
    });

    test("1 - 1 = 0", () => {
        expect(executeSubAlgorithm(1, 1)).toEqual(0);
    });

    test("11 - 11 = 0", () => {
        expect(executeSubAlgorithm(11, 11)).toEqual(0);
    });

    // Heavyweight test under some devices
    // test("8044 - 4022 = 4022", () => {
    //     expect(executeSubAlgorithm(8044, 4022)).toEqual(4022);
    // });

});