/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {expComplexArraysToBeCloseTo} from '../../test-util';
import {getNumberAsBitArray, getNumberAsBitArrayZeroPadded} from '../../../lib/util';
import {createQFTCircuit, createQFTInvertedCircuit} from '../../../lib/quantum/circuits/qft-circuit';
import {QubitRegister} from '../../../lib/quantum/multi-qubit/qubit-register';
import {STATE_MINUS, STATE_PLUS, STATE_R, STATE_ZERO} from '../../../lib/quantum/single-qubit/qubit-state';
import {Qubit, QUBIT_STATE_PLUS, QUBIT_STATE_ZERO} from '../../../lib/quantum/single-qubit/qubit';
import {Bit} from '../../../lib/math/truth-table';
import {createEncodeNumberCircuit} from "../../../lib/quantum/circuits/misc-circuits";

describe('Create QFTs', () => {

    test('1 qubit', () => {
        const reg = new QubitRegister(1);

        createEncodeNumberCircuit(reg, getNumberAsBitArray(0)).execute();
        createQFTCircuit(reg, 1, true).execute();

        expComplexArraysToBeCloseTo(reg.getStates(), STATE_PLUS);
    });

    test('1 qubit with offset 1', () => {
        const offset = 1;
        const reg = new QubitRegister(2);

        createEncodeNumberCircuit(reg, getNumberAsBitArray(0), offset).execute();
        createQFTCircuit(reg, 1, true, offset).execute();

        expComplexArraysToBeCloseTo(reg.getStates(), QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS).getStates());
    });

    /**
     * From {@link https://qiskit.org/textbook/ch-algorithms/quantum-fourier-transform.html#8.2-General-QFT-Function-}
     */
    test('3 qubits', () => {
        const reg = new QubitRegister(3);

        createEncodeNumberCircuit(reg, getNumberAsBitArrayZeroPadded(5, 3)).execute();
        createQFTCircuit(reg, 3, true).execute();

        const expQubit0 = Qubit.ofState(STATE_MINUS);
        const expQubit1 = Qubit.ofState(STATE_R);
        const expQubit2 = Qubit.ofState(STATE_MINUS);
        expQubit2.rot1(45);
        const expReg = QubitRegister.ofQubits(expQubit0, expQubit1, expQubit2);

        expComplexArraysToBeCloseTo(reg.getStates(), expReg.getStates());
    });

    /**
     * From {@link https://qiskit.org/textbook/ch-algorithms/quantum-fourier-transform.html#8.2-General-QFT-Function-}
     */
    test('3 qubits with offset 1 -> actual 4 qubits', () => {
        const offset = 1;
        const reg = new QubitRegister(4);

        createEncodeNumberCircuit(reg, getNumberAsBitArrayZeroPadded(5, 3), offset).execute();
        createQFTCircuit(reg, 3, true, offset).execute();

        const expQubit0 = Qubit.ofState(STATE_ZERO);
        const expQubit1 = Qubit.ofState(STATE_MINUS);
        const expQubit2 = Qubit.ofState(STATE_R);
        const expQubit3 = Qubit.ofState(STATE_MINUS);
        expQubit3.rot1(45);
        const expReg = QubitRegister.ofQubits(expQubit0, expQubit1, expQubit2, expQubit3);

        expComplexArraysToBeCloseTo(reg.getStates(), expReg.getStates());
    });

});

describe('QFT - QFT-Inverse', () => {

    function applyTest(numQubits: number, encodedNumber: Bit[], offset: number = 0) {
        const reg = new QubitRegister(numQubits);

        createEncodeNumberCircuit(reg, encodedNumber, offset).execute();
        createQFTCircuit(reg, encodedNumber.length, true, offset).execute();
        createQFTInvertedCircuit(reg, encodedNumber.length, true, offset).execute();
        createEncodeNumberCircuit(reg, encodedNumber, offset).execute();

        expComplexArraysToBeCloseTo(reg.getStates(), new QubitRegister(numQubits).getStates());
    }

    test('Test cases without offset', () => {
        applyTest(1, [0]);
        applyTest(1, [1]);
        applyTest(2, [0, 0]);
        applyTest(2, [0, 1]);
        applyTest(2, [1, 0]);
        applyTest(2, [1, 1]);
        applyTest(3, [0, 0, 0]);
        applyTest(3, [0, 0, 1]);
        applyTest(3, [0, 1, 0]);
        applyTest(3, [0, 1, 1]);
        applyTest(3, [1, 0, 0]);
        applyTest(3, [1, 0, 1]);
        applyTest(3, [1, 1, 0]);
        applyTest(3, [1, 1, 1]);
        for (let num = 0; num < Math.pow(2, 4); num++) {
            const numAsBitArray = getNumberAsBitArrayZeroPadded(num, 4);
            applyTest(4, numAsBitArray);
        }
    });

    test('Test cases with offset 1', () => {
        applyTest(2, [0], 1);
        applyTest(2, [1], 1);
        applyTest(3, [0, 0], 1);
        applyTest(3, [0, 1], 1);
        applyTest(3, [1, 0], 1);
        applyTest(3, [1, 1], 1);
        applyTest(4, [0, 0, 0], 1);
        applyTest(4, [0, 0, 1], 1);
        applyTest(4, [0, 1, 0], 1);
        applyTest(4, [0, 1, 1], 1);
        applyTest(4, [1, 0, 0], 1);
        applyTest(4, [1, 0, 1], 1);
        applyTest(4, [1, 1, 0], 1);
        applyTest(4, [1, 1, 1], 1);
        for (let num = 0; num < Math.pow(2, 4); num++) {
            const numAsBitArray = getNumberAsBitArrayZeroPadded(num, 4);
            applyTest(5, numAsBitArray, 1);
        }
    });

    test('Read 3-bit encodednumber again', () => {
        const num = 5;
        const encodedNumber = getNumberAsBitArray(num);
        const reg = new QubitRegister(3);

        createEncodeNumberCircuit(reg, encodedNumber).execute();
        createQFTCircuit(reg, reg.numQubits, true).execute();
        createQFTInvertedCircuit(reg, reg.numQubits, true).execute();

        expect(reg.measure()).toEqual(num);
    });

    test('Read 4-bit encodednumber again', () => {
        const num = 13;
        const encodedNumber = getNumberAsBitArray(num);
        const reg = new QubitRegister(4);

        createEncodeNumberCircuit(reg, encodedNumber).execute();
        createQFTCircuit(reg, reg.numQubits, true).execute();
        createQFTInvertedCircuit(reg, reg.numQubits, true).execute();

        expect(reg.measure()).toEqual(num);
    });

});