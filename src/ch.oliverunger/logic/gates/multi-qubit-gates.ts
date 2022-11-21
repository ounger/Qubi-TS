import {QubitRegister} from "../../model/qubit-register";
import {get1sTruthtableCol, getTruthtableCol} from "../math/truth-table";

export function x(reg: QubitRegister, q: number) {
  ccx(reg, -1, -1, q);
}

/**
 * The Controlled Pauli-X gate (CNOT, CX) is a multi-qubit operation, where one qubit acts as a control and one qubit acts as a target qubit.
 * It performs a NOT operation on the target qubit only when the first qubit is |1>.
 */
export function cx(reg: QubitRegister, c: number, t: number) {
  ccx(reg, c, -1, t);
}

/**
 * Toffoli gate (CCNOT, CCX)
 */
export function ccx(reg: QubitRegister, c0: number, c1: number, t: number) {
  const numQubits = reg.numQubits;
  const numStates = reg.states.length;
  let ttColC0 = c0 >= 0 ? getTruthtableCol(numQubits, c0) : get1sTruthtableCol(numQubits); // Code reduction/duplication: Delegation x or cx -> ccx
  let ttColC1 = c1 >= 0 && c1 !== c0 ? getTruthtableCol(numQubits, c1) : ttColC0; // Code reduction/duplication: Delegation x or cx -> ccx
  let changedSwapPartnerStatesIndices = new Array<number>();
  for (let i = 0; i < numStates; i++) {
    if (ttColC0[i] === 1 && ttColC1[i] === 1 && !changedSwapPartnerStatesIndices.includes(i)) {
      let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1 - t);
      swapStates(reg, i, swapPartnerStateIndex);
      changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
    }
  }
}

function swapStates(reg: QubitRegister, oneStateIndex: number, anotherStateIndex: number) {
  let iState = reg.states[oneStateIndex];
  reg.states[oneStateIndex] = reg.states[anotherStateIndex];
  reg.states[anotherStateIndex] = iState;
}

export function swap(reg: QubitRegister, q0: number, q1: number) {
  // Swap q0 and q1 if q0 > q1
  let temp = q0;
  q0 = Math.min(q0, q1);
  q1 = Math.max(temp, q1);

  const numQubits = reg.numQubits;
  let ttColQ0 = getTruthtableCol(numQubits, q0);
  let ttColQ1 = getTruthtableCol(numQubits, q1);
  let changedSwapPartnerStatesIndices = new Array<number>();
  for (let i = 0; i < reg.states.length; i++) {
    if (ttColQ0[i] !== ttColQ1[i] && !changedSwapPartnerStatesIndices.includes(i)) {
      // Position of swapPartner is: index + sum {i = q0 + 1 to q1} 2^(numQubits - 1 - i)
      // This Summation is equivalent to the following expression.
      // See: https://www.wolframalpha.com/input?i=sum+x%3Da%2B1+to+b+2%5E%28n-1-x%29
      let swapPartnerStateIndex = i + Math.pow(2, numQubits - 1) * (Math.pow(2, -q0) - Math.pow(2, -q1));
      swapStates(reg, i, swapPartnerStateIndex);
      changedSwapPartnerStatesIndices.push(swapPartnerStateIndex);
    }
  }
}

/**
 * Multi-Control Toffoli (MCT) gate
 */
export function mct(controlQubits: number[], targetQubit: number) {
  // TODO
}
