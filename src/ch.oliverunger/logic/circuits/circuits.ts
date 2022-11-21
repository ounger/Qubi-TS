/**
 * Quantum Random Number Generator (QRNG)
 */
import {STATE_ZERO_QUBIT} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";

export function qrng(): 0 | 1 {
  return had(STATE_ZERO_QUBIT).measure();
}
