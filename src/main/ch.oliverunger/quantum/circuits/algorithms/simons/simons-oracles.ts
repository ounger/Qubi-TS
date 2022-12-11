import {Circuit} from "../../circuit";
import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {cx} from "../../../multi-qubit/multi-qubit-gates";
import {getNumberAsBitArray} from "../../../../util";
import {bit} from "../../../../math/truth-table";

/**
 * Creates a Simon Oracle for a register with n input qubits and n output qubits.
 */
export function createOneToOneSimonsOracle(reg: QubitRegister): Circuit {
    // TODO Check the register
    // TODO Permutation?
    // TODO Write Tests
    // The hidden bitarray 'secret' is 00...0
    // We copy the content of the first register to the second register
    const circuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;
    for (let inputQubit = 0; inputQubit < numInputQubits; inputQubit++) {
        circuit.addGate(() => cx(reg, inputQubit, numInputQubits + inputQubit));
    }
    return circuit;
}

export function createTwoToOneSimonsOracle(reg: QubitRegister, secret: bit[]): Circuit {
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

    // TODO Permutation
    //     # Apply a random permutation:
    //     pos = [
    //         0,
    //         len(secret_string) - 1,
    //     ]  # Swap some qubits to define oracle. We choose first and last:
    //     yield cirq.SWAP(output_qubits[pos[0]], output_qubits[pos[1]])

    return circuit;
}