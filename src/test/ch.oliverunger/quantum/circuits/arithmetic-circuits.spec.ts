import {QubitRegister} from '../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register';
import {_0, _1} from '../../../../main/ch.oliverunger/math/complex';
import {expComplexArraysToBeCloseTo} from '../../test-util';
import {
    createDecrementCircuit,
    createIncrementCircuit,
    fullAdder
} from '../../../../main/ch.oliverunger/quantum/circuits/arithmetic-circuits';
import {bit} from "../../../../main/ch.oliverunger/math/truth-table";
import {Qubit} from "../../../../main/ch.oliverunger/quantum/single-qubit/qubit";
import {STATE_ONE, STATE_ZERO} from "../../../../main/ch.oliverunger/quantum/single-qubit/qubit-state";

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

describe('Full Adder', () => {

    function applyTest(aValue: bit, bValue: bit, cInValue: bit, expCOutValue: bit, expSumValue: bit) {
        const aQubit = aValue === 0 ? Qubit.ofState(STATE_ZERO) : Qubit.ofState(STATE_ONE);
        const bQubit = bValue === 0 ? Qubit.ofState(STATE_ZERO) : Qubit.ofState(STATE_ONE);
        const cInQubit = cInValue === 0 ? Qubit.ofState(STATE_ZERO) : Qubit.ofState(STATE_ONE);
        const reg = QubitRegister.ofQubits(aQubit, bQubit, cInQubit, Qubit.ofState(STATE_ZERO), Qubit.ofState(STATE_ZERO));
        const fullAdderCircuit = fullAdder(reg, 0, 1, 2, 3, 4);
        fullAdderCircuit.execute();
        const sum = reg.measureSingleQubit(3);
        const cOut = reg.measureSingleQubit(4);
        expect(sum).toEqual(expSumValue);
        expect(cOut).toEqual(expCOutValue);
    }

    test('Test cases', () => {
        applyTest(0, 0, 0, 0, 0);
        applyTest(0, 0, 1, 0, 1);
        applyTest(0, 1, 0, 0, 1);
        applyTest(0, 1, 1, 1, 0);
        applyTest(1, 0, 0, 0, 1);
        applyTest(1, 0, 1, 1, 0);
        applyTest(1, 1, 0, 1, 0);
        applyTest(1, 1, 1, 1, 1);
    });

});