import {Complex} from "./math/complex";
import {QubitState, STATE_L, STATE_MINUS, STATE_ONE, STATE_PLUS, STATE_R, STATE_ZERO} from "./qubit-state";
import {bit} from "../logic/math/truth-table";
import {inner} from "../logic/math/linear-algebra";

export class Qubit {

    private measuredValue: bit | null = null;

    /**
     * Creates a Qubit with the given computational basis states.
     */
    constructor(private _basisStateZero: Complex, private _basisStateOne: Complex) {
        if (!this.isValid()) {
            throw new Error("Invalid qubit state initalization. Probabilities of states have to sum up to 1.");
        }
    }

    get basisStateZero(): Complex {
        return this._basisStateZero;
    }

    get basisStateOne(): Complex {
        return this._basisStateOne;
    }

    static of(stateZero: Complex, stateOne: Complex) {
        return new Qubit(stateZero, stateOne);
    }

    static ofState(state: QubitState) {
        return new Qubit(state[0], state[1]);
    }

    state(): QubitState {
        return [this.basisStateZero, this.basisStateOne];
    }

    probabilities(): [stateZeroProbability: number, stateOneProbability: number] {
        // |z|^2 (Modulus of z squared)
        return [
            this.basisStateZero.re * this.basisStateZero.re + this.basisStateZero.im * this.basisStateZero.im,
            this.basisStateOne.re * this.basisStateOne.re + this.basisStateOne.im * this.basisStateOne.im
        ];
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
    measure(): bit {
        if (!this.measuredValue) {
            const probabilities = this.probabilities(); // Sums to 1
            const rand = Math.random();
            this.measuredValue = rand <= probabilities[0] ? 0 : 1;
        }
        return this.measuredValue;
    }

    equals(that: Qubit) {
        return this.basisStateZero.equals(that.basisStateZero)
            && this.basisStateOne.equals(that.basisStateOne);
    }

    private isValid(): boolean {
        let probsSum = this.probabilities()[0] + this.probabilities()[1];
        return probsSum > 0.99 && probsSum < 1.01;
    }

}

export const QUBIT_STATE_ZERO = Qubit.ofState(STATE_ZERO);
export const QUBIT_STATE_ONE = Qubit.ofState(STATE_ONE);

export const QUBIT_STATE_PLUS = Qubit.ofState(STATE_PLUS);
export const QUBIT_STATE_MINUS = Qubit.ofState(STATE_MINUS);

export const QUBIT_STATE_R = Qubit.ofState(STATE_R);
export const QUBIT_STATE_L = Qubit.ofState(STATE_L);
