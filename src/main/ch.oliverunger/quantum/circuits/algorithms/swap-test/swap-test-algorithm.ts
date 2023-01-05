import {Qubit} from "../../../single-qubit/qubit";
import {STATE_ZERO} from "../../../single-qubit/qubit-state";
import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {hadSingle} from "../../../multi-qubit/multi-qubit-gates";

export function executeSwapTestAlgorithm(firstQubit: Qubit, secondQubit: Qubit) {
    const resultQubit = Qubit.ofState(STATE_ZERO);
    const reg = QubitRegister.ofQubits(resultQubit, firstQubit, secondQubit);
    hadSingle(reg, 0);
    // TODO We ne cswap by 0 first
}