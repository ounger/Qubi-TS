import {
    executeBernsteinVaziraniAlgorithm
} from "../../../../../main/ch.oliverunger/logic/circuits/algorithms/bernstein-vazirani-algorithm";
import {QubitRegister} from "../../../../../main/ch.oliverunger/model/qubit-register";
import {
    createBernsteinVaziraniOracle
} from "../../../../../main/ch.oliverunger/logic/circuits/oracles/bernstein-vazirani-oriacle";
import {randomIntFromInterval} from "../../../../../main/ch.oliverunger/util";
import {getNumberAsBitArray} from "../../../../../main/ch.oliverunger/logic/math/math-util";

describe('Execute Bernstein-Vazirani Algorithm', () => {

    test('A test', () => {
        const reg = new QubitRegister(2);
        const rnd = randomIntFromInterval(0, Math.pow(2, reg.numQubits - 1));
        const s = getNumberAsBitArray(rnd, reg.numQubits - 1);
        const bvOracle = createBernsteinVaziraniOracle(reg, s);
        const result = executeBernsteinVaziraniAlgorithm(reg, bvOracle);
        expect(result).toEqual(s);
    });

});