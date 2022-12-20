import {
    createQFTCircuit
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/quantum-fourier-transform/qft-algorithm";
import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {getNumberAsBitArray} from "../../../../../../main/ch.oliverunger/util";
import {bit} from "../../../../../../main/ch.oliverunger/math/truth-table";
import {Qubit} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit";
import {STATE_L, STATE_MINUS, STATE_R} from "../../../../../../main/ch.oliverunger/quantum/single-qubit/qubit-state";
import {expStatesToBeCloseTo} from "../../../../test-util";

describe('Create QFTs', () => {

    function applyTest(numQubits: number, encodedNumberAsBitArray: bit[]) {
        const reg = new QubitRegister(3);
        const qftCircuit = createQFTCircuit(reg, encodedNumberAsBitArray);
        qftCircuit.execute();

        const expQubit0 = Qubit.ofState(STATE_L);
        expQubit0.rotZ(45);
        const expQubit1 = Qubit.ofState(STATE_R);
        const expQubit2 = Qubit.ofState(STATE_MINUS);
        const expReg = QubitRegister.ofQubits(expQubit0, expQubit1, expQubit2);

        console.log("Actual " + reg.states);
        console.log("Exp " + expReg.states);
        expStatesToBeCloseTo(reg.states, expReg.states);

    }

    test('Test cases', () => {
        applyTest(3, getNumberAsBitArray(5, 3));
    });

});