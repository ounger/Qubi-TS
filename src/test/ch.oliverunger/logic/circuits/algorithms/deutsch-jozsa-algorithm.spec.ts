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

    function applyTestConstant(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const djConstantOracle = createConstantDeutschJozsaOracle(reg);
        const result: bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeTruthy();
    }

    function applyTestBalanced(numQubits: number) {
        const reg = new QubitRegister(numQubits);
        const djConstantOracle = createBalancedDeutschJozsaOracle(reg);
        const result: bit[] = executeDeutschJozsaAlgorithm(reg, djConstantOracle);
        expect(result.every(rb => rb === 0)).toBeFalsy();
    }

    test('DJ for constant oracle on 2 Qubits', () => {
        applyTestConstant(2);
    });

    test('DJ for balanced oracle on 2 Qubits', () => {
        applyTestBalanced(2);
    });

    test('DJ for constant oracle on 3 Qubits', () => {
        applyTestConstant(3);
    });

    test('DJ for balanced oracle on 3 Qubits', () => {
        applyTestBalanced(3);
    });

    test('DJ for constant oracle on 4 Qubits', () => {
        applyTestConstant(4);
    });

    test('DJ for balanced oracle on 4 Qubits', () => {
        applyTestBalanced(4);
    });

});