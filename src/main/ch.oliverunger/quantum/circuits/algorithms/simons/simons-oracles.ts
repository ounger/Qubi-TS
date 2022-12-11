import {Circuit} from "../../circuit";
import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {cx} from "../../../multi-qubit/multi-qubit-gates";
import {getBitArrayAsNumber, getNumberAsBitArray, xor} from "../../../../util";
import {bit} from "../../../../math/truth-table";

/**
 * Creates a Simon Oracle for a register with n input qubits and n output qubits.
 */
export function createOneToOneSimonOracle(reg: QubitRegister): Circuit {
    // TODO Check the register
    // TODO Permutation?
    // The hidden bitarray 'secret' is 00...0
    // We copy the content of the first register to the second register
    const circuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;
    for (let inputQubit = 0; inputQubit < numInputQubits; inputQubit++) {
        circuit.addGate(() => cx(reg, inputQubit, numInputQubits + inputQubit));
    }
    return circuit;
}

export function createTwoToOneSimonOracle(reg: QubitRegister, secret: bit[]): Circuit {
    const numInputQubits = reg.numQubits / 2;
    const zeroAsBitArray = getNumberAsBitArray(0, numInputQubits);
    if (zeroAsBitArray === secret) {
        throw new Error("Hidden bitarray 'secret' has to be unequal to the bitarray 00...0, because this would be a one-to-one function!");
    }
    const checkedInputs = new Array<number>();
    for (let input = 0; input < Math.pow(2, numInputQubits); input++) {
        if (checkedInputs.includes(input)) {
            continue;
        }
        const partnerInputAsBitArray: bit[] = xor(secret, getNumberAsBitArray(input, numInputQubits));
        const partnerInput = getBitArrayAsNumber(partnerInputAsBitArray);

        // TODO

        checkedInputs.push(input);
        checkedInputs.push(partnerInput);
    }
}