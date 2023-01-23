import {QubitRegister} from '../multi-qubit/qubit-register';
import {getNumberAsBitArray} from '../../util';

export function add(reg: QubitRegister, valueA: number, valueB: number): number {
    const a = getNumberAsBitArray(valueA);
    const b = getNumberAsBitArray(valueB);
    if (reg.numQubits < a.length) {

    }
    return 0;
}