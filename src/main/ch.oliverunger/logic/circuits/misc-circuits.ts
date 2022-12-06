import {bit} from "../math/truth-table";
import {Qubit} from "../../model/qubit";
import {STATE_ZERO} from "../../model/qubit-state";
import {had} from "../gates/single-qubit-gates";

/**
 * Quantum Random Number Generator (QRNG)
 */
export function qrng(): bit {
    const qubit = Qubit.ofState(STATE_ZERO);
    had(qubit);
    return qubit.measure();
}