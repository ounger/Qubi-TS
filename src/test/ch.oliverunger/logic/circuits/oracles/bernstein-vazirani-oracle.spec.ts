import {bit} from "../../../../../main/ch.oliverunger/logic/math/truth-table";
import {
    createBernsteinVaziraniOracle
} from "../../../../../main/ch.oliverunger/logic/circuits/oracles/bernstein-vazirani-oriacle";
import {QubitRegister} from "../../../../../main/ch.oliverunger/model/qubit-register";
import {QUBIT_STATE_ONE, QUBIT_STATE_ZERO} from "../../../../../main/ch.oliverunger/model/qubit";

describe('Create Bernstein-Vazirani Oracle', () => {

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 3 qubits', () => {
        const s: bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 3 qubits', () => {
        const s: bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 3 qubits', () => {
        const s: bit[] = [1, 0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

});