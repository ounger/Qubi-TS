/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Bit} from "../../../../lib/math/truth-table";
import {
    createBernsteinVaziraniOracle
} from "../../../../lib/quantum/algorithms/bernstein-vazirani/bernstein-vazirani-oracle";
import {QubitRegister} from "../../../../lib/quantum/multi-qubit/qubit-register";
import {QUBIT_STATE_ONE, QUBIT_STATE_ZERO} from "../../../../lib/quantum/single-qubit/qubit";

describe('Create Bernstein-Vazirani Oracle', () => {

    test('Create oracle for 2 qubits. Input qubit in ket(0) and secret 0', () => {
        const s: Bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits. Input qubit in ket(1) and secret 0', () => {
        const s: Bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits. Input qubit in ket(0) and secret 1', () => {
        const s: Bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits. Input qubit in in ket(1) and secret 1', () => {
        const s: Bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 3 qubits. Input qubits in ket(11) and secret 11', () => {
        const s: Bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(2);
        expect(output).toEqual(0);
    });

    test('Create oracle for 3 qubits. Input qubits in ket(10) and secret 11', () => {
        const s: Bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(2);
        expect(output).toEqual(1);
    });

    test('Create oracle for 3 qubits. Input qubits in ket(11) and secret 10', () => {
        const s: Bit[] = [1, 0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(2);
        expect(output).toEqual(1);
    });

});