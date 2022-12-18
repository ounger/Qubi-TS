import {QubitRegister} from "../../../multi-qubit/qubit-register";
import {Circuit} from "../../circuit";
import {hadSingle} from "../../../multi-qubit/multi-qubit-gates";
import {bit} from "../../../../math/truth-table";
import {printMatrix} from "../../../../math/linear-algebra";
import {xor} from "../../../../util";

export function executeSimonsAlgorithm(reg: QubitRegister, simonsOracle: Circuit): bit[] {
    if (reg.numQubits % 2 === 1) {
        throw new Error("The number of qubits must be divisible by 2.");
    }
    const firstStepCircuit = new Circuit();
    const numInputQubits = reg.numQubits / 2;

    // Input to ket(+)
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        firstStepCircuit.addGate(() => hadSingle(reg, qubit));
    }

    firstStepCircuit.appendCircuitToEnd(simonsOracle)

    firstStepCircuit.execute();

    // Measure output qubits
    const outputResult = new Array<bit>(numInputQubits);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        outputResult[qubit] = reg.measureSingleQubit(numInputQubits + qubit);
    }

    const secondStepCircuit = new Circuit();

    // Hadamard on input qubits
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        secondStepCircuit.addGate(() => hadSingle(reg, qubit));
    }

    secondStepCircuit.execute();

    // Measure input qubits
    const inputResult = new Array<bit>(numInputQubits);
    for (let qubit = 0; qubit < numInputQubits; qubit++) {
        inputResult[qubit] = reg.measureSingleQubit(qubit);
    }

    return inputResult;
}

/**
 * Solves a system of homogeneous linear equations. <br>
 * A homogeneous system is equivalent to a matrix equation of the form <br>
 * Ax = 0 <br>
 * See {@link https://en.wikipedia.org/wiki/System_of_linear_equations#Homogeneous_systems} <br>
 * It is used here to solve the outcome of linear equations from the measurements of
 * Simon's algorithm.
 */
export function solve(measurements: bit[][]) {
    // Implementation described here:
    // https://quantumcomputing.stackexchange.com/a/29407/22394
    validateMeasurements(measurements);
    reduceToRef(measurements);
    transformRefToRref(measurements);
    printMatrix(measurements);

    let indicesWithDiagZero = findIndicesWithDiagZero(measurements);
    let index;
    if (indicesWithDiagZero.length > 0) {
        index = indicesWithDiagZero[0];
    } else {
        index = measurements.length;
    }
    let result = new Array<bit>();
    for (let row = 0; row < index; row++) {
        result.push(measurements[row][index]);
    }
    result.push(1);
    for (let row = index; row < measurements.length; row++) {
        result.push(measurements[row][index]);
    }
    console.log(result);
}

function validateMeasurements(measurements: bit[][]) {
    if (measurements == null || measurements.length < 1) {
        throw new Error("No measurements given!");
    }
    const cols = measurements[0].length;
    for (let m = 1; m < measurements.length; m++) {
        if (measurements[m].length !== cols) {
            throw new Error("All measurements must be of the same length!");
        }
    }
    // To solve for the secret of length n we need exactly n - 1 measurements.
    const rows = measurements.length;
    if (rows !== cols - 1) {
        throw new Error(`Length of the each measurement is ${cols}, so ${cols - 1} measurements are needed! 
        But the number of the given measurements is ${rows}!`);
    }
    // None of the measurements may be the zero vector.
    validateContainsZeroVector(measurements);
}

function validateContainsZeroVector(measurements: bit[][]) {
    if (measurements.some(m => m.flat().every(b => b === 0))) {
        throw new Error('Measurements contain the zero vector!');
    }
}

function reduceToRef(measurements: bit[][]) {
    const rows = measurements.length;
    const cols = measurements[0].length;

    // Reduce to ref
    for (let col = 0; col < cols - 2; col++) {
        const maskSum = reorderRowsBy1InCol(measurements, col);
        applyXORs(measurements, col, maskSum);
        // Check if the equations were linearly independent
        validateContainsZeroVector(measurements); // TODO Really in the for loop?
    }
}

function reorderRowsBy1InCol(measurements: bit[][], col: number): number {
    let maskRowsWith1 = new Array<bit[]>();
    let maskRowsWith0 = new Array<bit[]>();
    for (let row = col; row < measurements.length; row++) {
        if (measurements[row][col] === 1) {
            maskRowsWith1.push(measurements[row]);
        } else {
            maskRowsWith0.push(measurements[row]);
        }
    }
    for (let i = 0; i < maskRowsWith1.length; i++) {
        measurements[col + i] = maskRowsWith1[i];
    }
    for (let i = 0; i < maskRowsWith0.length; i++) {
        measurements[col + i + maskRowsWith1.length] = maskRowsWith0[i];
    }
    return maskRowsWith1.length;
}

function applyXORs(measurements: bit[][], col: number, maskSum: number) {
    for (let i = 0; i < maskSum - 1; i++) {
        // maskSum - 1 because the first row with 1 in this column should stay
        // and all the orders shall get a 0 in this column
        measurements[col + 1 + i] = xor(measurements[col + 1 + i], measurements[col]);
    }
}

function transformRefToRref(measurements: bit[][]) {
    for (let row = 1; row < measurements.length; row++) {
        let indexFirstColWith1InRow = measurements[row].indexOf(1);
        for (let i = 0; i < row; i++) {
            if (measurements[i][indexFirstColWith1InRow] == 1) {
                measurements[i] = xor(measurements[i], measurements[row]);
            }
        }
    }
}

function findIndicesWithDiagZero(measurements: bit[][]): number[] {
    let indicesWithDiagZero = new Array<number>();
    for (let row = 0; row < measurements.length; row++) {
        if (measurements[row][row] === 0) {
            indicesWithDiagZero.push(row);
        }
    }
    return indicesWithDiagZero;
}
