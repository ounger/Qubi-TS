import {QubitRegister} from '../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register';
import {_0, _1} from '../../../../main/ch.oliverunger/math/complex';
import {expComplexArraysToBeCloseTo} from '../../test-util';
import {createDecrementCircuit, createIncrementCircuit} from '../../../../main/ch.oliverunger/quantum/circuits/arithmetic-circuits';

describe('Increment', () => {

    test('1 qubit: ket(0) -> ket(1)', () => {
        const reg = new QubitRegister(1);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _1]);
    });

    test('1 qubit: ket(1) -> ket(0)', () => {
        const reg = QubitRegister.ofStates([_0, _1]);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0]);
    });

    test('2 qubits: ket(00) -> ket(01)', () => {
        const reg = new QubitRegister(2);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _1, _0, _0]);
    });

    test('2 qubits: ket(01) -> ket(10)', () => {
        const reg = QubitRegister.ofStates([_0, _1, _0, _0]);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _1, _0]);
    });

    test('2 qubits: ket(10) -> ket(11)', () => {
        const reg = QubitRegister.ofStates([_0, _0, _1, _0]);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _0, _1]);
    });

    test('2 qubits: ket(11) -> ket(00)', () => {
        const reg = QubitRegister.ofStates([_0, _0, _0, _1]);
        const circuit = createIncrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0, _0, _0]);
    });

});

describe('Decrement', () => {

    test('1 qubit: ket(0) -> ket(1)', () => {
        const reg = new QubitRegister(1);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _1]);
    });

    test('1 qubit: ket(1) -> ket(0)', () => {
        const reg = QubitRegister.ofStates([_0, _1]);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0]);
    });

    test('2 qubits: ket(00) -> ket(11)', () => {
        const reg = new QubitRegister(2);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _0, _1]);
    });

    test('2 qubits: ket(01) -> ket(00)', () => {
        const reg = QubitRegister.ofStates([_0, _1, _0, _0]);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_1, _0, _0, _0]);
    });

    test('2 qubits: ket(10) -> ket(01)', () => {
        const reg = QubitRegister.ofStates([_0, _0, _1, _0]);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _1, _0, _0]);
    });

    test('2 qubits: ket(11) -> ket(10)', () => {
        const reg = QubitRegister.ofStates([_0, _0, _0, _1]);
        const circuit = createDecrementCircuit(reg);
        circuit.execute();
        expComplexArraysToBeCloseTo(reg.getStates(), [_0, _0, _1, _0]);
    });

});

describe('Add', () => {
    test('', () => {
        // TODO
    });
});

describe('Sub', () => {
    test('', () => {
        // TODO
    });
});