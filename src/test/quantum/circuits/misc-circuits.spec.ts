/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from "../../../lib/quantum/multi-qubit/qubit-register";
import {
    createEncodeNumberCircuit,
    createSwapQubitsInsideOutCircuit,
    createSwapQubitsOutsideInCircuit
} from "../../../lib/quantum/circuits/misc-circuits";
import {getNumberAsBitArray} from "../../../lib/util";
import {
    QUBIT_STATE_L,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_R,
    QUBIT_STATE_ZERO
} from "../../../lib/quantum/single-qubit/qubit";
import {expComplexArraysToBeCloseTo} from "../../test-util";

describe("createEncodeNumberCircuit", () => {

    test("Success", () => {
        const reg = new QubitRegister(3);
        const sixAsBitArray = getNumberAsBitArray(6);
        createEncodeNumberCircuit(reg, sixAsBitArray).execute();
        expect(reg.measure()).toEqual(6);
    });

    test("Success with offset", () => {
        const reg = new QubitRegister(4);
        const sixAsBitArray = getNumberAsBitArray(6);
        const offset = 1;
        createEncodeNumberCircuit(reg, sixAsBitArray, offset).execute();
        expect(reg.measure()).toEqual(6);
    });

    test("Fail - Register too small", () => {
        const reg = new QubitRegister(3);
        const eightAsBitArray = getNumberAsBitArray(8);
        expect(() => createEncodeNumberCircuit(reg, eightAsBitArray)).toThrowError();
    });

    test("Fail - Register too small because of offset", () => {
        const reg = new QubitRegister(3);
        const eightAsBitArray = getNumberAsBitArray(6);
        const offset = 1;
        expect(() => createEncodeNumberCircuit(reg, eightAsBitArray, offset)).toThrowError();
    });

});

describe("createSwapQubitsOutsideInCircuit", () => {

    test("Single qubit swap", () => {
        const reg = new QubitRegister(1);
        createSwapQubitsOutsideInCircuit(reg, 1, 0).execute();
        expect(reg.measure()).toEqual(0);
    });

    test("Single qubit swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        createSwapQubitsOutsideInCircuit(swapReg, 1, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        expect(swapReg.getStates()).toEqual(expReg.getStates());
    });

    test("Two qubits swap", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        createSwapQubitsOutsideInCircuit(swapReg, 2, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Two qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsOutsideInCircuit(swapReg, 2, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Two qubits swap with offset 2", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsOutsideInCircuit(swapReg, 2, 2).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsOutsideInCircuit(swapReg, 3, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsOutsideInCircuit(swapReg, 3, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits swap with offset 2", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsOutsideInCircuit(swapReg, 3, 2).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Four qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsOutsideInCircuit(swapReg, 4, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Four qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsOutsideInCircuit(swapReg, 4, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_MINUS);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Five qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R, QUBIT_STATE_MINUS);
        createSwapQubitsOutsideInCircuit(swapReg, 5, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Six qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R, QUBIT_STATE_MINUS, QUBIT_STATE_L);
        createSwapQubitsOutsideInCircuit(swapReg, 6, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_L, QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

});

describe("createSwapQubitsInsideOutCircuit", () => {

    test("Single qubit swap", () => {
        const reg = new QubitRegister(1);
        createSwapQubitsInsideOutCircuit(reg, 1, 0).execute();
        expect(reg.measure()).toEqual(0);
    });

    test("Single qubit swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        createSwapQubitsInsideOutCircuit(swapReg, 1, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        expect(swapReg.getStates()).toEqual(expReg.getStates());
    });

    test("Two qubits swap", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        createSwapQubitsInsideOutCircuit(swapReg, 2, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Two qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsInsideOutCircuit(swapReg, 2, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Two qubits swap with offset 2", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsInsideOutCircuit(swapReg, 2, 2).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS);
        createSwapQubitsInsideOutCircuit(swapReg, 3, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsInsideOutCircuit(swapReg, 3, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Three qubits swap with offset 2", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsInsideOutCircuit(swapReg, 3, 2).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Four qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsInsideOutCircuit(swapReg, 4, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Four qubits swap with offset 1", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_MINUS, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R);
        createSwapQubitsInsideOutCircuit(swapReg, 4, 1).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_MINUS);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Five qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R, QUBIT_STATE_MINUS);
        createSwapQubitsInsideOutCircuit(swapReg, 5, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

    test("Six qubits", () => {
        const swapReg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_PLUS, QUBIT_STATE_R, QUBIT_STATE_MINUS, QUBIT_STATE_L);
        createSwapQubitsInsideOutCircuit(swapReg, 6, 0).execute();

        const expReg = QubitRegister.ofQubits(QUBIT_STATE_L, QUBIT_STATE_MINUS, QUBIT_STATE_R, QUBIT_STATE_PLUS, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        expComplexArraysToBeCloseTo(swapReg.getStates(), expReg.getStates());
    });

});