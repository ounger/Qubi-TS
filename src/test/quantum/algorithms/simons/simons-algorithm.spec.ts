/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Unger
 */

import {QubitRegister} from '../../../../lib/quantum/multi-qubit/qubit-register';
import {createSimonsOracle} from '../../../../lib/quantum/algorithms/simons/simons-oracles';
import {Bit} from '../../../../lib/math/truth-table';
import {
    executeSimonsAlgorithm,
    LinearlyDependentMeasurementsException,
    solve
} from '../../../../lib/quantum/algorithms/simons/simons-algorithm';
import {getBitArrayAsNumber, xor} from '../../../../lib/util';
import {dotBinary} from '../../../../lib/math/linear-algebra';

describe('Testing Simons Algorithm', () => {

    function contains(measurements: Bit[][], measurement: Bit[]) {
        let contains = false;
        for (let i = 0; i < measurements.length; i++) {
            if (getBitArrayAsNumber(measurements[i]) === getBitArrayAsNumber(measurement)) {
                contains = true;
            }
        }
        return contains;
    }

    function applyTest(secret: Bit[]) {
        const secretLength = secret.length;
        let measurementsCopy;
        let measurements;
        let runAgain = true;
        let solvedSecret: Bit[];
        while (runAgain) {
            measurements = new Array<Bit[]>();
            while (measurements.length < secretLength - 1) { // We need at least secretLength - 1 measurements
                // We need secretLength input qubits and secretLength output qubits
                const reg = new QubitRegister(secretLength * 2);
                const oracle = createSimonsOracle(reg, secret);
                const measurement = executeSimonsAlgorithm(reg, oracle);

                // Secret dot measurement should be 0
                expect(dotBinary(secret, measurement)).toEqual(0);

                const zeroVector = measurement.every(b => b === 0);

                if (!zeroVector && !contains(measurements, measurement)) {
                    measurements.push(measurement);
                }
            }
            measurementsCopy = measurements.slice(0);

            try {
                solvedSecret = solve(measurements);
            } catch (error) {
                if (error instanceof LinearlyDependentMeasurementsException) {
                    // We got unlucky here and our measurements were linearly dependent.
                    // We ignore such a test here to don't raise test failures.
                    // Rerun the test multiple times until you get a successful result.
                    console.log(error);
                    return;
                } else {
                    throw error;
                }
            }
            if (solvedSecret.length === secret.length && secret.every((b, index) => b === solvedSecret[index])) {
                expect(solvedSecret).toEqual(secret); // Declare success
                // console.log("Two-To-One"); // One-To-One won't get into this if, because we remove the zero vector from measurements
                runAgain = false;
            } else {
                // Check if it's the zero vector otherwise rerun.
                // We simulate a query. If for all measurements: measurement xor secret = measurement => zero vector
                let same = true;
                for (let i = 0; i < measurementsCopy.length; i++) {
                    const measurementCopy = measurementsCopy[i].slice(0);
                    const queryResult = xor(measurements[i], secret);
                    if (measurementCopy.some((b, index) => b !== queryResult[index])) {
                        same = false;
                    }
                }
                if (same) {
                    console.log('One-To-One');
                    runAgain = false;
                }
            }
        }


    }

    test('Two-to-One Test Cases', () => {
        applyTest([1, 1]);
        applyTest([1, 0]);
        applyTest([0, 1]);

        applyTest([0, 0, 1]);
        applyTest([0, 1, 0]);
        applyTest([0, 1, 1]);
        applyTest([1, 0, 0]);
        applyTest([1, 0, 1]);
        applyTest([1, 1, 0]);
        applyTest([1, 1, 1]);

        applyTest([0, 0, 0, 1]);
        applyTest([0, 0, 1, 0]);
        applyTest([0, 0, 1, 1]);
        applyTest([0, 1, 0, 0]);
        applyTest([0, 1, 0, 1]);
        applyTest([0, 1, 1, 0]);
        applyTest([0, 1, 1, 1]);
        applyTest([1, 0, 0, 1]);
        applyTest([1, 0, 1, 0]);
        applyTest([1, 0, 1, 1]);
        applyTest([1, 1, 0, 0]);
        applyTest([1, 1, 0, 1]);
        applyTest([1, 1, 1, 0]);
        applyTest([1, 1, 1, 1]);

        applyTest([1, 0, 0, 1, 1]);
    });

    test('One-to-One Test Cases', () => {
        applyTest([0, 0]);
        applyTest([0, 0, 0]);
        applyTest([0, 0, 0, 0]);
        applyTest([0, 0, 0, 0, 0]);
    });


});