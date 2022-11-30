import {
    Qubit,
    QUBIT_STATE_MINUS,
    QUBIT_STATE_ONE,
    QUBIT_STATE_PLUS,
    QUBIT_STATE_ZERO
} from "../../../../main/ch.oliverunger/model/qubit";
import {
    ccx,
    cphase, cs,
    ct,
    cx, cz, hadSingle,
    phase,
    phaseS,
    phaseT,
    phaseZ,
    swap,
    x
} from "../../../../main/ch.oliverunger/logic/gates/multi-qubit-gates";
import {
    _0,
    _1,
    Complex,
    MINUS_ONE_OF_SQRT_TWO,
    ONE_OF_SQRT_TWO
} from "../../../../main/ch.oliverunger/model/math/complex";
import {
    BELL_STATE_PHI_PLUS,
    BELL_STATE_PSI_PLUS,
    QubitRegister
} from "../../../../main/ch.oliverunger/model/qubit-register";
import {expOfiTimesAngleDegrees} from "../../../../main/ch.oliverunger/logic/math/util";
import {expQubitsToBeCloseTo, expStatesToBeCloseTo} from "../../util/TestUtil";
import {STATE_PLUS, STATE_ZERO} from "../../../../main/ch.oliverunger/model/qubit-state";
import {had} from "../../../../main/ch.oliverunger/logic/gates/single-qubit-gates";

const expOfiTimesAngle45Degrees = expOfiTimesAngleDegrees(45);
const expOfiTimesAngle90Degrees = expOfiTimesAngleDegrees(90);
const expOfiTimesAngle180Degrees = expOfiTimesAngleDegrees(180);

describe('CX Tests: 2 Qubits', () => {

    test('Simple State: |00> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |01> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |10> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |11>  -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Superposition State: |+0> -> Bell Pair Phi-Plus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        cx(reg, 0, 1);
        expect(reg.states).toEqual(BELL_STATE_PHI_PLUS);
    });

    test('Superposition State: |+1> -> Bell Pair Psi-Plus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        cx(reg, 0, 1);
        expect(reg.states).toEqual(BELL_STATE_PSI_PLUS);
    });

    test('Superposition State: |-0> -> Bell Pair Phi-Minus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ZERO);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0), MINUS_ONE_OF_SQRT_TWO]);
    });

    test('Superposition State: |-1> -> Bell State Psi-Minus', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ONE);
        cx(reg, 0, 1);
        expect(reg.states).toEqual([_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, Complex.ofRe(-0)]);
    });

    test('First Qubit Target, Second Qubit Control', () => {
        let reg = createExampleRegister2Qubits();
        cx(reg, 1, 0);
        expect(reg.states).toEqual([EX_REG_2Q_S0, EX_REG_2Q_S3, EX_REG_2Q_S2, EX_REG_2Q_S1]);
    });

});

describe('CX Tests: 3 Qubits', () => {

    test('First Qubit Control, Second Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 0, 1);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S6, EX_REG_3Q_S7, EX_REG_3Q_S4, EX_REG_3Q_S5]);
    });

    test('First Qubit Target, Second Control', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 1, 0);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S6, EX_REG_3Q_S7,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S2, EX_REG_3Q_S3]);
    });

    test('First Qubit Control, Third Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 0, 2);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S5, EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('First Qubit Target, Third Control', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 2, 0);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S5, EX_REG_3Q_S2, EX_REG_3Q_S7,
            EX_REG_3Q_S4, EX_REG_3Q_S1, EX_REG_3Q_S6, EX_REG_3Q_S3]);
    });

    test('Second Qubit Control, Third Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 1, 2);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S3, EX_REG_3Q_S2,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('Thrid Qubit Control, Second Target', () => {
        let reg = createExampleRegister3Qubits();
        cx(reg, 2, 1);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S3, EX_REG_3Q_S2, EX_REG_3Q_S1,
            EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6, EX_REG_3Q_S5]);
    });

});

