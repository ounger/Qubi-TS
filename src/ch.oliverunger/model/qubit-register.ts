import {_0, _1, Complex} from "./complex";
import {Qubit} from "./qubit";
import {tensor} from "../logic/math/linear-algebra";

export class QubitRegister {

  /** Creates a register of the given number of qubits and initializes it in state |0...0> */
  constructor(private _numQubits: number) {
    this._states = new Array<Complex>(Math.pow(2, _numQubits)).fill(_0);
    this._states[0] = _1;
  }

  private _states: Complex[];

  public get states(): Complex[] {
    return this._states;
  }

  public get numQubits(): number {
    return this._numQubits!;
  }

  static ofQubits(...qubits: Qubit[]) {
    let reg = new QubitRegister(qubits.length);
    reg._states = tensor(...qubits.map(q => q.vector()));
    return reg;
  }

}
