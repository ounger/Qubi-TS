import {Circuit} from "../../circuit";
import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {cx} from "../../../multi-qubit/multi-qubit-gates";
import {getNumberAsBitArray} from "../../../../util";
import {bit} from "../../../../math/truth-table";

export function createSimonsOracle(reg: QubitRegister, secret: bit[]): Circuit {
    if (reg.numQubits % 2 === 1) {
        throw new Error("The number of qubits must be divisible by 2.");
    }
    if (secret.every(b => b === 0)) {
        return createOneToOneSimonsOracle(reg);
    } else {
        return createTwoToOneSimonsOracle(reg, secret);
    }
}

/**
 * Creates an oracle based on a one-to-one function for simons algorithm for a
 * register with n input qubits and n output qubits.
 */
function createOneToOneSimonsOracle(reg: QubitRegister): Circuit {
    // The hidden bitarray 'secret' is 00...0
    // We copy the content of the first register to the second register
    const circuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;
    for (let inputQubit = 0; inputQubit < numInputQubits; inputQubit++) {
        circuit.addGate(() => cx(reg, inputQubit, numInputQubits + inputQubit));
    }
    return circuit;
}

/**
 * Creates an oracle based on a two-to-one function for simons algorithm for a
 * register with n input qubits and n output qubits. <br>
 * See {@link https://quantumcomputing.stackexchange.com/questions/15567/in-simons-algorithm-is-there-a-general-method-to-define-an-oracle-given-a-cert}
 */
function createTwoToOneSimonsOracle(reg: QubitRegister, secret: bit[]): Circuit {
    const numInputQubits = reg.numQubits / 2;
    const zeroAsBitArray = getNumberAsBitArray(0, numInputQubits);
    if (zeroAsBitArray === secret) {
        throw new Error("Hidden bitarray 'secret' has to be unequal to the bitarray 00...0, because this would be a one-to-one function!");
    }

    const circuit = new Circuit();

    // Copy input to output
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        circuit.addGate(() => cx(reg, qubit, numInputQubits + qubit));
    }

    const mostSignificant1BitInSecret = secret.indexOf(1);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        if (secret[qubit] === 1) {
            circuit.addGate(() => cx(reg, mostSignificant1BitInSecret, numInputQubits + qubit));
        }
    }

    return circuit;
}