import {bit} from "../../math/truth-table";
import {Qubit} from "../single-qubit/qubit";
import {STATE_ZERO} from "../single-qubit/qubit-state";

/**
 * Quantum Random Number Generator (QRNG)
 */
export function qrng(): bit {
    const qubit = Qubit.ofState(STATE_ZERO);
    qubit.had();
    return qubit.measure();
}

// TODO Return circuit