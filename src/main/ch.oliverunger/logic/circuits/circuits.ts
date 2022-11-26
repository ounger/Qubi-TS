/**
 * Quantum Random Number Generator (QRNG)
 */
import {STATE_ZERO_QUBIT} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";
import {bit} from "../math/truth-table";

export function qrng(): bit {
  return had(STATE_ZERO_QUBIT).measure();
}