describe('Swap Tests', () => {

    test('Simple State: |00> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |01> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Simple State: |10> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |11> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Superposition State: |+0> -> |0+>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0, _0]);
    });

    test('Superposition State: |+1> -> |1+>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_0, _0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO]);
    });

    test('Superposition State: |-0> -> |0->', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ZERO);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0, Complex.ofRe(-0)]);
    });

    test('Superposition State: |-1> -> |1->', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_MINUS, QUBIT_STATE_ONE);
        swap(reg, 0, 1);
        expect(reg.states).toEqual([_0, Complex.ofRe(-0), ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO]);
    });

    test('Swap Qubit 1 and Qubit 0', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 1, 0);
        expect(reg.states).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S2,
            EX_REG_2Q_S1,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 0 and Qubit 0', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 0, 0);
        expect(reg.states).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S1,
            EX_REG_2Q_S2,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 1 and Qubit 1', () => {
        let reg = createExampleRegister2Qubits();
        swap(reg, 0, 0);
        expect(reg.states).toEqual([
            EX_REG_2Q_S0,
            EX_REG_2Q_S1,
            EX_REG_2Q_S2,
            EX_REG_2Q_S3
        ]);
    });

    test('Swap Qubit 0 and Qubit 1', () => {
        let reg = createExampleRegister3Qubits();
        swap(reg, 0, 1);
        expect(reg.states).toEqual([
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S4,
            EX_REG_3Q_S5,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7
        ]);
    });

});

describe('X Tests', () => {

    test('Simple State: |00> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Simple State: |00> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |01> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        x(reg, 0);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |01> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        x(reg, 1);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |10> -> |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Simple State: |10> -> |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.states).toEqual([_0, _0, _0, _1]);
    });

    test('Simple State: |11> -> |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        x(reg, 0);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Simple State: |11> -> |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        x(reg, 1);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Superposition State: |+0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        x(reg, 0);
        expect(reg.states).toEqual([ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO, _0]);
    });

    test('Superposition State: |+0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_ZERO);
        x(reg, 1);
        expect(reg.states).toEqual([_0, ONE_OF_SQRT_TWO, _0, ONE_OF_SQRT_TWO]);
    });

    test('3 Qubits, X on Qubit 0', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 0);
        expect(reg.states).toEqual([
            EX_REG_3Q_S4,
            EX_REG_3Q_S5,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7,
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S2,
            EX_REG_3Q_S3
        ]);
    });

    test('3 Qubits, X on Qubit 1', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 1);
        expect(reg.states).toEqual([
            EX_REG_3Q_S2,
            EX_REG_3Q_S3,
            EX_REG_3Q_S0,
            EX_REG_3Q_S1,
            EX_REG_3Q_S6,
            EX_REG_3Q_S7,
            EX_REG_3Q_S4,
            EX_REG_3Q_S5
        ]);
    });

    test('3 Qubits, X on Qubit 2', () => {
        let reg = createExampleRegister3Qubits();
        x(reg, 2);
        expect(reg.states).toEqual([
            EX_REG_3Q_S1,
            EX_REG_3Q_S0,
            EX_REG_3Q_S3,
            EX_REG_3Q_S2,
            EX_REG_3Q_S5,
            EX_REG_3Q_S4,
            EX_REG_3Q_S7,
            EX_REG_3Q_S6
        ]);
    });

});

describe('CCX Tests', () => {

    test('3 Qubits ccx(reg, c0 = 0, c1 = 1, c2 = 2)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, 0, 1, 2);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3, EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S7, EX_REG_3Q_S6]);
    });

    test('3 Qubits ccx(reg, c0 = 0, c1 = 2, c2 = 1)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, 0, 2, 1);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3, EX_REG_3Q_S4, EX_REG_3Q_S7, EX_REG_3Q_S6, EX_REG_3Q_S5]);
    });

    test('3 Qubits ccx(reg, c0 = 1, c1 = 2, c2 = 0)', () => {
        let reg = createExampleRegister3Qubits();
        ccx(reg, 1, 2, 0);
        expect(reg.states).toEqual([EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S7, EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6, EX_REG_3Q_S3]);
    });

});

