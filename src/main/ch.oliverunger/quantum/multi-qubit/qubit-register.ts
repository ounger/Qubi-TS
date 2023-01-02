import {_0, _1, Complex, MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO} from '../../math/complex';
import {Qubit} from '../single-qubit/qubit';
import {tensorVectors} from '../../math/linear-algebra';
import {bit, getAllRowsWith1InCol, getTTCol} from '../../math/truth-table';
import {round} from '../../math/math-util';
import {rotateArray} from '../../util';

export class QubitRegister {

    private measuredValue: number | null = null;
    // noinspection TypeScriptFieldCanBeMadeReadonly
    private measuredValuesQubits: (bit | null)[];
    // noinspection TypeScriptFieldCanBeMadeReadonly
    private states: Complex[];

    static ofQubits(...qubits: Qubit[]): QubitRegister {
        let reg = new QubitRegister(qubits.length);
        reg.states = tensorVectors(...qubits.map(q => q.state()));
        return reg;
    }

    static ofStates(states: Complex[]): QubitRegister {
        if (states.length < 2) {
            throw new Error('Number of states has to be > 1');
        }
        let numQubits = Math.log2(states.length);
        if (!Number.isInteger(numQubits)) {
            throw new Error('Number of states is not a power of 2');
        }
        let reg = new QubitRegister(numQubits);
        for (let state in states) {
            reg.getStates()[state] = states[state];
        }
        reg.checkValidity();

        // TODO Eigentlich muesste ich jeden Zustand vorher pruefen. Denn die summe der Probs zweier ungueltiger Zustaende
        // TODO koennte wieder gueltig sein

        return reg;
    }

    /**
     * Returns a register with the given number of qubits maximally entangled. <br>
     * 1 qubit: Returns ket(+) <br>
     * 2 qubits: Returns the Bell State Phi+ <br>
     * 3 qubits: Returns a GHZ State
     */
    static createMaxEntangledRegister(numQubits: number): QubitRegister {
        if (numQubits < 1) {
            throw new Error('Number of qubits has to be > 0');
        }
        const reg = new QubitRegister(numQubits); // Returns ket(00...0)
        reg.states[0] = ONE_OF_SQRT_TWO;
        reg.states[reg.states.length - 1] = ONE_OF_SQRT_TWO;
        return reg;
    }

    static createMaxMixedRegister(numQubits: number): QubitRegister {
        if (numQubits < 1) {
            throw new Error('Number of qubits has to be > 0');
        }
        const numStates = Math.pow(2, numQubits);
        // 1 qubit: [1/Sqrt(2), 1/Sqrt(2)]
        // 2 qubit: [1/Sqrt(4), 1/Sqrt(4), 1/Sqrt(4), 1/Sqrt(4)]
        // 3 qubits: [1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8), 1/Sqrt(8)]
        const amp = Complex.ofRe(1 / Math.sqrt(Math.pow(2, numQubits)));
        return QubitRegister.ofStates(new Array<Complex>(numStates).fill(amp));
    }

    /** Creates a register of the given number of qubits and initializes it in state |0...0> */
    constructor(private _numQubits: number) {
        this.states = new Array<Complex>(Math.pow(2, _numQubits)).fill(_0);
        this.getStates()[0] = _1;
        this.measuredValuesQubits = new Array<bit | null>(_numQubits).fill(null);
    }

    public getStates(): Complex[] {
        return this.states;
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
        return this.getStates()[index].re * this.getStates()[index].re
            + this.getStates()[index].im * this.getStates()[index].im;
    }

    /**
     * Returns the probability for each state
     */
    probabilities(): number[] {
        // |z|^2 (Modulus of z squared)
        return this.getStates().map(state => state.re * state.re + state.im * state.im);
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
            let ttCol = getTTCol(this.numQubits, q);
            for (let state = 0; state < ttCol.length; state++) {
                if (ttCol[state] === measuredValue) {
                    // A remaining state must be renormalized (division by the squareroot of the outcome probability)
                    // so that the probabilities of the remaining states add up to 1.
                    this.getStates()[state] = this.getStates()[state].div(Complex.ofRe(Math.sqrt(probOutcome)));
                } else {
                    // Eliminated state
                    this.getStates()[state] = _0;
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
            for (let i = 0; i < this.getStates().length - 1; i++) {
                probsSum += probabilites[i];
                if (i == this.getStates().length - 2) { // The second last state
                    this.measuredValue = rand <= probsSum ? i : i + 1;
                } else if (rand <= probsSum) {
                    this.measuredValue = i;
                    break;
                }
            }
        }
        return this.measuredValue!;
    }

    increment() {
        this.add(1);
    }

    decrement() {
        this.sub(1);
    }

    add(summand: number) {
        rotateArray(this.getStates(), -summand);
    }

    sub(subtrahend: number) {
        rotateArray(this.getStates(), subtrahend);
    }

    /**
     * Returns true, if the qubits in this register are entangled or not.
     * If they are not entangled, they are said to be in a product state or separable.
     */
    areQubitsEntangled(): boolean {
        // TODO
        return false;
    }

    private checkValidity() {
        if (!this.isValid()) {
            throw new Error('Probabilities dont sum up to 1');
        }
    }

    private isValid(): boolean {
        const probsSum = this.probabilities().reduce((p, c) => p + c, 0);
        return round(probsSum, 5) === 1;
    }

}

/**
 * One of the four Bell States <br>
 * The result from input ket(00) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PHI_PLUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, ONE_OF_SQRT_TWO];

/**
 * One of the four Bell States <br>
 * The result from input ket(10) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PHI_MINUS: Complex[] = [ONE_OF_SQRT_TWO, _0, _0, MINUS_ONE_OF_SQRT_TWO];

/**
 * One of the four Bell States <br>
 * The result from input ket(01) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PSI_PLUS: Complex[] = [_0, ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO, _0];

/**
 * One of the four Bell States <br>
 * The result from input ket(11) using had on the first qubit and cx(0, 1)
 */
export const BELL_STATE_PSI_MINUS: Complex[] = [_0, ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, _0];
