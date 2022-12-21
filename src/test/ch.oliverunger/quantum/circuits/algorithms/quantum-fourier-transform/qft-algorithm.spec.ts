import {expStatesToBeCloseTo} from "../../../../test-util";
import {getNumberAsBitArray} from "../../../../../../main/ch.oliverunger/util";
import {
    createQFTCircuit,
    createQFTInverseCircuit
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/quantum-fourier-transform/qft-algorithm";
import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {STATE_MINUS, STATE_PLUS, STATE_R} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit-state";
import {Qubit} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit";
import {bit} from "../../../../../../main/ch.oliverunger/math/truth-table";

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

describe('QFT - QFT-Inverse', () => {

    function applyTest(numQubits: number, numberEncodedAsBitArray: bit[]) {
        const reg = new QubitRegister(numQubits);
        const qftCircuit = createQFTCircuit(reg, numberEncodedAsBitArray);
        const qftInvCircuit = createQFTInverseCircuit(reg, numberEncodedAsBitArray);

        qftCircuit.execute();
        qftInvCircuit.execute();
        expStatesToBeCloseTo(reg.states, new QubitRegister(numQubits).states);
    }

    test('Test cases', () => {
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
            const numAsBitArray = getNumberAsBitArray(num, 4);
            applyTest(4, numAsBitArray);
        }

    })

});