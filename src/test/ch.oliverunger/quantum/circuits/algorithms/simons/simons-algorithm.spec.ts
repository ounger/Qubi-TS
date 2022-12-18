import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {
    createSimonsOracle
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/simons/simons-oracles";
import {bit} from "../../../../../../main/ch.oliverunger/math/truth-table";
import {
    executeSimonsAlgorithm,
    solve
} from "../../../../../../main/ch.oliverunger/quantum/circuits/algorithms/simons/simons-algorithm";
import {getBitArrayAsNumber} from "../../../../../../main/ch.oliverunger/util";

describe('Testing Simons Algorithm', () => {

    function dot(secret: bit[], z: bit[]): number {
        let accum = 0
        for (let i = 0; i < secret.length; i++) {
            accum += secret[i] * z[i];
        }
        return (accum % 2);
    }

    function contains(zResults: bit[][], result: bit[]) {
        let contains = false;
        for (let i = 0; i < zResults.length; i++) {
            if (getBitArrayAsNumber(zResults[i]) === getBitArrayAsNumber(result)) {
                contains = true;
            }
        }
        return contains;
    }

    function applyTest(secret: bit[]) {
        const secretLength = secret.length;
        const measurements = new Array<bit[]>();
        while (measurements.length < secretLength - 1) { // We need at least secretLength - 1 measurements
            // We need secretLength input qubits and secretLength output qubits
            const reg = new QubitRegister(secretLength * 2);
            const oracle = createSimonsOracle(reg, secret);
            const measurement = executeSimonsAlgorithm(reg, oracle);

            // Secret dot measurement should be 0
            expect(dot(secret, measurement)).toEqual(0);

            const zeroVector = measurement.every(b => b === 0);

            if (!zeroVector && !contains(measurements, measurement)) {
                measurements.push(measurement);
            }
        }
        const solvedSecret = solve(measurements);
        expect(solvedSecret).toEqual(secret);

        // TODO Verify f(x) = f(x xor secret)
    }

    test('Two-to-One Test Cases', () => {
        // applyTest([1, 1]);
        // applyTest([1, 0]);
        // applyTest([0, 1]);
        //
        // applyTest([0, 0, 1]);
        // applyTest([0, 1, 0]);
        // applyTest([0, 1, 1]);
        // applyTest([1, 0, 0]);
        // applyTest([1, 0, 1]);
        // applyTest([1, 1, 0]);
        // applyTest([1, 1, 1]);
        //
        // applyTest([0, 0, 0, 1]);
        // applyTest([0, 0, 1, 0]);
        // applyTest([0, 0, 1, 1]);
        // applyTest([0, 1, 0, 0]);
        applyTest([0, 1, 0, 1]);
        // applyTest([0, 1, 1, 0]);
        // applyTest([0, 1, 1, 1]);
        // applyTest([1, 0, 0, 1]);
        // applyTest([1, 0, 1, 0]);
        // applyTest([1, 0, 1, 1]);
        // applyTest([1, 1, 0, 0]);
        // applyTest([1, 1, 0, 1]);
        // applyTest([1, 1, 1, 0]);
        // applyTest([1, 1, 1, 1]);
        //
        // applyTest([1, 0, 0, 1, 1]);
    });

    test('One-to-One Test Cases', () => {
        applyTest([0, 0]);
    });


});