/**
 * Quantum Random Number Generator (QRNG)
 */
import {QUBIT_STATE_ZERO} from "../../model/qubit";
import {had} from "../gates/single-qubit-gates";
import {bit} from "../math/truth-table";

export function qrng(): bit {
  return had(QUBIT_STATE_ZERO).measure();
}
