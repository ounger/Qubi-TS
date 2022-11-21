import {_0, _1, Complex, i_OF_SQRT_TWO, MINUS_i_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO} from "./complex";
import {Vector2c} from "./vector2c";
import {round} from "../logic/math/util";
import {bit} from "../logic/math/truth-table";

export class Qubit {

  private measuredValue: bit | null = null;

  constructor(private _stateZeroAmplitude: Complex, private _stateOneAmplitude: Complex) {
    // if(!this.isValid()) {
    //   throw new Error("Invalid qubit state initalization. Probabilities of states have to sum up to 1.");
    // }
  }

  get stateZeroAmplitude(): Complex {
    return this._stateZeroAmplitude;
  }

  get stateOneAmplitude(): Complex {
    return this._stateOneAmplitude;
  }

  static of(stateZeroAmplitude: Complex, stateOneAmplitude: Complex) {
    return new Qubit(stateZeroAmplitude, stateOneAmplitude);
  }

  static ofVector(vector: Vector2c) {
    return new Qubit(vector[0], vector[1]);
  }

  vector(): Vector2c {
    return [this.stateZeroAmplitude, this.stateOneAmplitude];
  }

  probabilities(): [stateZeroProbability: number, stateOneProbability: number] {
    return [
      this.stateZeroAmplitude.re * this.stateZeroAmplitude.re + this.stateZeroAmplitude.im * this.stateZeroAmplitude.im,
      this.stateOneAmplitude.re * this.stateOneAmplitude.re + this.stateOneAmplitude.im * this.stateOneAmplitude.im
    ];
  }

  /**
   * Simulating a measurement
   */
  measure(): 0 | 1 {
    if (!this.measuredValue) {
      const probabilities = this.probabilities(); // Sums to 1
      const stateZeroProb = round(probabilities[0], 2);
      const rand = Math.random();
      this.measuredValue = rand > stateZeroProb ? 1 : 0
    }
    return this.measuredValue;
  }

  equals(that: Qubit) {
    return this.stateZeroAmplitude.equals(that.stateZeroAmplitude) && this.stateOneAmplitude.equals(this.stateOneAmplitude);
  }

  private isValid(): boolean {
    return this.probabilities()[0] + this.probabilities()[1] !== 1;
  }

}

// The two orthogonal z-basis states
export const STATE_ZERO_QUBIT = new Qubit(_1, _0);
export const STATE_ONE_QUBIT = new Qubit(_0, _1);

// The two orthogonal x-basis states
export const STATE_PLUS_QUBIT = new Qubit(ONE_OF_SQRT_TWO, ONE_OF_SQRT_TWO);
export const STATE_MINUS_QUBIT = new Qubit(ONE_OF_SQRT_TWO, MINUS_ONE_OF_SQRT_TWO);

// The two orthogonal y-basis states
export const STATE_R_QUBIT = new Qubit(ONE_OF_SQRT_TWO, i_OF_SQRT_TWO); // Synonym STATE_i_QUBIT
export const STATE_L_QUBIT = new Qubit(ONE_OF_SQRT_TWO, MINUS_i_OF_SQRT_TWO); // Synonym STATE_MINUS_i_QUBIT
