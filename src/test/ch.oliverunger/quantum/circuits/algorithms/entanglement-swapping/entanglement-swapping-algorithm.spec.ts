import {
    executeEntanglementSwappingAlgorithm
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/entanglement-swapping/entanglement-swapping-algorithm";

describe("Entanglement Swapping", () => {

    test("Test", () => {
        for (let i = 0; i < 10; i++) {
            const bits = executeEntanglementSwappingAlgorithm();
            expect(bits[0]).toEqual(bits[3]);
        }
    });

});