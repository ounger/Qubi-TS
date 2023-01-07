import {
    BELL_STATE_PHI_MINUS,
    BELL_STATE_PHI_PLUS,
    BELL_STATE_PSI_MINUS,
    BELL_STATE_PSI_PLUS,
    QubitRegister
} from "../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {
    analyzeBellState,
    createBellStateAnalyzerCircuit
} from "../../../../main/ch.oliverunger/quantum/circuits/analyzer-circuits";
import {expComplexArraysToBeCloseTo} from "../../test-util";

describe("Bell State analyzer", () => {

    test("Phi Plus", () => {
        const reg = QubitRegister.ofStates(BELL_STATE_PHI_PLUS);
        const bsa = createBellStateAnalyzerCircuit(reg, 0, 1);
        bsa.execute();
        const b0 = reg.measureSingleQubit(0);
        const b1 = reg.measureSingleQubit(1);
        expComplexArraysToBeCloseTo(analyzeBellState(b0, b1), BELL_STATE_PHI_PLUS);
    });

    test("Phi Minus", () => {
        const reg = QubitRegister.ofStates(BELL_STATE_PHI_MINUS);
        const bsa = createBellStateAnalyzerCircuit(reg, 0, 1);
        bsa.execute();
        const b0 = reg.measureSingleQubit(0);
        const b1 = reg.measureSingleQubit(1);
        expComplexArraysToBeCloseTo(analyzeBellState(b0, b1), BELL_STATE_PHI_MINUS);
    });

    test("Psi Plus", () => {
        const reg = QubitRegister.ofStates(BELL_STATE_PSI_PLUS);
        const bsa = createBellStateAnalyzerCircuit(reg, 0, 1);
        bsa.execute();
        const b0 = reg.measureSingleQubit(0);
        const b1 = reg.measureSingleQubit(1);
        expComplexArraysToBeCloseTo(analyzeBellState(b0, b1), BELL_STATE_PSI_PLUS);
    });

    test("Psi Minus", () => {
        const reg = QubitRegister.ofStates(BELL_STATE_PSI_MINUS);
        const bsa = createBellStateAnalyzerCircuit(reg, 0, 1);
        bsa.execute();
        const b0 = reg.measureSingleQubit(0);
        const b1 = reg.measureSingleQubit(1);
        expComplexArraysToBeCloseTo(analyzeBellState(b0, b1), BELL_STATE_PSI_MINUS);
    });

});