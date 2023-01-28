/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from '../../../../lib/quantum/multi-qubit/qubit-register';
import {Bit} from '../../../../lib/math/truth-table';
import {Qubit} from '../../../../lib/quantum/single-qubit/qubit';
import {_0, _1, Complex} from '../../../../lib/math/complex';
import {STATE_ONE, STATE_ZERO} from '../../../../lib/quantum/single-qubit/qubit-state';
import {createSimonsOracle} from '../../../../lib/quantum/algorithms/simons/simons-oracles';
import {expComplexArraysToBeCloseTo} from '../../../test-util';

describe('createOneToOneSimonsOracle with 2 input qubits', () => {

    function applyTest(firstInputQubit: Qubit, secondInputQubit: Qubit, expStates: Complex[]) {
        const firstOutputQubit = Qubit.ofState(STATE_ZERO);
        const secondOutputQubit = Qubit.ofState(STATE_ZERO);
        const reg = QubitRegister.ofQubits(firstInputQubit, secondInputQubit, firstOutputQubit, secondOutputQubit);
        const oracle = createSimonsOracle(reg, [0, 0]);
        oracle.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), expStates);
    }

    test('Test Cases for 2 qubits', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), createStateArray(4, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), createStateArray(4, 5));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), createStateArray(4, 10));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), createStateArray(4, 15));
    });

});

describe('createOneToOneSimonsOracle with 3 input qubits', () => {

    function applyTest(firstInputQubit: Qubit, secondInputQubit: Qubit, thirdInputQubit: Qubit, expStates: Complex[]) {
        const firstOutputQubit = Qubit.ofState(STATE_ZERO);
        const secondOutputQubit = Qubit.ofState(STATE_ZERO);
        const thridOutputQubit = Qubit.ofState(STATE_ZERO);
        const reg = QubitRegister.ofQubits(firstInputQubit, secondInputQubit, thirdInputQubit, firstOutputQubit, secondOutputQubit, thridOutputQubit);
        const oracle = createSimonsOracle(reg, [0, 0, 0]);
        oracle.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), expStates);
    }

    test('Test Cases for 3 qubits', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), createStateArray(6, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), createStateArray(6, 9));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), createStateArray(6, 18));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), createStateArray(6, 27));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), createStateArray(6, 36));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), createStateArray(6, 45));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), createStateArray(6, 54));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), createStateArray(6, 63));
    });

});

describe('createTwoToOneSimonsOracle with 2 input qubits', () => {

    function applyTest(firstInputQubit: Qubit, secondInputQubit: Qubit, secret: Bit[], expStates: Complex[]) {
        const firstOutputQubit = Qubit.ofState(STATE_ZERO);
        const secondOutputQubit = Qubit.ofState(STATE_ZERO);
        const reg = QubitRegister.ofQubits(firstInputQubit, secondInputQubit, firstOutputQubit, secondOutputQubit);
        const oracle = createSimonsOracle(reg, secret);
        oracle.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), expStates);
    }

    test('Secret 10', () => {
        // With input qubits ket(00) after applying the oracle we get output qubits in ket(00).
        // So the full state is afterwards ket(0000) => State 0
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 0], createStateArray(4, 0));
        // With input qubits ket(01) after applying the oracle we get output qubits in ket(01).
        // So the full state is afterwards ket(0101) => State 5
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 0], createStateArray(4, 5));
        // With input qubits ket(10) after applying the oracle we get output qubits in ket(00).
        // So the full state is afterwards ket(1000) => State 8
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 0], createStateArray(4, 8));
        // With input qubits ket(11) after applying the oracle we get output qubits in ket(01).
        // So the full state is afterwards ket(1101) => State 13
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 0], createStateArray(4, 13));
    });

    test('Secret 01', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [0, 1], createStateArray(4, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [0, 1], createStateArray(4, 4));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [0, 1], createStateArray(4, 10));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [0, 1], createStateArray(4, 14));
    });

    test('Secret 11', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 1], createStateArray(4, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 1], createStateArray(4, 5));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 1], createStateArray(4, 9));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 1], createStateArray(4, 12));
    });

});

describe('createSimonTwoToOneOracle with 3 input qubits', () => {

    function applyTest(firstInputQubit: Qubit, secondInputQubit: Qubit, thirdInputQubit: Qubit, secret: Bit[], expStates: Complex[]) {
        const firstOutputQubit = Qubit.ofState(STATE_ZERO);
        const secondOutputQubit = Qubit.ofState(STATE_ZERO);
        const thirdOutputQubit = Qubit.ofState(STATE_ZERO);
        const reg = QubitRegister.ofQubits(
            firstInputQubit, secondInputQubit, thirdInputQubit,
            firstOutputQubit, secondOutputQubit, thirdOutputQubit
        );
        const oracle = createSimonsOracle(reg, secret);
        oracle.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), expStates);
    }

    test('Secret 100', () => {
        // With input qubits ket(000) after applying the oracle we get output qubits in ket(000).
        // So the full state is afterwards ket(000000) => State 0
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 0, 0], createStateArray(6, 0));
        // With input qubits ket(001) after applying the oracle we get output qubits in ket(001).
        // So the full state is afterwards ket(001001) => State 9
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 0, 0], createStateArray(6, 9));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 0, 0], createStateArray(6, 18));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 0, 0], createStateArray(6, 27));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 0, 0], createStateArray(6, 32));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 0, 0], createStateArray(6, 41));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 0, 0], createStateArray(6, 50));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 0, 0], createStateArray(6, 59));
    });

    test('Secret 010', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [0, 1, 0], createStateArray(6, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [0, 1, 0], createStateArray(6, 9));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [0, 1, 0], createStateArray(6, 16));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [0, 1, 0], createStateArray(6, 25));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [0, 1, 0], createStateArray(6, 36));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [0, 1, 0], createStateArray(6, 45));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [0, 1, 0], createStateArray(6, 52));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [0, 1, 0], createStateArray(6, 61));
    });

    test('Secret 011', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [0, 1, 1], createStateArray(6, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [0, 1, 1], createStateArray(6, 9));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [0, 1, 1], createStateArray(6, 17));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [0, 1, 1], createStateArray(6, 24));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [0, 1, 1], createStateArray(6, 36));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [0, 1, 1], createStateArray(6, 45));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [0, 1, 1], createStateArray(6, 53));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [0, 1, 1], createStateArray(6, 60));
    });

    test('Secret 111', () => {
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 1, 1], createStateArray(6, 0));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 1, 1], createStateArray(6, 9));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 1, 1], createStateArray(6, 18));
        applyTest(Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 1, 1], createStateArray(6, 27));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO), [1, 1, 1], createStateArray(6, 35));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ONE), [1, 1, 1], createStateArray(6, 42));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ZERO), [1, 1, 1], createStateArray(6, 49));
        applyTest(Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), Qubit.ofState(STATE_ONE), [1, 1, 1], createStateArray(6, 56));
    });

});

function createStateArray(numQubits: number, state: number): Complex[] {
    const result = new Array<Complex>(Math.pow(2, numQubits)).fill(_0);
    result[state] = _1;
    return result;
}







