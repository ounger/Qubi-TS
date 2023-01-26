import {executeAddAlgorithm} from "../../../../main/ch.oliverunger/quantum/algorithms/arithmetic-algorithms";

describe("Add two integers", () => {

    test("Test cases", () => {
        for (let a = 0; a < 10; a++) {
            for (let b = 0; b < 10; b++) {
                expect(executeAddAlgorithm(a, b)).toEqual(a + b);
            }
        }
    });

});