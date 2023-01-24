import {Circuit} from "./circuit";
import {QubitRegister} from "../multi-qubit/qubit-register";
import {Bit} from "../../math/truth-table";
import {x} from "../multi-qubit/multi-qubit-gates";

export function createEncodeNumberCircuit(reg: QubitRegister, encodedNumber: Bit[], offset: number = 0): Circuit {
    if (reg.numQubits - offset < encodedNumber.length) {
        throw new Error(`The number of available qubits ${reg.numQubits - offset} has to be greater or equal to 
        the length of the bit array for the encoded number which is ${encodedNumber.length}.`);
    }

    let constructionString = "";
    const circuit = new Circuit();
    for (let qubit = 0; qubit < encodedNumber.length; qubit++) {
        if (encodedNumber[qubit] === 1) {
            circuit.addGate(() => x(reg, qubit + offset));
            constructionString += `X(${qubit + offset}) `;
        }
    }

    console.log(constructionString);
    return circuit;
}