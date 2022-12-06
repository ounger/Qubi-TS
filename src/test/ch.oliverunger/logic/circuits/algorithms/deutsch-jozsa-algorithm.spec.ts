import {
    executeDeutschJozsaAlgorithm
} from "../../../../../main/ch.oliverunger/logic/circuits/algorithms/deutsch-jozsa-algorithm";
import {QubitRegister} from "../../../../../main/ch.oliverunger/model/qubit-register";
import {
    createBalancedDeutschJozsaOracle,
    createConstantDeutschJozsaOracle
} from "../../../../../main/ch.oliverunger/logic/circuits/oracles/deutsch-jozsa-oracles";
import {bit} from "../../../../../main/ch.oliverunger/logic/math/truth-table";

describe('Deutsch-Jozsa Algorithm', () => {

    test('DJ for constant oracle', () => {
        const reg = new QubitRegister(4);
        const djConstantOracle = createConstantDeutschJozsaOracle(reg);
        const result: bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeTruthy();
    });

    test('DJ for balanced oracle', () => {
        const reg = new QubitRegister(4);
        const djConstantOracle = createBalancedDeutschJozsaOracle(reg);
        const result: bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeFalsy();
    });

});