describe('Phase Tests', () => {

    test('Phase 45 on |0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_1, _0]);
    });

    test('Phase 45 on |1>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 0 of |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.states).toEqual([_1, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 0 of |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_0, _0, expOfiTimesAngle45Degrees, _0]);
    });

    test('Phase 45 on Qubit 1 of |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.states).toEqual([_0, _0, _1, _0]);
    });

    test('Phase 45 on Qubit 0 of |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_0, _1, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        phase(reg, 1, 45);
        expect(reg.states).toEqual([_0, expOfiTimesAngle45Degrees, _0, _0]);
    });

    test('Phase 45 on Qubit 0 of |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 1 of |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        phase(reg, 1, 45);
        expect(reg.states).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees]);
    });

    test('Phase 45 on Qubit 0 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 0, 45);
        expect(reg.states).toEqual([_0, _0, _1, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 1 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 1, 45);
        expect(reg.states).toEqual([_0, _0, expOfiTimesAngle45Degrees, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 2 of |010>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        phase(reg, 2, 45);
        expect(reg.states).toEqual([_0, _0, _1, _0, _0, _0, _0, _0]);
    });

    test('Phase 45 on Qubit 0 on |++>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        phase(reg, 0, 45);
        expStatesToBeCloseTo(reg.states, [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees)]);
    });

    test('Phase 45 on Qubit 1 of |++>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_PLUS, QUBIT_STATE_PLUS);
        phase(reg, 1, 45);
        expStatesToBeCloseTo(reg.states, [Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees), Complex.ofRe(1 / 2), Complex.ofRe(1 / 2).mul(expOfiTimesAngle45Degrees)]);
    });

});

describe('PhaseT Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseT(reg, 0);
        expect(reg.states).toEqual([_0, expOfiTimesAngle45Degrees]);
    });
});

describe('PhaseS Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseS(reg, 0);
        expect(reg.states).toEqual([_0, expOfiTimesAngle90Degrees]);
    });
});

describe('PhaseZ Tests', () => {
    test('', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        phaseZ(reg, 0);
        expect(reg.states).toEqual([_0, expOfiTimesAngle180Degrees]);
    });
});

describe('CPHASE Tests', () => {

    test('CPHASE 45 on |0>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO);
        cphase(reg, 0, 0, 45);
        expect(reg.states).toEqual([_1, _0]);
    });

    test('CPHASE 45 on |1>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE);
        cphase(reg, 0, 0, 45);
        expect(reg.states).toEqual([_0, expOfiTimesAngle45Degrees]);
    });

    test('CPHASE 45 in |00>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ZERO);
        cphase(reg, 0, 1, 45);
        expect(reg.states).toEqual([_1, _0, _0, _0])
    });

    test('CPHASE 45 in |01>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_ONE);
        cphase(reg, 0, 1, 45);
        expect(reg.states).toEqual([_0, _1, _0, _0])
    });

    test('CPHASE 45 in |10>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ZERO);
        cphase(reg, 0, 1, 45);
        expect(reg.states).toEqual([_0, _0, _1, _0])
    });

    test('CPHASE 45 in |11>', () => {
        let reg = QubitRegister.ofQubits(QUBIT_STATE_ONE, QUBIT_STATE_ONE);
        cphase(reg, 0, 1, 45);
        expect(reg.states).toEqual([_0, _0, _0, expOfiTimesAngle45Degrees])
    });

    test('CPHASE 45 on first and second qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 0, 1, 45);
        expect(reg.states).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6.mul(expOfiTimesAngle45Degrees), EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

    test('CPHASE 45 on first and third qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 0, 2, 45);
        expect(reg.states).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3,
            EX_REG_3Q_S4, EX_REG_3Q_S5.mul(expOfiTimesAngle45Degrees), EX_REG_3Q_S6, EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

    test('CPHASE 45 on second and third qubit in 3 qubit register ', () => {
        let reg = createExampleRegister3Qubits();
        cphase(reg, 1, 2, 45);
        expect(reg.states).toEqual([
            EX_REG_3Q_S0, EX_REG_3Q_S1, EX_REG_3Q_S2, EX_REG_3Q_S3.mul(expOfiTimesAngle45Degrees),
            EX_REG_3Q_S4, EX_REG_3Q_S5, EX_REG_3Q_S6, EX_REG_3Q_S7.mul(expOfiTimesAngle45Degrees)]);
    });

});

describe('CT Tests', () => {
    test('CT equals CPHASE 45', () => {
        let csReg = createExampleRegister3Qubits();
        let cphase45Reg = createExampleRegister3Qubits();
        ct(csReg, 0, 1);
        cphase(cphase45Reg, 0, 1, 45);
        expect(csReg.states).toEqual(cphase45Reg.states);
    });
});

describe('CS Tests', () => {
    test('CS equals CPHASE 90', () => {
        let csReg = createExampleRegister3Qubits();
        let cphase90Reg = createExampleRegister3Qubits();
        cs(csReg, 0, 1);
        cphase(cphase90Reg, 0, 1, 90);
        expect(csReg.states).toEqual(cphase90Reg.states);
    });
});

