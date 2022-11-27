import {Complex} from "./math/complex";
import {QubitState, STATE_L, STATE_MINUS, STATE_ONE, STATE_PLUS, STATE_R, STATE_ZERO} from "./qubit-state";
import {bit} from "../logic/math/truth-table";

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
        return this.basisStateZero.equals(that.basisStateZero) && this.basisStateOne.equals(this.basisStateOne);
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
