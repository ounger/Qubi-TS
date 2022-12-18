import {QubitRegister} from "../../../../../../main/ch.oliverunger/quantum/multi-qubit/qubit-register";
import {
    createTwoToOneSimonsOracle
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


    test('2 input qubits, Two-to-One Simons oracle, Secret 11', () => {
        const secret: bit[] = [1, 1]; // [1, 0, 0, 1, 1];
        // TODO Das mehrmalige Durchfuehren ist eigentlich Teil des Algorithmus. Hier neues Konzept ueberlegen!
        let zResults = new Array<bit[]>(); // TODO Aendern in ein Set
        // TODO Eine gute Groesse finden: Qiskit empfiehlt Anzahl der Inputqubits
        for (let i = 0; i < 10; i++) {
            const reg = new QubitRegister(secret.length * 2);

            const oracle = createTwoToOneSimonsOracle(reg, secret);
            const result = executeSimonsAlgorithm(reg, oracle);

            // We should measure our input in either 00 or 11
            // expect(result[0]).toEqual(result[1]);
            // So secret dot result should be 0
            expect(dot(secret, result)).toEqual(0);

            if (!contains(zResults, result)) {
                zResults.push(result);
            }
        }

        // Remove zero vector
        const indexZeroVector = zResults.findIndex(r => r.flat().every(v => v === 0));
        if (indexZeroVector > -1) {
            zResults.splice(indexZeroVector, 1);
        }

        solve(zResults);

        // TODO Check
    });

    test('Test One-To-One', () => {
        // TODO
    });

    test('solve', () => {
        const measurements: bit[][] = [
            [0, 0, 0, 1, 1],
            [1, 1, 0, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 0, 0]
        ];
        solve(measurements);
    });


});