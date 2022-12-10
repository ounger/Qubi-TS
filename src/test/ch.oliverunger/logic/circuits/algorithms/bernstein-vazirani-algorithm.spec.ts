import {
    executeBernsteinVaziraniAlgorithm
} from "../../../../../main/ch.oliverunger/logic/circuits/algorithms/bernstein-vazirani-algorithm";
import {QubitRegister} from "../../../../../main/ch.oliverunger/model/qubit-register";
import {
    createBernsteinVaziraniOracle
} from "../../../../../main/ch.oliverunger/logic/circuits/oracles/bernstein-vazirani-oracle";
import {getNumberAsBitArray, randomIntFromInterval} from "../../../../../main/ch.oliverunger/util";

describe('Execute Bernstein-Vazirani Algorithm', () => {

    function getRandomBitArray(length: number) {
        const rnd = randomIntFromInterval(0, Math.pow(2, length));
        return getNumberAsBitArray(rnd, length);
    }

    function applyTest(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const s = getRandomBitArray(numQubits - 1);
        const bvOracle = createBernsteinVaziraniOracle(reg, s);
        const result = executeBernsteinVaziraniAlgorithm(reg, bvOracle);
        expect(result).toEqual(s);
    }

    test('2 qubits', () => {
        applyTest(2)
    });

    test('3 qubits', () => {
        applyTest(3);
    });

    test('4 qubits', () => {
        applyTest(4);
    });

});