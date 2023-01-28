/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {Complex} from '../../math/complex';
import {QubitState, STATE_L, STATE_MINUS, STATE_ONE, STATE_PLUS, STATE_R, STATE_ZERO} from './qubit-state';
import {Bit} from '../../math/truth-table';
import {density, inner, multiplyMatrixVector2c} from '../../math/linear-algebra';
import {
    getPhaseGate,
    getRot1Gate,
    getRotXGate,
    getRotYGate,
    getRotZGate,
    HADAMARD_GATE,
    IDENTITY_GATE,
    PAULI_X_GATE,
    PAULI_Y_GATE,
    PAULI_Z_GATE,
    PHASE_S_GATE,
    PHASE_T_GATE,
    RNOT_GATE,
    RNOT_INVERSE_GATE
} from './qubit-gates';
import {round} from '../../math/math-util';

export class Qubit {

    private measuredValue: Bit | null = null;

    static of(stateZeroAmplitude: Complex, stateOneAmplitude: Complex) {
        return new Qubit(stateZeroAmplitude, stateOneAmplitude);
    }

    static ofState(state: QubitState) {
        return new Qubit(state[0], state[1]);
    }

    /**
     * Creates a qubit with the given amplitudes for the computational basis states.
     */
    constructor(private stateZeroAmplitude: Complex, private stateOneAmplitude: Complex) {
        this.checkValidity();
    }

    getStateZeroAmplitude(): Complex {
        return this.stateZeroAmplitude;
    }

    getStateOneAmplitude(): Complex {
        return this.stateOneAmplitude;
    }

    setAmplitudesOfState(newStateZeroAmplitude: Complex, newStateOneAmplitude: Complex) {
        this.stateZeroAmplitude = newStateZeroAmplitude;
        this.stateOneAmplitude = newStateOneAmplitude;
        this.checkValidity();
    }

    state(): QubitState {
        return [this.stateZeroAmplitude, this.stateOneAmplitude];
    }

    probabilities(): [stateZeroProbability: number, stateOneProbability: number] {
        return [this.stateZeroAmplitude.modulusSquared(), this.stateOneAmplitude.modulusSquared()];
    }

    /**
     * Returns the probability that the qubit is measured in the given state. <br>
     * The probability of measuring the state ket(b) to be ket(a) is <br>
     * |bra(a)ket(b)|^2. <br>
     * Examples:
     * <li> bra(0)ket(1) = 0
     * <li> bra(0)ket(0) = 1
     * <li> bra(0)ket(+) = 0.5
     * <li> bra(1)ket(+) = 0.5
     */
    probabilityOfState(state: QubitState): number {
        return Math.pow(inner(state, this.state()).abs(), 2);
    }

    /**
     * Simulating a measurement
     */
    measure(): Bit {
        if (this.measuredValue == null) {
            const probs = this.probabilities();
            const rand = Math.random();
            this.measuredValue = rand <= probs[0] ? 0 : 1;
        }
        return this.measuredValue;
        // Alternative: return this.measureInState(STATE_ZERO);
    }

    measureInState(state: QubitState): Bit {
        if (this.measuredValue == null) {
            const prob = this.probabilityOfState(state);
            const rand = Math.random();
            this.measuredValue = rand <= prob ? 0 : 1;
        }
        return this.measuredValue;
    }

    equals(that: Qubit) {
        return this.stateZeroAmplitude.equals(that.stateZeroAmplitude)
            && this.stateOneAmplitude.equals(that.stateOneAmplitude);
    }

    private checkValidity() {
        if (!this.isValid()) {
            throw new Error('Invalid qubit state. Probabilities for each state don\'t to sum up to 1.');
        }
    }

    private isValid(): boolean {
        const probs = this.probabilities();
        const probsSum = probs[0] + probs[1];
        return round(probsSum, 5) === 1;
    }

