import {QubitRegister} from "../../../main/ch.oliverunger/model/qubit-register";
import {QUBIT_STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit";
import {Step} from "../../../main/ch.oliverunger/model/step";
import {hadSingle} from "../../../main/ch.oliverunger/logic/gates/multi-qubit-gates";
import {expStatesToBeCloseTo} from "../util/test-util";
import {STATE_PLUS, STATE_ZERO} from "../../../main/ch.oliverunger/model/qubit-state";

describe('Create a step on a single qubit register and execute it', () => {

    test('hadSingle', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        const step = new Step(() => hadSingle(reg, 0));
        step.execute();
        expStatesToBeCloseTo(reg.states, STATE_PLUS);
    });

    test('hadSingle twice', () => {
        const reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        const step = new Step(() => hadSingle(reg, 0), () => hadSingle(reg, 0));
        step.execute();
        expStatesToBeCloseTo(reg.states, STATE_ZERO);
    });

});