import {executeAddAlgorithm} from "../../../../main/ch.oliverunger/quantum/algorithms/arithmetic-algorithms";

describe('Add two bits', () => {

    test("0 + 0 = 0", () => {
        expect(executeAddAlgorithm(0, 0)).toEqual(0);
    });

    test("0 + 1 = 1", () => {
        expect(executeAddAlgorithm(0, 1)).toEqual(1);
    });

    test("1 + 0 = 1", () => {
        expect(executeAddAlgorithm(1, 0)).toEqual(1);
    });

    test("1 + 1 = 2", () => {
        expect(executeAddAlgorithm(1, 1)).toEqual(2);
    });

});

describe('Add four bits', () => {

    test("2 + 1 = 3", () => {
        expect(executeAddAlgorithm(2, 1)).toEqual(3);
    });

    test("2 + 2 = 4", () => {
        // TODO
    });

});

describe("Add six bits", () => {

    test("1 + 6 = 7", () => {
        expect(executeAddAlgorithm(1, 6)).toEqual(7);
    });

    test("5 + 1 = 6", () => {
        expect(executeAddAlgorithm(5, 1)).toEqual(6);
    });

});