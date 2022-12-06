import {QubitRegister} from "../../../main/ch.oliverunger/model/qubit-register";
import {QUBIT_STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit";
import {hadSingle} from "../../../main/ch.oliverunger/logic/gates/multi-qubit-gates";
import {expStatesToBeCloseTo} from "../util/test-util";
import {STATE_PLUS, STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit-state";

describe('Create a step on a single qubit register and execute it', () => {

    test('hadSingle', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        hadSingle(reg, 0);
        expStatesToBeCloseTo(reg.states, STATE_PLUS);
    });

    test('hadSingle twice', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        hadSingle(reg, 0);
        hadSingle(reg, 0);
        expStatesToBeCloseTo(reg.states, STATE_ZERO);
    });

});