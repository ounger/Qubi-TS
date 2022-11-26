import {_0, _1, Complex} from "./complex";
import {Qubit} from "./qubit";
import {tensor} from "../logic/math/linear-algebra";
import {bit, getAllRowsWith1InCol, getTruthtableCol} from "../logic/math/truth-table";
import {round} from "../logic/math/util";

export class QubitRegister {

    private measuredValue: number | null = null;
    private measuredValuesQubits: (bit | null)[];

    static ofQubits(...qubits: Qubit[]): QubitRegister {
        let reg = new QubitRegister(qubits.length);
        reg._states = tensor(...qubits.map(q => q.vector()));
        return reg;
    }

    static ofStates(states: Complex[]): QubitRegister {
        let numQubits = Math.log2(states.length);
        if (states.length < 2 || !Number.isInteger(numQubits)) {
            throw new Error("Number of states is not a power of 2");
        }
        let reg = new QubitRegister(numQubits);
        for (let state in states) {
            reg._states[state] = states[state];
        }
        if (round(reg.probabilities().reduce((sum, current) => sum + current, 0), 2) !== 1) {
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

    private _states: Complex[];

    public get states(): Complex[] {
        return this._states;
    }

    public get numQubits(): number {
        return this._numQubits!;
    }

    /**
     * Returns the probability of the given qubit
     */
    probabilityOfQubit(q: number): number {
        let probsSum = 0;
        for (let i of getAllRowsWith1InCol(this.numQubits, q)) {
            probsSum += this.probabilityOfState(i);
        }
        return probsSum;
    }

    probabilityOfState(s: number): number {
        return this.states[s].re * this.states[s].re + this.states[s].im * this.states[s].im;
    }

    /**
     * Returns the probability for each state
     */
    probabilities(): number[] {
        // |z|^2 (Modulus of z squared)
        return this.states.map(state => state.re * state.re + state.im * state.im);
    }

    measureSingleQubit(q: number): bit {
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
                    this.states[state] = this.states[state].div(Complex.ofRe(Math.sqrt(probOutcome)));
                } else {
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