    /**
     * Calculates the coordinates for this qubits state in the Bloch Sphere.
     */
    calcCartesianCoordinates(): [x: number, y: number, z: number] {
        // See: https://quantumcomputing.stackexchange.com/a/17180/11582
        const densityMatrix = density(this.state());
        const a = densityMatrix[0][0];
        const c = densityMatrix[1][0];
        const x = 2 * c.re;
        const y = 2 * c.im;
        const z = 2 * a.re - 1;
        return [x, y, z];
    }

    /**
     * The Identity gate is a single-qubit operation that multiplies the qubit's vector
     * with the identity matrix. It does not modify the quantum state.
     * NOTE: Only use it for tests.
     */
    identity() {
        this.applyGate(IDENTITY_GATE);
    }

    /**
     * The Pauli-X gate is a single-qubit operation that is the equivalent of the NOT gate
     * for classical computers.
     */
    x() {
        this.applyGate(PAULI_X_GATE);
    }

    /**
     * The Pauli-Y gate is a single-qubit operation.
     */
    y() {
        this.applyGate(PAULI_Y_GATE);
    }

    /**
     * The Pauli-Z gate is a single-qubit operation.
     */
    z() {
        this.applyGate(PAULI_Z_GATE);
    }

    /**
     * The Hadamard gate is a single-qubit operation that creates
     * an equal superposition of the two basis states.
     */
    had() {
        this.applyGate(HADAMARD_GATE);
    }

    /**
     * Phase shift by Math.PI / 4 (45°)
     */
    phaseT() {
        this.applyGate(PHASE_T_GATE);
    }

    /**
     * Phase shift by Math.PI / 2 (90°)
     */
    phaseS() {
        this.applyGate(PHASE_S_GATE);
    }

    /**
     * Phase shift by Math.PI (180°)
     */
    phaseZ() {
        this.z();
    }

    /**
     * Phase shift by an angle in degrees.
     * Multiplies the matrix <br>
     * |1      0    | <br>
     * |0  e^(i*phi)| <br>
     * with the vector of the qubit. <br>
     * Phi is the angle in radians. <br>
     * e^(i*phi) = cos(phi) + i * sin(phi)
     */
    phase(angleDegrees: number) {
        this.applyGate(getPhaseGate(angleDegrees));
    }

    /**
     * Rotation around the x-axis <br>
     * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
     */
    rotX(angleDegrees: number) {
        this.applyGate(getRotXGate(angleDegrees));
    }

    /**
     * Rotation around the y-axis <br>
     * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
     */
    rotY(angleDegrees: number) {
        this.applyGate(getRotYGate(angleDegrees));
    }

    /**
     * Rotation around the z-axis <br>
     * See {@link https://www.quantum-inspire.com/kbase/rotation-operators/}
     */
    rotZ(angleDegrees: number) {
        this.applyGate(getRotZGate(angleDegrees));
    }

    /**
     * Rotation around the ket(1) state <br>
     * See {@link https://www.strathweb.com/2021/12/difference-between-r1-and-rz-gate-in-quantum-computing/}
     */
    rot1(angleDegrees: number) {
        this.applyGate(getRot1Gate(angleDegrees));
    }

    /**
     * ROOT-of-NOT
     */
    rnot() {
        this.applyGate(RNOT_GATE);
    }

    /**
     * ROOT-of-NOT Inverse
     */
    rnotInverse() {
        this.applyGate(RNOT_INVERSE_GATE);
    }

    private applyGate(gate: Complex[][]) {
        let amplitudesOfNewState = multiplyMatrixVector2c(gate, this.state());
        this.setAmplitudesOfState(amplitudesOfNewState[0], amplitudesOfNewState[1]);
    }

}

export const QUBIT_STATE_ZERO = Qubit.ofState(STATE_ZERO);
export const QUBIT_STATE_ONE = Qubit.ofState(STATE_ONE);

export const QUBIT_STATE_PLUS = Qubit.ofState(STATE_PLUS);
export const QUBIT_STATE_MINUS = Qubit.ofState(STATE_MINUS);

export const QUBIT_STATE_R = Qubit.ofState(STATE_R);
export const QUBIT_STATE_L = Qubit.ofState(STATE_L);