describe('CZ Tests', () => {
    test('CZ equals CPHASE 180', () => {
        let czReg = createExampleRegister3Qubits();
        let cphase180Reg = createExampleRegister3Qubits();
        cz(czReg, 0, 1);
        cphase(cphase180Reg, 0, 1, 180);
        expect(czReg.states).toEqual(cphase180Reg.states);
    });
});

describe('hadSingle Tests', () => {

    test('hadSingle on first qubit of |0+> -> |++> ', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        hadSingle(reg0, 0);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = QUBIT_STATE_ZERO;
        let q1 = QUBIT_STATE_PLUS;
        q0 = had(q0);
        let reg1 = QubitRegister.ofQubits(q0, q1);

        expStatesToBeCloseTo(reg0.states, reg1.states);
    });

    test('hadSingle on second qubit of |0+> -> |00> ', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS);
        hadSingle(reg0, 1);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = QUBIT_STATE_ZERO;
        let q1 = QUBIT_STATE_PLUS;
        q1 = had(q1);
        let reg1 = QubitRegister.ofQubits(q0, q1);

        expStatesToBeCloseTo(reg0.states, reg1.states);
    });

    test('hadSingle on first qubit of |0+1> -> |++1> ', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        hadSingle(reg0, 0);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = QUBIT_STATE_ZERO;
        let q1 = QUBIT_STATE_PLUS;
        let q2 = QUBIT_STATE_ONE;
        q0 = had(q0);
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expStatesToBeCloseTo(reg0.states, reg1.states);
    });

    test('hadSingle on second qubit of |0+1> -> |+01> ', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        hadSingle(reg0, 1);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = QUBIT_STATE_ZERO;
        let q1 = QUBIT_STATE_PLUS;
        let q2 = QUBIT_STATE_ONE;
        q1 = had(q1);
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expStatesToBeCloseTo(reg0.states, reg1.states);
    });

    test('hadSingle on third qubit of |0+1> -> |+0-> ', () => {
        // Hadamard on the register
        let reg0 = QubitRegister.ofQubits(QUBIT_STATE_ZERO, QUBIT_STATE_PLUS, QUBIT_STATE_ONE);
        hadSingle(reg0, 2);

        // should be equal to applying hadamard on the qubit first and then
        // building the register
        let q0 = QUBIT_STATE_ZERO;
        let q1 = QUBIT_STATE_PLUS;
        let q2 = QUBIT_STATE_ONE;
        q2 = had(q2);
        let reg1 = QubitRegister.ofQubits(q0, q1, q2);

        expStatesToBeCloseTo(reg0.states, reg1.states);
    });

});

/* Example Register of 2 Qubits State x */
const EX_REG_2Q_S0: Complex = Complex.ofRe(Math.sqrt(0.1));
const EX_REG_2Q_S1: Complex = Complex.ofRe(Math.sqrt(0.2));
const EX_REG_2Q_S2: Complex = Complex.ofRe(Math.sqrt(0.3));
const EX_REG_2Q_S3: Complex = Complex.ofRe(Math.sqrt(0.4));

function createExampleRegister2Qubits(): QubitRegister {
    return QubitRegister.ofStates([
        EX_REG_2Q_S0,
        EX_REG_2Q_S1,
        EX_REG_2Q_S2,
        EX_REG_2Q_S3
    ]);
}

const EX_REG_3Q_S0: Complex = Complex.ofRe(Math.sqrt(0.11));
const EX_REG_3Q_S1: Complex = Complex.ofRe(Math.sqrt(0.12));
const EX_REG_3Q_S2: Complex = Complex.ofRe(Math.sqrt(0.13));
const EX_REG_3Q_S3: Complex = Complex.ofRe(Math.sqrt(0.14));
const EX_REG_3Q_S4: Complex = Complex.ofRe(Math.sqrt(0.105));
const EX_REG_3Q_S5: Complex = Complex.ofRe(Math.sqrt(0.115));
const EX_REG_3Q_S6: Complex = Complex.ofRe(Math.sqrt(0.135));
const EX_REG_3Q_S7: Complex = Complex.ofRe(Math.sqrt(0.145));

function createExampleRegister3Qubits(): QubitRegister {
    return QubitRegister.ofStates([
        EX_REG_3Q_S0,
        EX_REG_3Q_S1,
        EX_REG_3Q_S2,
        EX_REG_3Q_S3,
        EX_REG_3Q_S4,
        EX_REG_3Q_S5,
        EX_REG_3Q_S6,
        EX_REG_3Q_S7
    ]);
}
