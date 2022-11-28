import {_0, _1, Complex, MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO} from "./math/complex";
import {Qubit} from "./qubit";
import {tensorVectors} from "../logic/math/linear-algebra";
import {bit, getAllRowsWith1InCol, getTruthtableCol} from "../logic/math/truth-table";
import {round} from "../logic/math/util";

export class QubitsRegister { // TODO Rename QubitRegister

    private measuredValue: number | null = null;
    private measuredValuesQubits: (bit | null)[];
    private _states: Complex[];

    static ofQubits(...qubits: Qubit[]): QubitsRegister {
        let reg = new QubitsRegister(qubits.length);
        reg._states = tensorVectors(...qubits.map(q => q.state()));
        return reg;
    }

    static ofStates(states: Complex[]): QubitsRegister {
        if (states.length < 2) {
            throw new Error("Number of states has to be > 1");
        }
        let numQubits = Math.log2(states.length);
        if (!Number.isInteger(numQubits)) {
            throw new Error("Number of states is not a power of 2");
        }
        let reg = new QubitsRegister(numQubits);
        for (let state in states) {
            reg._states[state] = states[state];
        }
        let probsSum = reg.probabilities().reduce((sum, current) => sum + current, 0);
        if (round(probsSum, 2) !== 1) {
            throw new Error("Probabilities dont sum up to 1");
        }
        return reg;
    }

    /** Creates a register of the given number of qubits and initializes it in state |0...0> */
    constructor(private _numQubits: number) {
        this._states = new Array<Complex>(Math.pow(2, _numQubits)).fill(_0);
        this._states[0] = _1;
        this.measuredValuesQubits = new Array<bit | null>(_numQubits).fill(null);
    }

    public get states(): Complex[] {
        return this._states;
    }

    public get numQubits(): number {
        return this._numQubits!;
    }

    /**
     * Returns the probability of measuring 1 for a qubit in the register.
     */
    probabilityOfQubit(q: number): number {
        let probsSum = 0;
        let rows = getAllRowsWith1InCol(this.numQubits, q);
        for (let row of rows) {
            probsSum += this.probabilityOfStateAtIndex(row);
        }
        return probsSum;
    }

    probabilityOfStateAtIndex(index: number): number {
        return this.states[index].re * this.states[index].re
            + this.states[index].im * this.states[index].im;
    }

    /**
     * Returns the probability for each state
     */
    probabilities(): number[] {
        // |z|^2 (Modulus of z squared)
        return this.states.map(state => state.re * state.re + state.im * state.im);
    }

    measureSingleQubit(q: number): bit {
        // https://andisama.medium.com/qubit-an-intuition-3-quantum-measurement-full-and-partial-qubits-969340a6fb3
        // https://learn.microsoft.com/en-us/azure/quantum/concepts-multiple-qubits
        if (this.measuredValuesQubits[q] === null) {  // Don't use !this.measuredValue here, because of 0 = false (Falsy value of type number)
            // Randomized measuring of the qubit
            const probOfQ = this.probabilityOfQubit(q);
            const rand = Math.random();
            const measuredValue = rand <= probOfQ ? 1 : 0;
            const probOutcome = measuredValue === 1 ? probOfQ : 1 - probOfQ;

            // Calculate the effect on all states
            let ttCol = getTruthtableCol(this.numQubits, q);
            for (let state = 0; state < ttCol.length; state++) {
                if (ttCol[state] === measuredValue) {
                    // A remaining state must be renormalized (division by the squareroot of the outcome probability)
                    // so that the probabilities of the remaining states add up to 1.
                    this.states[state] = this.states[state].div(Complex.ofRe(Math.sqrt(probOutcome)));
                } else {
                    // Eliminated state
                    this.states[state] = _0;
                }
            }
            this.measuredValuesQubits[q] = measuredValue;
        }

        // All qubits measured? Then determine the measured value of the whole register
        if (!this.measuredValuesQubits.includes(null)) {
            this.measure();
        }

        return this.measuredValuesQubits[q]!;
    }

    /**
     * Simulating a measurement <br>
     * Returns the number of the measured state.
     */
    measure(): number {
        if (this.measuredValue === null) { // Don't use !this.measuredValue here, because of 0 = false (Falsy value of type number)
            const probabilites = this.probabilities(); // Sums to 1
            const rand = Math.random();
            let probsSum = 0;
            for (let i = 0; i < this.states.length - 1; i++) {
                probsSum += probabilites[i];
                if (i == this.states.length - 2) { // The second last state
                    this.measuredValue = rand <= probsSum ? i : i + 1;
                } else if (rand <= probsSum) {
                    this.measuredValue = i;
                    break;
                }
            }
        }
        return this.measuredValue!;
    }

}

export const BELL_STATE_PHI_PLUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, ONE_OF_SQRT_TWO];
export const BELL_STATE_PHI_MINUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, MINUS_ONE_OF_SQRT_TWO];
export const BELL_STATE_PSI_PLUS: Complex[] = [_0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0];
export const BELL_STATE_PSI_MINUS: Complex[] = [_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0];
