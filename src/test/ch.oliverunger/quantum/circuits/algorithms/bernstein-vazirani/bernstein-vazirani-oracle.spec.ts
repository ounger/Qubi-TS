import {bit} from "../../../../../../main/ch.oliverunger/math/truth-table";
import {
    createBernsteinVaziraniOracle
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/bernstein-vazirani/bernstein-vazirani-oracle";
import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {QUBIT_STATE_ONE, QUBIT_STATE_ZERO} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit";

describe('Create Bernstein-Vazirani Oracle', () => {

    test('Create oracle for 2 qubits in ket(00) and secret 0', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits in ket(01) and secret 0', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits in ket(10) and secret 0', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits in ket(11) and secret 0', () => {
        const s: bit[] = [0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits in ket(00) and secret 1', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits in ket(01) and secret 1', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 2 qubits in ket(10) and secret 1', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 2 qubits in ket(11) and secret 1', () => {
        const s: bit[] = [1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 3 qubits in ket(111) and secret 11', () => {
        const s: bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(1);
    });

    test('Create oracle for 3 qubits in ket(101) and secret 11', () => {
        const s: bit[] = [1, 1];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

    test('Create oracle for 3 qubits in ket(111) and secret 10', () => {
        const s: bit[] = [1, 0];
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        const oracle = createBernsteinVaziraniOracle(reg, s);
        oracle.execute();
        const output = reg.measureSingleQubit(1);
        expect(output).toEqual(0);
    });

});