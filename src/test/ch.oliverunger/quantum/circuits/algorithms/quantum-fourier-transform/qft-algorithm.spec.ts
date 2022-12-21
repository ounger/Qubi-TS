import {expStatesToBeCloseTo} from "../../../../test-util";
import {getNumberAsBitArray} from "../../../../../../main/ch.oliverunger/util";
import {
    createQFTCircuit
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/quantum-fourier-transform/qft-algorithm";
import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {STATE_MINUS, STATE_PLUS, STATE_R} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit-state";
import {Qubit} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit";

describe('Create QFTs', () => {

    test("1 qubit", () => {
        const reg = new QubitRegister(1);
        const qftCircuit = createQFTCircuit(reg, getNumberAsBitArray(0, 1));
        qftCircuit.execute();

        expStatesToBeCloseTo(reg.states, STATE_PLUS);
    });

    /**
     * From {@link https://qiskit.org/textbook/ch-algorithms/quantum-fourier-transform.html#8.2-General-QFT-Function-}
     */
    test('3 qubits', () => {
        const reg = new QubitRegister(3);
        const qftCircuit = createQFTCircuit(reg, getNumberAsBitArray(5, 3));
        qftCircuit.execute();

        const expQubit0 = Qubit.ofState(STATE_MINUS);
        const expQubit1 = Qubit.ofState(STATE_R);
        const expQubit2 = Qubit.ofState(STATE_MINUS);
        expQubit2.rot1(45);
        const expReg = QubitRegister.ofQubits(expQubit0, expQubit1, expQubit2);

        console.log("Actual " + reg.states);
        console.log("Exp " + expReg.states);
        expStatesToBeCloseTo(reg.states, expReg.states);
    });

    // TODO More Tests

});