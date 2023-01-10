import {Circuit} from "../../circuits/circuit";
import {QubitRegister} from "../../multi-qubit/qubit-register";
import {hadSingle, x} from "../../multi-qubit/multi-qubit-gates";
import {Bit} from "../../../math/truth-table";

export function executeDeutschJozsaAlgorithm(reg: QubitRegister, djOracle: Circuit): Bit[] {
    const numQubits = reg.numQubits;
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        hadSingle(reg, qubit);
    }
    x(reg, numQubits - 1);
    hadSingle(reg, numQubits - 1);

    djOracle.execute();

    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        hadSingle(reg, qubit);
    }

    const result = new Array<Bit>(numQubits - 1);
    for (let qubit = 0; qubit < numQubits - 1; qubit++) {
        result[qubit] = reg.measureSingleQubit(qubit);
    }
    return result;
}