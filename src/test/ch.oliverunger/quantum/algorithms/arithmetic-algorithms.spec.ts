import {
    executeAddAlgorithm,
    executeSubAlgorithm
} from "../../../../main/ch.oliverunger/quantum/algorithms/arithmetic-algorithms";

describe("Add two integers", () => {

    test("Test cases", () => {
        for (let a = 0; a < 10; a++) {
            for (let b = 0; b < 10; b++) {
                expect(executeAddAlgorithm(a, b)).toEqual(a + b);
            }
        }
    });

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

});